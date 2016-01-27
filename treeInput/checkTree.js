/*
	created by jxz 2016.1.25
*/ 
// 最小宽度的设置要考虑到层级数目，不然可能一部分会看不到
// 可以设置最大高度和最小高度，如果超出设置的时候，显示出滚轮
// 可以设置显示的图片及交互时的效果
// 传入的参数包括：层级数，是否显示复选框，每一层级的数据（name）;还要判断是否已经更改过数据，如果没有更改直接不传数据
function CheckTree(type){
	this.arg=type;
	this.html='';
	// 设置默认值
	this.width='30px';
	this.left='0px';
	this.position='absolute';
	this.type='radio';//单选or复选出现复选框
	this.parent=document.body;
	// 实际传进的参数值
	for(var i in this.arg){
		this[i]=this.arg[i];
	}
}
CheckTree.prototype={
	constructor:CheckTree,
	initUI:function(){
		this.setType();
		this.setWidth();
		this.setLeft();
		this.showChildren();
		this.checkbox();
		this.chooseAll();
		this.affectParent();
	},
	setType:function(){
		var _this=this;
		var scriptArr=_this.scriptId;
		// tab初始化
		$.ajax({
			url:_this.url,
			data:{
				uid:_this.uid,
				initId:_this.initId
			},
			success:function(data){
				var data=eval('('+data+')');
				if(data.status ==1){
					// 首次渲染页面
					var tmp='{{each msgDetail as value i}}'+
								 '<li class="{{if value.hasChildren == true}}hasChildren{{/if}}" data-rootId="{{value.id}}">'+
                        			'<span class="root" data-choose="{{if value.allChoose == true}}true{{else if value.allChoose ==false}}false{{/if}}">'+
                        			'<i class="checkbox {{if value.allChoose ==true}}ok{{/if}}"></i><span>{{value.name}}</span></span>'+
                        			'</span>'+
                        		'</li>'+
							'{{/each}}';
					$('#'+scriptArr[0]).append(tmp);
					var html=template(scriptArr[0],data);
					$('#checkable ul').append(html);
				}else{
					alert(data.msgInfo);
				}	
			},
			error:function(){
				alert('error');
			}
		});
	},
	setWidth:function(){
		$('#checkable').css('width',this.width);
	},
	setLeft:function(){
		$('#checkable').css({'position':this.position,'left':this.left});
	},
	showChildren:function(){
		var _this=this;
		var scriptArr=_this.scriptId;
		$(document).on('click','.root',function(){
			var $this=$(this);
			var $rootid=$this.parents('li').data('rootid');
			var $choose=$this.data('choose');
			alert('传入的choose值'+$choose);
			if($this.data('hasLoad')!= 1){
				$.ajax({
					url:_this.url,
					data:{
						uid:_this.uid,
						rootid:$rootid,
						choose:$choose
					},
					success:function(data){
						var data=eval('('+data+')');
						//父节点有孩子且status是1时点击才进行请求； 
						if(data.status ==1&&($this.parents('li').hasClass('hasChildren'))){
	      					var tmp='<ul class="rootChildren">'+
	      								'{{each msgDetail as value i}}'+
	      									'<li  data-rootId="{{value.id}}"><span class="root" data-choose="{{if value.allChoose == true}}true{{else if value.allChoose ==false}}false{{/if}}">'+
	      									'<i class="checkbox {{if value.allChoose ==true}}ok{{/if}}"></i><span>{{value.name}}</span></span></li>'+
	      								'{{/each}}'+
	      							'</ul>';
							$('#'+scriptArr[1]).append(tmp);
							var html=template(scriptArr[1],data);
							$this.parent().append(html);		
							$this.parent().children('.rootChildren').slideToggle(200,'linear');
							
						}else{
							alert('该层没有子级');
							return false;
						}
						// 作为请求过的标识
						$this.data('hasLoad',1);
					},
					error:function(){
						alert('error');
					}
				});
			}else{
				$this.parent().children('.rootChildren').slideToggle(200,'linear');
			}		
		});
	},
	checkbox:function(){
		$(document).on('click','#checkable .checkbox',function(){
			$(this).toggleClass('ok');
			var $root=$(this).parent('.root');
			// 改变当前对象的data-choose值
			$(this).hasClass('ok')?$root.data('choose',true):$root.data('choose',false);
			return false;
		});
	},
	chooseAll:function(){
		// 要区分出展开和未展开的状态
		$(document).on('click','#checkable .checkbox',function(){
			if($(this).hasClass('ok')){
				$(this).parents('.root').parent().children('ul').find('.checkbox').addClass('ok');
				// 改变子节点对应对象的data-choose值
				$(this).parents('.root').parent().children('ul').find('.root').data('choose',true);
			}else{
				$(this).parents('.root').parent().children('ul').find('.checkbox').removeClass('ok');
				// 改变子节点对应对象的data-choose值
				$(this).parents('.root').parent().children('ul').find('.root').data('choose',false);
			}
			return false;
		});
	},
	affectParent:function(){
		$(document).on('click','#checkable .checkbox',function(){
			var $sibling=$(this).parents('ul').eq(0).children('li');
			var $length=$sibling.length;
			var n=0;
			for(var i=0; i<$length ;i++){
				if($sibling.find('.checkbox').eq(i).hasClass('ok')){
					n++;
				}
			}
			if(n ==$length){
				$(this).parents('ul').prev().find('.checkbox').addClass('ok');
				// 同步操作数据
				$(this).parents('ul').prev().find('.root').data('choose',true);
			}else{
				$(this).parents('ul').prev().find('.checkbox').removeClass('ok');
				// 同步操作数据
				$(this).parents('ul').prev().find('.root').data('choose',false);
			}
		});
	}
};
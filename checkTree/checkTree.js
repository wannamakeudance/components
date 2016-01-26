/*
	created by jxz 2016.1.21
*/ 
// 最小宽度的设置要考虑到层级数目，不然可能一部分会看不到
// 想下怎么存储数据，这个行为肯定是加在点击事件上的
// 可以设置最大高度和最小高度，如果超出设置的时候，显示出滚轮
// 可以设置显示的图片及交互时的效果
// 传入的参数包括：层级数，是否显示复选框，每一层级的数据（name）;还要判断是否已经更改过数据，如果没有更改直接不传数据
function CheckTree(type){
	this.arg=type;
	this.html='';
	// 设置默认值
	this.width='30px';
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
		this.showChildren();
	},
	setType:function(){
		var _this=this;
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
                        			'<span class="root"><i class="checkbox"></i><span>{{value.name}}</span></span>'+
                        			'</span>'+
                        		'</li>'+
							'{{/each}}';
					$('#root1').append(tmp);
					var html=template('root1',data);
					$('#checkable ul').append(html);
				}else{
					alert(data.msgInfo);
				}	
			},
			error:function(){
				alert('请求服务出问题了1');
			}
		});
	},
	setWidth:function(){
		$('#checkable').css('width',this.width);
	},
	showChildren:function(){
		var _this=this;
		$(document).on('click','.root',function(){
			var $this=$(this);
			var $rootid=$this.parents('li').data('rootid');
			if($this.data('hasLoad')!= 1){
				$.ajax({
					url:_this.url,
					data:{
						uid:_this.uid,
						rootid:$rootid
					},
					success:function(data){
						var data=eval('('+data+')');
						//父节点有孩子且status是1时点击才进行请求； 
						if(data.status ==1&&($this.parents('li').hasClass('hasChildren'))){
	      					var tmp='<ul class="rootChildren">'+
	      								'{{each msgDetail as value i}}'+
	      									'<li  data-rootId="{{value.id}}"><i class="checkbox"></i><span class="root"><span>{{value.name}}</span></span></li>'+
	      								'{{/each}}'+
	      							'</ul>';
							$('#root2').append(tmp);
							var html=template('root2',data);
							$this.parent().append(html);		
							$this.parent().children('.rootChildren').slideToggle(200,'linear');
							
						}else{
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
	}
};
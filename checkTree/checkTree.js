/*
	created by jxz 2016.1.21
*/ 

// 传入的参数包括：层级数，是否显示复选框，每一层级的数据（name）;还要判断是否已经更改过数据，如果没有更改直接不传数据
function CheckTree(type){
	this.arg=type;
	this.html='';
	// 设置默认值
	this.width='30px';
	this.height='60px';
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
		// this.setWidth();
		// this.setHeight();
		this.showChildren();
	},
	setType:function(){
		// tab初始化
		$.ajax({
			url:'../lib/testData/treeShow.json',
			data:{
				uid:'0092',
				rootid:'4848'
			},
			success:function(data){
				var data=eval('('+data+')');
				if(data.status ==1){
					// 首次渲染页面
					var tmp='{{each msgDetail as value i}}'+
								 '<li class="{{if value.hasChildren == true}}hasChildren{{/if}}">'+
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
		// $(this.id).css('width',this.width);
	},
	setHeight:function(){
		// $(this.id).css('height',this.height);
	},
	showChildren:function(){
		$(document).on('click','.root',function(){
			var $this=$(this);
			if($this.data('hasLoad')!= 1){
				$.ajax({
					url:'../lib/testData/treeShow.json',
					data:{
						uid:'9922',
						rootid:'9daa'
					},
					success:function(data){
						var data=eval('('+data+')');
						//父节点有孩子且status是1时点击才进行请求； 
						if(data.status ==1&&($this.parents('li').hasClass('hasChildren'))){
							var tmp='{{each msgDetail as value i}}'+
									'<ul class="rootChildren">'+
	                            		'<li><i class="checkbox"></i><span class="root"><span>{{value.name}}</span></span></li>'+
	                            	'</ul>'+
	            					'{{/each}}';
							$('#root2').append(tmp);
							var html=template('root2',data);
							$this.parent().append(html);		
							$this.parent().children('.rootChildren').slideToggle(200,'linear');

							// $this.find(sonName).slideToggle(150,'linear');
							// // 改变小三角方向和图标样式
							// $this.children('.l').find('.add').removeClass('tri-top').addClass('tri-right');
							// $this.children('.l').find('.docPic').addClass('docOpen');
							
						}else{
							return false;
						}
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
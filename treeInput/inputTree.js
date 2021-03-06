// 存储数据
function InputTree(type){
	this.arg=type;
	this.html='';
	// 设置默认值
	this.width='200px';
	this.left='0px';
	this.position='absolute';
	this.type='radio';//单选or复选出现复选框
	this.parent=document.body;
	// 实际传进的参数值
	for(var i in this.arg){
		this[i]=this.arg[i];
	}
}
InputTree.prototype={
	constructor:InputTree,
	initUI:function(){
		$(this.treeId).slideUp(200,'linear');
		this.setWidth();
		this.autoComplete();
		this.checkTree();
		this.confirmTree();
	},
	setWidth:function(){
		$(this.inputId).css('width',this.width);
	},
	autoComplete:function(){
		var _this=this;
		$.ajax({
			'url':_this.autoUrl,
			// data数据
			'data':{
				uid:_this.uid
			},
			'success':function(data){
				var data=eval('('+data+')');
				_this.availableTags=data;
			},
			'error':function(){
				alert('error');
			}
		});
	  
		$(document).on('keydown',this.inputId,function(){
	    	$(_this.treeId).slideUp(200,'linear');
    		// 调用autocomplete组件
		    $( _this.inputId ).autocomplete({
		      minLength: 0,
		      source: _this.availableTags,
		      select: function( event, ui ) {
		        $(_this.inputId).val( ui.item.name );
		        $( "#project-id" ).val( ui.item.desc);
		        _this.searchResult();
		        return false;
			  }
		    });
	    });	
	},
	checkTree:function(){
		var _this=this;
		$(document).on('click',this.inputId,function(){
	    	var $width=$(_this.inputId).width()+'px';
	    	var $left=$(_this.inputId).offset().left+'px';
	    	if($(_this.treeId+' li').length== 0&&($(_this.inputId).val() == '')){
		    	// 调用tree组件
				var CheckTreeUI=new CheckTree(
					{
						'width':$width,
						'left':$left,
						'type':_this.treeType,
						'position':'absolute',
						'url':_this.treeUrl,
						'uid':_this.uid,
						'initId':_this.initId,//第一次进入页面时请求
						'scriptId':['root1','root2']//script标签的id，用来渲染模板
					});
				CheckTreeUI.initUI();
				$(_this.treeId).slideDown(300,'linear');
	    	}else if($(_this.treeId+' li').length != 0&&($(_this.inputId).val() == '')){
	    		_this.text='';
	    		$(_this.treeId).slideDown(300,'linear');
	    	}
	    });	
	},
	confirmTree:function(){
		var _this=this;
		_this.text='';
		if(_this.treeType == 'radio'){
			// 如果前面没有复选框时
			$(document).on('click','.root',function(){
				var $text=$(this).find('span').text();
				_this.text+=$text+'，';
				$(_this.inputId).val(_this.text.substring(0,_this.text.length-1));
				$(_this.inputId).attr('title',_this.text.substring(0,_this.text.length-1));
			})
		}else{
			// 如果前面有复选框
			$(document).on('click','.checkbox',function(){
				// 选中的是根节点
				if(!$(this).hasClass('ok')){
					var $text=$(this).next().text();
					// input里面没有存在的值
					($(_this.inputId).val().indexOf($text) == -1)?_this.text+=$text+'，':_this.text=_this.text;
					$(_this.inputId).val(_this.text.substring(0,_this.text.length-1));
					$(_this.inputId).attr('title',_this.text.substring(0,_this.text.length-1));			
				}else{

				}
				//选中的是子节点
			
			})
		}
	},
	searchResult:function(){
		var _this=this;
		alert($("#project-id").val());
		$.ajax({
			url:'',
			data:{},
			success:function(){
				// 搜索成功之后展示出树
				$(_this.treeId).slideDown(300,'linear');	
				// 寻找搜索关键词的最根节点，进行展开并且置顶
				$('li[data-rootid='+$('#project-id').val()+']>.root').addClass('on');
				// $('#checkable >ul').scrollTop(300);
				// 如果孩子展开过直接slideDown，如果没有则直接异步请求
				$('li[data-rootid='+$('#project-id').val()+']').find('ul').slideDown(200,'linear');
			},
			error:function(){
				alert('error');
			}
		});
	}
};
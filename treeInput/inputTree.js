function InputTree(type){
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
InputTree.prototype={
	constructor:InputTree,
	initUI:function(){
		$(this.treeId).slideUp(200,'linear');
		this.autoComplete();
		this.checkTree();
		this.confirmTree();
	},
	autoComplete:function(){
		var availableTags = [
	      "ActionScript",
	      "AppleScript",
	      "Asp",
	      "BASIC",
	      "C",
	      "C++",
	      "Clojure",
	      "COBOL",
	      "ColdFusion",
	      "Erlang",
	      "Fortran",
	      "Groovy",
	      "Haskell",
	      "Java",
	      "JavaScript",
	      "Lisp",
	      "Perl",
	      "PHP",
	      "Python",
	      "Ruby",
	      "Scala",
	      "Scheme"
	    ];
	    var _this=this;
		$(document).on('keydown',this.inputId,function(){
	    	$(_this.treeId).slideUp(200,'linear');
    		// 调用autocomplete组件
		    $( _this.inputId ).autocomplete({
		      source: availableTags
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
						'position':'absolute',
						'url':_this.treeUrl,
						'uid':_this.uid,
						'initId':_this.initId,//第一次进入页面时请求
						'scriptId':['root1','root2']//script标签的id，用来渲染模板
					});
				CheckTreeUI.initUI();
				$(_this.treeId).slideDown(300,'linear');
	    	}else if($(_this.treeId+' li').length != 0&&($(_this.inputId).val() == '')){
	    		$(_this.treeId).slideDown(300,'linear');
	    	}
	    });	
	},
	confirmTree:function(){
		var _this=this;
		$(document).on('click','.root',function(){
			var $text=$(this).find('span').text();
			$(_this.inputId).val($text);
		})
	}
};
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
		$('#checkable').slideUp(200,'linear');
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
	      "Scheme",
			"jing"
	    ];
		$(document).on('keydown','#tags',function(){
	    	$('#checkable').slideUp(200,'linear');
    		// 调用autocomplete组件
		    $( "#tags" ).autocomplete({
		      source: availableTags
		    });
	    });	
	},
	checkTree:function(){
		$(document).on('click','#tags',function(){
	    	var $width=$('#tags').width()+'px';
	    	var $left=$('#tags').offset().left+'px';
	    	if($('#checkable li').length== 0&&($('#tags').val() == '')){
		    	// 调用tree组件
				var CheckTreeUI=new CheckTree(
					{
						'width':$width,
						'left':$left,
						'position':'absolute',
						'url':'../lib/testData/treeShow.json',
						'uid':'0022',
						'initId':'2231',//第一次进入页面时请求
						'scriptId':['root1','root2']//script标签的id，用来渲染模板
					});
				CheckTreeUI.initUI();
				$('#checkable').slideDown(300,'linear');
	    	}else if($('#checkable li').length != 0&&($('#tags').val() == '')){
	    		$('#checkable').slideDown(300,'linear');
	    	}
	    });	
	},
	confirmTree:function(){
		$(document).on('click','.root',function(){
			var $text=$(this).find('span').text();
			$('#tags').val($text);
		})
	}
};
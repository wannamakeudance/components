/*
	created by jxz 2016.1.21
*/ 

// 传入的参数包括：层级数，是否显示复选框，每一层级的数据（name）
function CheckTree(type){
	this.arg=type;
	this.html='';
	// 设置默认值
	this.width='30px';
	this.height='60px';
	this.type='radio';//单选or复选出现复选框
	this.parent='body';
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
		this.setHeight();
	},
	setType:function(){
		if(this.type == 'radio'){
			// 单选
			this.html='';
		}else{
			// 复选，前面出现复选框
			this.html='';
		}
		$(this.parent).append(this.html);
	},
	setWidth:function(){
		$(this.id).css('width',this.width);
	},
	setHeight:function(){
		$(this.id).css('height',this.height);
	},
};
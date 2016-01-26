/*
	created by jxz 2016.1.20
*/ 
function ValFun(type){
	this.arg=type;
	this.html='';
	// 设置默认值，未传值时保证程序健壮性
	this.width='20px';
	this.height='10px';
	this.type='text';
	this.parent='body';
	this.placeholder='';
	this.maxlen=10;
	// 实际传进的参数值
	for(var i in this.arg){
		this[i]=this.arg[i];
	}
}
ValFun.prototype={
	constructor: ValFun,
	initUI:function(){
		this.setType();
		this.setHeight();
		this.setWidth();
		this.setPlaceholder();
	},
	number:function(){
		var re=/^[0-9]*$/;
		return re.test(this.value);
	},
	email:function(){
		var re=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
		return re.test(this.value);
	},
	length:function(){
		if(this.value.length>this.maxlen){
			return false;
		}else{
			return true;
		}
	},
	required:function(){
		return $(this.id).val() != '';
	},
	setType:function(){
		var str=this.id;
		if(str.indexOf('#')!= -1){
			str=str.substring(1);
			if(this.type == 'text'){
				this.html='<span class="inputbox"><input type="text" id="'+str+'"/><a href="javascript:;" class="clearInput">×</a><span>';
			}else if(this.type =='textarea'){
				this.html='<textarea id="'+str+'"></textarea>';
			}
		}else{
			str=str.substring(1);
			if(this.type == 'text'){
				this.html='<span class="inputbox"><input type="text" id="'+str+'"/><a href="javascript:;" class="clearInput">×</a><span>';
			}else if(this.type =='textarea'){
				this.html='<textarea class="'+str+'"></textarea>';
			}
		}
		$(this.parent).append(this.html);
		this.clear();
	},
	setWidth:function(){
		var $closeW=$(this.id+'+ .clearInput').width();
		var $boxW=parseInt(this.width);
		$(this.id).css('width',($boxW-$closeW)+'px');
	},
	setHeight:function(){
		var $boxH=parseInt(this.height);
		$(this.id).css('height',($boxH-4)+'px');
		$(this.id+'+ .clearInput').css('height',($boxH-3)+'px');
	},
	setPlaceholder:function(){
		$(this.id).attr('placeholder',this.placeholder);
	},
	clear:function(){
		var _this=this;
		$(document).on('click',this.id+'+ .clearInput',function(){
			$(_this.id).val('');
			$(_this.id).parent().css('border','1px solid #000');
		});
	}
};

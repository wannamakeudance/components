// 设置输入框的宽和高，输入的字数限制
// 是否可以点掉小叉叉进行清除
// 写成extend格式
// 保证健壮性，如果不输入某个属性时，默认是多少
function ValFun(type){
	this.arg=type;
	this.html='';
	// 设置默认值，未传值时保证程序健壮性
	this.width='20px';
	this.height='1px';
	this.type='text';
	this.parent='body';
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
		var re=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
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
				this.html='<input type="text" id="'+str+'"/>';
			}else if(this.type =='textarea'){
				this.html='<textarea id="'+str+'"></textarea>';
			}
		}else{
			str=str.substring(1);
			if(this.type == 'text'){
				this.html='<input type="text" class="'+str+'"/>';
			}else if(this.type =='textarea'){
				this.html='<textarea class="'+str+'"></textarea>';
			}
		}
		$(this.parent).append(this.html);
	},
	setWidth:function(){
		$(this.id).css('width',this.width);
	},
	setHeight:function(){
		$(this.id).css('height',this.height);
	},
	setPlaceholder:function(){
		$(this.id).attr('placeholder',this.placeholder);
	}
};

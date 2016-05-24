/*
    @name 自定义下拉框组件
    @file selection
    @author xzjing
*/ 
function OwnSelection(type){
	this.arg = type;
	// 设置默认值
	this.selectionBoxId = '#sel1';
	this.inputId = '#input1';
	this.selectionId = '#selection';
	// 实际传进的参数值
    for(var i in this.arg){
        this[i] = this.arg[i];
    }
}
OwnSelection.prototype = {
	constructor:OwnSelection,
	init:function(){
		this.setWidth();
		this.setSelections();
		this.showSelections();
		this.chooseSelections();
		this.slideUpSelections();
	},
	setWidth:function(){
		$(this.selectionId).css('min-width',0);//去掉bootstrap中对dropdown-menu最小宽度的限制
		$(this.selectionId).width($(this.inputId).width());
	},
	setSelections:function(){
		for(var i = 0; i <this.selectionsArr.length; i++){
			var html = '<li>'+this.selectionsArr[i]+'</li>';
			$(this.selectionId).append(html);
		}
	},
	showSelections:function(){
		var self = this;
		$(this.inputId).click(function(){
			$(self.selectionId).slideToggle();
			return false;
		});
	},
	chooseSelections:function(){
		var self = this;
		$(this.selectionId + ' li').click(function(){
			$(this).closest('ul').slideUp();
			$(self.inputId).val($(this).text());
			self.callback && self.callback();
			return false;
		});
	},
	slideUpSelections:function(){
		var self = this;
		$("*").on('click', function (e) {
            var e = e || event;
            // 点击其他部位，收起下拉框
            if ('#'+$(e.target).closest('.selection').attr('id') != self.selectionBoxId) {
        		$(self.selectionId).slideUp();
            }
            return false;
        });
	}

};
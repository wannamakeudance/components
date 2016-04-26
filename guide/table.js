$(function(){
	var tableFunc = {
		init:function(){
			this.initScroll();
			this.editable();
			this.draggable();
			this.deleteTr();
		},
		initScroll:function(){
			$(".table-responsive").mCustomScrollbar({
  				theme:"dark"
  			});
		},
		editable:function(){
			var self = this;
			$(document).on('click','#sourceDataTable td',function(){
				// 清除其他行的样式
				$('#sourceDataTable div').removeClass('editable').attr('contenteditable','false');
				$('#sourceDataTable .check').removeClass('on');
				// 改变当行样式为可编辑
				// 文本
				$('#sourceDataTable tr').css('background','#fff');
				$(this).closest('tr').css('background','#ebedf7')
					.find('.edit').attr('contenteditable','true')
				$(this).closest('tr').find('.pointer').addClass('editable');//所有增加白色可选区
				$(this).closest('tr').find('.check').addClass('on');//checkbox
				// 可下拉
				self.selectable('.btn-select');
				// 可check
				var index = $(this).index();
				self.checkable($(this));

			});
		},
		selectable:function(selId){
			var $btnSelect = $(selId); 
			$btnSelect.each(function(){
				var $curSelect = $(this).find('.cur-select');
				var oSelect = $(this).find('select')[0];
				var $aOption = $(this).find('option');
				oSelect.onchange = function () { 
					var text=oSelect.options[oSelect.selectedIndex].text; 
					$curSelect.html(text);
				 };
			});	
		},
		checkable:function($this){	
			// 多次触发，取消绑定
			$this.unbind('click');
			$this.click(function(){
				$(this).find('.check i').toggle('on');
			});
		},
		draggable:function(){
			$(document).on('click','#sourceDataTable tr',function(){
				
			});
		},
		deleteTr:function(){
			$('#sourceDataTable tr').unbind('hover');
			$('#sourceDataTable tr').hover(function(){
				$('#sourceDataTable tr').css('background','#fff');
				$(this).css('background','#edecf7');
				$(this).find('.circle').toggleClass('on');

			});
			// 显示叉号可以进行删除
			$(document).off('click','icon-cha02');
			$(document).on('click','.icon-cha02:visible',function(){
				$('#sourceDataTable tr:not(:first)').each(function(){
					var $this = $(this).find('div').eq(0);
					var listNum = parseInt($this.text());
					listNum--;
					$this.text(listNum);
				});
				$(this).closest('tr').remove();
			})
		}

	};	
	return tableFunc.init();	
});

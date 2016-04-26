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
				if($( "#sortable" ).sortable() && !$(this).hasClass('first')){				
					$( "#sortable" ).sortable('destroy');
				}

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
				return false;

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
			 $( "#sortable" ).sortable();
			 $(document).on('click','.first',function(){
			 	$( "#sortable" ).sortable();
			 });
		},
		deleteTr:function(){
			$('#sourceDataTable tr').off('mouseenter mouseleave');
			$('#sourceDataTable tr').on({
				mouseenter:function(){
					$(this).find('.circle').addClass('on');	
				},
				mouseleave:function(){
					$(this).find('.circle').removeClass('on');	
				}
			});
			$('#sourceDataTable tr').hover(function(){
				$('#sourceDataTable tr').css('background','#fff');
				$(this).css('background','#edecf7');
			});
			$('#sourceDataTable .first').on('mousedown',function(){
				$(this).closest('tr').find('.circle').removeClass('on');
			})
			// 显示叉号可以进行删除
			$(document).off('click','icon-cha02');
			$(document).on('click','.icon-cha02:visible',function(){
				$(this).closest('tr').remove();
				$('#sourceDataTable tr:not(:first) .listNum').each(function(index,elem){
					$(this).text(index+1);
				});
				
			})
		}

	};	
	return tableFunc.init();	
});

$(function(){
	var tableFunc = {
		init:function(){
			this.initScroll();
			this.editable();
			this.draggable();
			this.deleteTr();
			this.verify = true;//验证标识默认为true
		},
		/*
			自定义滚轮初始化
		*/
		initScroll:function(){
			$(".table-responsive").mCustomScrollbar({
  				theme:"dark"
  			});
		},
		/*
			点击列表时，变成可编辑
		*/
		editable:function(){
			var self = this;
			$(document).off('click','#sourceDataTable td');
			$(document).on('click','#sourceDataTable td',function(e){
				var event = e||event;
				if($( "#sortable" ).sortable() && !$(this).hasClass('first')){	
					//因为sortable和可编辑有冲突，所以编辑前先销毁sortable对象 
					$( "#sortable" ).sortable('destroy');
				}
				// 清除其他行的样式
				$('#sourceDataTable div').removeClass('editable').attr('contenteditable','false');
				$('#sourceDataTable .check').removeClass('on');
				// 文本
				$('#sourceDataTable tr').css('background','#fff');
				$(this).closest('tr').css('background','#ebedf7')
					.find('.edit').attr('contenteditable','true');
				$(this).closest('tr').find('.pointer').addClass('editable');//所有增加白色可选区
				if(!$(this).closest('tr').find('.btn-select').height()){
					$(this).closest('tr').find('.btn-select').height('10px');
				}
				
				// 激活时给下拉框添加默认值
				if(!$(this).find('.selection').length){
						$(this).closest('tr').find('.selection:not(".RegType")').each(function(){
							var text = $(this).find('li').eq(0).text();
							if($(this).find('input').val() ==''){
								$(this).find('input').val(text);
							}
							
						});
				}
				
				// 可下拉
				self.selectable('.selection');
				// 可check
				self.checkable($(this));
				// 当真实点击时，移除鼠标时验证后，创建新一行
				if(event.hasOwnProperty('originalEvent')){
					var index = $(this).closest('tr').index();
					$(this).closest('tr').on('mouseleave',function(){
						self.createNew(index);
					});

				}
				return false;
			});
		},
		/*
			自定义下拉框
		*/
		selectable:function(selId){
			$(document).off('click',selId);
			$(document).off('click',selId+' li');
			
			$(document).on('click',selId,function(){
				$(this).find('ul').addClass('on');
			});
			$(document).on('click',selId+' li',function(){
				$(this).closest(selId).find('input').val($(this).text());
				$(this).closest('ul').removeClass('on');
				return false;
			});
			$("body").off('click');
			$("body").on('click',function(e){
				var e = e||event;
				// 点击Iframe内其他部位，收起下拉框
				if(!($(e.target).closest('ul').attr('class')=='dropdown-menu on')){
					$(selId +' ul').removeClass('on');
				}
			});
		},
		/*
			自定义复选框
		*/
		checkable:function($this){	
			// 多次触发，取消绑定
			if($this.find('.check').length){
				$this.unbind('click');
				$this.click(function(){
					$(this).find('.check i').toggle('on');
					return false;
				});
			}
		},
		/*
			列表行进行拖拽
		*/
		draggable:function(){
			 $( "#sortable" ).sortable();
			 $(document).on('mousedown','.first',function(){
			 	$( "#sortable" ).sortable();
			 	// 拖拽时禁止用户选中文本
			 	$(document).bind("selectstart",function(){
			 		return false;
			 	});  
			 });
			 $(document).on('mouseleave','.first',function(){
			 	// 松手时从新排序
			 	$('#sortable .listNum').each(function(index){
			 		$(this).text(index+1);
			 	});
			 	// 拖拽结束允许用户选中
			 	$(document).off("selectstart");
			 });
		},
		/*
			出现小叉号，对该行进行删除；
			当表格中无空行行时，自动创建空白行
		*/
		deleteTr:function(){
			var self = this;
			$(document).off('mouseenter','#sourceDataTable tr');
			$(document).off('mouseleave','#sourceDataTable tr');
			$(document).on('mouseenter','#sourceDataTable tr',function(){
				$(this).find('.circle').addClass('on');	
				$('#sourceDataTable tr').css('background','#fff');
				$(this).css('background','#edecf7');
			});
			$(document).on('mouseleave','#sourceDataTable tr',function(){
				$(this).find('.circle').removeClass('on');	
				$(this).add('#sourceDataTable tr').css('background','#fff');	
			});
			
			$('#sourceDataTable .first').on('mousedown',function(){
				$(this).closest('tr').find('.circle').removeClass('on');
			})
			// 显示叉号可以进行删除
			$(document).off('click','icon-cha02');
			$(document).on('click','.icon-cha02:visible',function(){
				$(this).closest('tr').remove();
				//当没有空白行时，自动创建一个新的空白行
				var length = $('#sortable tr').length;
				var flag = 0;
				$('#sortable .con').each(function(){
					if($(this).text() == ''){
						flag = 1;
					}
				});
				if(!length || (flag == 0) ){
					$('#sourceDataTable tbody').append(self.initNewHtml(''));
				}
				// 改变余下的序号
				$('#sourceDataTable tr:not(:first) .listNum').each(function(index,elem){
					$(this).text(index+1);
				});
				return false;
			})
		},
		/*
			符合校验规则后进行新空行的创建
		*/
		createNew:function(index){
			var $thisCon = $('#sourceDataTable tr').eq(index+1).find('.con');
			var val = $thisCon.html();
			var length = $('#sourceDataTable tr').length;
			if(val){//名称已填写
				if((index+2) == length){
					var num = index +2;
					$('#sourceDataTable tbody').append(this.initNewHtml(num));	
				}	
			}
			this.verifyFun($thisCon);
		},
		/*
			验证标识及对应交互效果
		*/
		verifyFun:function($thisCon){
			var val = $thisCon.html();
			var length = $('#sourceDataTable tr').length;
			// 判断重复
			var $text = $thisCon.text();
			var repeat = false;
			var n = 0;
			$('#sortable .con').each(function(){
				if($(this).text() == $text){
					n++;
				}
			});
			if(n>1){
				repeat = true;
			}
		
			// 验证必填和不许重名
			if((!repeat)&& val){
				this.verify = false;
				$thisCon.removeClass('error');
			}else{
				this.verify = true;
				$thisCon.addClass('error');
			}
		},
		/*
			新行模板
		*/
		initNewHtml:function(num){
			var newHtml = '<tr class="ui-state-default">'+
				    		'<td class="first w-1">'+
				    			'<div class="listNum">'+(num)+'</div>'+
				    		'</td>'+
				    		'<td class="w-15">'+
								'<div class="edit pointer con"></div>'+
				    		'</td>'+
				    		'<td class="w-1">'+
				    			'<div class="pointer">'+
					                '<div class="selection" id="sel2">'+
					                    '<div class="wrapperIn">'+
					                        '<input value="" readonly="readonly">'+
					                        '<i class="tri"></i>'+
					                    '</div>'+
					                    '<ul class="dropdown-menu">'+
					                     	'<li>文本</li>'+
					                        '<li>时间</li>'+
					                        '<li>货币</li>'+
					                    '</ul>'+
					                '</div>'+
				    			'</div>'+
				    		'</td>'+
				    		'<td class="timeType w-1">'+
				    			'<div class="pointer">'+
								     '<div class="selection" id="sel2">'+
					                    '<div class="wrapperIn">'+
					                        '<input value="" readonly="readonly">'+
					                        '<i class="tri"></i>'+
					                    '</div>'+
					                    '<ul class="dropdown-menu">'+
					                        '<li>小文本</li>'+
					                        '<li>时间格式</li>'+
					                        '<li>货币格式</li>'+
					                    '</ul>'+
					                '</div>'+
				    			'</div>	'+
				    		'</td>'+
				    		'<td class="w-1">'+
				    			'<div class="pointer">'+
								     '<div class="selection RegType" id="sel2">'+
					                    '<div class="wrapperIn">'+
					                        '<input value="" readonly="readonly">'+
					                        '<i class="tri"></i>'+
					                    '</div>'+
					                    '<ul class="dropdown-menu">'+
					                        '<li>7</li>'+
					                        '<li>8</li>'+
					                        '<li>9</li>'+
					                    '</ul>'+
					                '</div>'+
				    			'</div>'+
				    		'</td>'+
				    		'<td class="w-1">'+
				    			'<div class="pointer check"><i class="icon-duigou02"></i></div>'+
				    		'</td>'+
				    		'<td class="des w-6">'+
				    			'<div class="edit pointer">'+
				    			'</div>'+
				    			'<i class="icon-cha02 circle"></i>'+
				    		'</td>'+
				    	'</tr>';
				   return newHtml;
		}

	};	
	return tableFunc.init();	
});

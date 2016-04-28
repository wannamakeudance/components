$(function(){
	var verify = {
		init:function(){
			this.required();
			this.save();
			this.firstVerified = true;//第一步的校验标识
			this.secondVerified = true;//第二步的校验标识
		},
		/*
			实时校验第一步的必填项
		*/
		required:function(){
			var self = this;
			$(document).on('click','.form-group',function(){
				// 检查前面的必填项
				var $before = $(this).prevAll().find('.required');
				$before.each(function(){
					$(this).val() == '' && $(this).addClass('error');
				});
			});
			// 当符合验证规则时恢复样式
			$(document).on('change click','.required',function(){
				if($(this).val != ''){
					$(this).removeClass('error');
				}
			});
		},
		/*
			点击完成时进行校验
		*/
		save:function(){
			var self = this;
			$(document).on('click','.sourceDataSetting .done',function(){
				// 对第一步进行校验
				var n = 0;
				$('#sourceDataSetting1 .required').each(function(){
					if($(this).val() == ''){
						n++;
						$(this).addClass('error');
					}
				});
				n ? self.firstVerified = false :self.firstVerified = true;

				// 对第二步骤进行校验，通过UI样式即可
				var $sourceDataIframe = $("#sourceDataTable").contents();// 获取iframeTable对象
				var errorLength = $sourceDataIframe.find('.error').length;
				errorLength ? self.secondVerified =false :self.secondVerified =true;

				
				if(!self.firstVerified && $('#sourceDataSetting2:visible').length){
					// 第一步不通过校验，跳回第一步
					$('.page1').trigger('click');
					// 第一个错误的输入框光标显示
					$('#sourceDataSetting1').on('shown.bs.modal',function(){
						$('#sourceDataSetting1 input.error').eq(0).focus();
					});
					
				}else if((!self.secondVerified) && self.firstVerified &&  $('#sourceDataSetting1:visible').length){
					// 第二步不通过校验，跳回第二步
					$('.page2').trigger('click');
				}else if(self.firstVerified && self.secondVerified){
					// 当两个步骤的校验均通过时，关闭弹窗
					$('.sourceDataSetting').modal('hide');

					// 清空原本数据
					$('.sourceDataSetting input').val('');//第一步
					$sourceDataIframe.find('#sortable').html(self.clearTr);//第二步

					// 保存成功标识，间隔1s后消失
					$('.saveInfo').fadeIn();
					setTimeout(function(){
						$('.saveInfo').fadeOut();
					},1000);
				}
			});
		},
		clearTr:function(){
			var clearHtml = '<tr class="ui-state-default">'+
	    		'<td class="first w-1">'+
	    			'<div class="listNum">1</div>'+
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
	    			'</div>'+
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
	    	return clearHtml;
		}
	};
	return verify.init();
});
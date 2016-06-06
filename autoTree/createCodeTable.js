$(function(){
	var createCodeTable = {
		init:function(){
			this.initJsons();
			this.initScroll();
			this.toggleChildren();
			this.startInput();
		},
		/*
			初始化数据
		*/
		initJsons:function(){
			//初始化时的示例数据
			var jsons =  [
		         {"id":"1","name":"代码项1","pid":"0"},
		             {"id":"4","name":"代码项11","pid":"1"},
		                 {"id":"10","name":"代码项111","pid":"4"},
		                 {"id":"11","name":"代码项112","pid":"4"},
		             {"id":"5","name":"代码项12","pid":"1"},
		             {"id":"6","name":"代码项13","pid":"1"},
		         {"id":"2","name":"代码项2","pid":"0"},
		             {"id":"7","name":"代码项21","pid":"2"},
		             {"id":"8","name":"代码项22","pid":"2"},
		             {"id":"9","name":"代码项23","pid":"2"}
		     ] ;
	     	this.createTree(jsons,0);
		},
		/*
			自定义滚轮初始化
		*/
		initScroll:function(){
			$('.result').mCustomScrollbar({
				axis:"yx",
				theme:"minimal-dark"
			});
		},
		/*
			构造树
		*/
		createTree:function(jsons,pid){
			if(jsons){
	            var ul = '<ul class="'+pid+'"></ul>';
	            pid ? $('li.'+pid).append(ul) : $('#checkTree').append(ul);
	            for(var i=0;i<jsons.length;i++){
	                 if(jsons[i].pid == pid){//pid是直接父级的id，最根节点的pid是0
	                    var html = '<li class="'+jsons[i].id+'"><i class="tri"></i>' + jsons[i].name + "</li>" ;
	                    $('ul.'+pid).append(html);
	                    // 递归
	                    this.createTree(jsons,jsons[i].id) ;
	                 }
	             }
	             // 为树增加有无子节点的标识
	             $('#checkTree li').each(function(){
	             	$(this).find('li').length && $(this).children('.tri').addClass('hasChildren');
	             });
	        }
	        
		},
		/*
			含子级节点的展开收起
		*/
		toggleChildren:function(){
			$(document).off('click','#checkTree li');
			$(document).on('click','#checkTree li',function(){
				if($(this).children('.tri').hasClass('hasChildren')){
					$(this).children('ul').slideToggle(200);
				}
				return false;
			});
		},
		/*
			左侧输入框的事件；
			不同格式的校验以及树的实时生成
		*/
		startInput:function(){
			var self = this;
			$('.initCon').off('click');
			$('.initCon').off('keydown');
			$('.initCon').on({
				click:function(){
					if($(this).hasClass('first')){
						$(this).removeClass('first');
						$(this).add('.right #checkTree ul').html('');	
						return false;
					}	
				},
				keyup:function(e){
					var e = e||event;
					if(e.which == 13 || 8){//按下的是回车键
						$('.result').mCustomScrollbar('destroy');
						$('#checkTree').html('');
						var leftCon = $('.initCon').val();
						var lastNull = leftCon.lastIndexOf(' ');
						var arr = leftCon.split("\n");

						var findMaxArr = [];
						var max = 0;
						var saveIndex = [];
						// 数组去除空项
						for(var i =0; i<arr.length; i++){
							if(arr[i] == ''){
								arr.splice(i,1);
								i = i-1;
							}
						}
						// 判断数组里每个字符串的"-"的长度
						for(var i = 0; i<arr.length; i++){ 
							var n = 0;
							var str = '';
							for(var j = 0; j<arr[i].length; j++){
								if(arr[i][j] == '-'){
									n++;
								}
							}
							str = arr[i].substring(arr[i].lastIndexOf('-')+1,arr[i].length);
							saveIndex.push({
								n:n,//第几层级
								name:str
							});
							findMaxArr.push(n);
						}
						
						// 找到最根层次的“-”长度
						findMaxArr.sort(function(a,b){
							return b-a;
						});
						max = findMaxArr[0]||max;

						// 加id
						function addId(arr,n,id){
							for(var i = 0; i<arr.length; i++){
								if(arr[i].n == n){
									arr[i].id = id;
									id++;
								}
							}
							if(n<max){
								n++;
								addId(saveIndex,n,id);
							}
						}
						addId(saveIndex,0,1);

					    // 加pid
						for(var i = saveIndex.length-1; i >= 0; i--){
							if(saveIndex[i].n){
								// pid为最靠近它的那个直接父级的id
								for(var  j=i-1; j >= 0; j--){
									if(saveIndex[j].n == (saveIndex[i].n-1)){
										saveIndex[i].pid = saveIndex[j].id;
										j = -1;
									}
								}
							}else{//最外层pid为0
								saveIndex[i].pid = 0;
							}
						}
						console.log(saveIndex);
						self.createTree(saveIndex,0);
						self.initScroll();
					}
				}
			});
		}
	};
	return createCodeTable.init();
})
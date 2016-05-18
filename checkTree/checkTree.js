/*
    @name 树组件
    @file finalTree
    @author xzjing
*/ 
function Tree(type){
    this.arg = type;
    // 设置默认值
    this.html = '';
    this.codeId = '';
    this.left = '0px';
    this.position = 'relative';
    this.type = 'radio';//单选or复选出现复选框
    this.parent = document.body;
    // 实际传进的参数值
    for(var i in this.arg){
        this[i] = this.arg[i];
    }
}
Tree.prototype = {
    constructor:Tree,
    initUI:function(){
        this.setType();
        this.setHeight();
        this.setWidth();
        this.setLeft();
        this.showChildren();
        this.chooseAll();
        this.affectParent();
    },
    /*
        单选模板引擎
    */
    radioTmp:function(){
        return '{{each msgDetail as value i}}'+
                 '<li class="radiobox {{if value.hasChildren == true}}hasChildren{{/if}}" data-code="{{value.treeCode}}">'+
                    '<span class="root">'+
                    '<i class="tri {{if value.hasChildren == true}}hasChildren{{/if}}"></i><span><i class="doc {{if value.hasChildren== true}}hasChildren{{/if}}"></i>{{value.name}}</span></span>'+
                    '</span>'+
                '</li>'+
            '{{/each}}';
    },
    /*
        多选模板引擎
    */
    checkboxTmp:function(){
        return '{{each msgDetail as value i}}'+
                     '<li class="{{if value.hasChildren == true}}hasChildren{{/if}}" data-code="{{value.treeCode}}">'+
                        '<span class="root" data-choose="{{if value.allChoose == "true"}}true{{else if value.allChoose =="false"}}false{{/if}}">'+
                        '<i class="checkbox {{if value.allChoose == "true"}}ok{{/if}}"></i><span><i class="doc {{if value.hasChildren== true}}hasChildren{{/if}}"></i>{{value.name}}</span></span>'+
                        '</span>'+
                    '</li>'+
                '{{/each}}';
    },
    /*
        渲染根节点
    */
    setType:function(){
        var self = this;
        $.ajax({
            url:self.url,
            data:{
                codeId:self.codeId,
                action:"getTreeRoot"
            },
            success:function(data){
                data = JSON.parse(data);
                data.msgDetail = JSON.parse(data.msgDetail);
                if(data.status == 1){
                    // 首次渲染页面
                    var tmp = (self.type =='checkbox') ? self.checkboxTmp() :self.radioTmp();
                    var render = template.compile(tmp);
                    var html = render(data);
                    $(self.treeId +' ul').append(html); 
                }else{
                    alert(data.msgInfo);
                }   
            },
            error:function(){
                console.log('tree setType Ajax error');
            }
        });
    },
    /*
        设置高度
    */
    setHeight:function(){
        this.height && $(this.treeId).css('max-height',this.height);
    },
    /*
        设置宽度
    */
    setWidth:function(){
        this.width? $(this.treeId).css('width',this.width).show():$(this.treeId).addClass(this.class).show();
    },
    /*
        设置左边距
    */
    setLeft:function(){
        $(this.treeId).css({'position':this.position,'left':this.left});
    },
    /*
        点击节点展开子节点
    */
    showChildren:function(){
        var self = this;
        $(document).off('click',self.treeId+' .root');
        $(document).on('click',self.treeId+' .root',function(event,arr,arrLast,text){
            var $this = $(this);
            var $rootid = $this.parents('li').data('code');
            var $choose = $this.data('choose')+'';
            // 有子节点时请求或者展开下一级
            if($this.closest('li').hasClass('hasChildren')){
                if($this.data('hasLoad') != 1){
                    // 首次点开，需要异步加载
                    $.ajax({
                        url:self.url,
                        type:"post",
                        data:{
                            codeId:self.codeId,
                            funId:'['+$rootid+']',
                            choose:$choose,
                            action:'getTreeByParent'
                        },
                        success:function(data){
                            data = JSON.parse(data);
                            data.msgDetail = JSON.parse(data.msgDetail);
                            if(data.status == "1"){
                                var tmp ='<ul class="rootChildren">'+ 
                                            ((self.type == 'checkbox') ?self.checkboxTmp():self.radioTmp())+
                                        '</ul>';
                                
                                var render = template.compile(tmp);
                                var html = render(data);
                                $this.parent().append(html);
                                self.showChildrenUI($this);        
                            }
                            // 作为请求过的标识
                            $this.data('hasLoad',1);
                        },
                        error:function(){
                            console.log('tree showChildren Ajax error');
                        }
                    });
                }else{
                    self.showChildrenUI($this);  
                }
            }
          
        });
    },
    /*
        展开子节点时的交互效果
    */
    showChildrenUI:function($this){
        $this.parent().children('.rootChildren').slideToggle(200,'linear');
        $this.children('.tri').toggleClass('open');
        $this.children('span').find('.doc').toggleClass('open');
    },
    /*
        复选：全选或全不选
    */
    chooseAll:function(){
        var self = this;
        $(document).off('click',this.treeId + ' .checkbox');
        $(document).on('click',this.treeId + ' .checkbox',function(){
            $(this).toggleClass('ok');

            var $root=$(this).parent('.root');
            // 改变当前对象的data-choose值
            $(this).hasClass('ok') ? $root.data('choose',"true") : $root.data('choose',"false");
        
            if($(this).hasClass('ok')){
                $(this).closest('li').find('.checkbox').addClass('ok');
                // 改变子节点对应对象的data-choose值
                $(this).closest('li').find('.root').data('choose',"true");
            }else{
                $(this).closest('li').find('.checkbox').removeClass('ok');
                // 改变子节点对应对象的data-choose值
                $(this).closest('li').find('.root').data('choose',"false");
            }
            return false;
        });
    },
    /*
        复选：选择子节点时对各父辈节点的影响
    */
    affectParent:function(){
        var self = this;
        $(document).on('click',this.treeId + ' .checkbox',function(){
            var $parentCheck = $(this).parents('ul').prev().find('.checkbox');
            for(var i = $parentCheck.length-1 ; i >= 0; i--){
                var m = 0;
                var $sib = $parentCheck.eq(i).closest('li').children('ul').children('li');
                var len = $sib.length;
                for(var j = 0; j< len; j++){
                    if($sib.eq(j).children('.root').find('.checkbox').hasClass('ok')){
                        m++;
                    }
                }
                if(m == len){
                    $parentCheck.eq(i).addClass('ok');
                    $parentCheck.eq(i).parent('.root').data('choose',"true");
                }else{
                    $parentCheck.eq(i).removeClass('ok');
                    $parentCheck.eq(i).parent('.root').data('choose',"false");
                }
            }
        });
    }
};
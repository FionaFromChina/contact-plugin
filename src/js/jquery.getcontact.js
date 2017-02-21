+(function($,window,undefined) {

    var TerminalSelect = function(ele,opt){
        this.$element = ele;
        this.defaults = {
            initData:[],
            contactUrl:"",
            inputName:"",
            callback:{
                beforeDelete: function(item){
                    //return false; 终端删除
                    return true;
                },
                beforeAddedFromInput: function(items){
                    //return false; 不执行添加到下面框的事件
                    return true;
                },
                onSelect: function(items){
                    //items,被选中的items

                }
            }
        };

        this.options = $.extend({},this.defaults,opt);
    };

    TerminalSelect.prototype = { //给插件添加方法
        init: function() {

            var opts = this.options;




        }
    };


    var ContactDialog = function(ele,opt) {
        this.$element = ele;
        this.defaults = {
            data:null,
            fetchUrl :"",
            callback:{
                onSelect : function(items) {

                }
            }
        };
        this.options = $.extend({},this.defaults,opt);
        this.selectedData = [];
    };

    ContactDialog.prototype = {
        init : function() {
            this.$element.on('show.bs.modal',function() {
                this.clearData();
                this.renderData();
                this.fillModalData();
                this.eventInit();
            });

            return this;

        },
        clearData : function(){
            $('#addItemBody').empty();
        },
        renderData :function() {

            if(this.options.data !== null) {
                this.fillModalData(this.options.data);
            }else {
                $.getJSON(this.options.fetchUrl,function(data) {
                    this.fillModalData(data);
                });
            }
        },

        fillModalData : function(initData) {
            var modalLists=$('<ul>',{"class":"modal-lists"}),
                leni=initData.length;
            for(var i=0;i<leni;i++){
                var itemGroup = $('<li>',{
                    "class":"item-group"
                });
                var groupTitle = $('<div>',{
                    "class":"group-title",
                    html:' <input type="checkbox" ' +
                    'id="' +'group'+i + '" ' +
                    'class="groupCheckAll" />' +
                    '<label for="group'+i+'">'+ initData[i].title+'</label>'
                });
                var groupLists = $("<div>",{"class":"group-lists"}),
                    sul = $("<ul>"),
                    lenj = initData[i]["lists"].length;

                sul.appendTo(groupLists);

                for(var j =0;j<lenj;j++){
                    var obj = initData[i]["lists"][j];
                    var labelId = "g"+[i]+"item"+[j];
                    $('<li>').append(
                        $('<input>',{
                            type:"checkbox",
                            id:labelId,
                            "class":"item-checkbox"
                        })).append(
                        $('<label>',{
                            "for":labelId,
                            html:'<img class="item-img img-circle" src="' +obj.imgSrc+ '">' +
                            '<div class="item-detail">' +
                            '<span class="item-name">' +obj.name+ '</span>' +
                            '<br/>' +
                            '<span class="item-phone">'+obj.phone+'</span>' +
                            '</div>'
                        })
                    ).appendTo(sul);
                }
                itemGroup.append(groupTitle).append(groupLists);
                itemGroup.appendTo(modalLists);
        }
        $('#addItemBody').append(modalLists);
    },
        //事件注册
        eventInit : function() {
            //1. 搜索
            $('#searchItem').click(function(e){
                e.preventDefault();
                var text = $('#searchText').val();
                text = text.trim(' ');
                $('.item-detail').filter(function(){
                    var name = $(this).children('.item-name');
                    var phone = $(this).children('.item-phone');
                    if(name.html().indexOf(text)>-1||phone.html().indexOf(text)>-1){
                        $(this).closest('li').show();
                    }else{
                        $(this).closest('li').hide();
                    }
                });
            });
            $('#searchText').keypress(function(e){
                if(e.which==13){
                    $('#searchItem').click();
                }
            });
            //2. 全选/全部取消
            $('#checkAll').click(function(){//全选和全部取消都得是能看见的
                if($(this).is(':checked')){//全选
                    $('#addItemModal input[type=checkbox]').filter(':visible').prop('checked','checked');
                }else{//取消
                    $('#addItemModal input[type=checkbox]').prop('checked',false);
                }
            });
            //4. 分组选中
            $('.groupCheckAll').click(function(e){
                if($(this).is(':checked')){
                    $(this).parent().siblings('.group-lists').find(':checkbox').filter(':visible').prop('checked','checked');
                }else{
                    $(this).parent().siblings('.group-lists').find(':checkbox').prop('checked',false);
                }
                e.stopPropagation();
            });
            //5. 确定

            $('#addItem').click(function(){
                var results=[];
                var lables= $('.item-checkbox').filter(':checked').siblings('label');
                $.each(lables,function(index,item){
                    var data = {};
                    data.imgSrc = $(item).children('.item-img').prop('src');
                    data.name = $(item).find('.item-name').html();
                    data.phone = $(item).find('.item-phone').html();
                    results.push(data);
                });

                this.selectedData = results;

                if(this.options.callback.onSelect) {
                    this.options.callback.onSelect(results);
                }

            });

            //6. 分组栏收缩
            $('.group-title').click(function(e){
                if($(e.target).hasClass('group-title')){
                    var lists = $(this).siblings('.group-lists');
                    if(lists.is(':visible')){
                        lists.slideUp();
                    }else{
                        lists.slideDown();
                    }
                }
            });
        },

        //getData

        getSelected : function() {
            return this.selectedData;
        }

    };




    $.fn.terminalSelect = function(options) {

        //var TerminalSelect = new TerminalSelect(this,options);
        //return TerminalSelect.init();

        var ContactDialog = new ContactDialog(this,options);
        return ContactDialog.init();
    }
}(jQuery,window));
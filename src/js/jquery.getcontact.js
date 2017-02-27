;(function ($) {

    'use strict';

    var TerminalSelect = {

        init : function(options) {

            var defaults = {
                initData:[],
                contactUrl:"",
                inputName:"terminals",
                callback:{
                    //beforeDelete: function(item){
                    //    //return false; 终端删除
                    //},
                    beforeAddedFromInput: function(inputValue){
                        //return false; 不执行添加到下面框的事件
                        return {};
                    },
                    //onSelect: function(items){
                    //    //items,被选中的items
                    //
                    //},
                    onfetchedUrlCalled : function(data){
                        return data;
                    }
                }
            };


            var settings = $.extend({},defaults, options);


            return $(this).each (function(){

                $(this).empty();

                //Part1: select Dom and event;
                //1.1. create Dom fragment;

                //1.1.1 terminal Dom
                var $terminalSubDom = $('<div class="ts-choose-list"><div class="ts-add-input-box"><input class="ts-search-input" id="tsAddInput" type="text" placeholder="这里是placeholder" /> <div class="ts-icon-more"></div> </div> <button class="ts-btn ts-btn-primary ts-btn-confirm">确定</button> </div>');


                //1.1.2 list data
                var $terminalList = $('<div class="ts-select-list"></div>');


                //store data
                $(this).data({"settings":settings,"selectedData":[]});


                if(settings.initData.length > 0) { //初始化数据

                    for(var i = 0 ; i < settings.initData.length ; i ++ ) {

                        var item = settings.initData[i];

                        //TerminalSelect.addListItem.call(this,item,$terminalList);

                        TerminalSelect.addListItem(item,$terminalList,$(this));

                    }
                }

                $(this).append($terminalSubDom).append($terminalList);



                //PART2: contact dialog dom and event;
                //2.1  create dialog fragment 每个select都有自己的对话框

                var $addItemModal = $('<div class="nemo-mask-new hide add-item-modal"><div class="inv-add-dialog" > <div class="dialog-bar"> <span class="dialog-title">从企业通讯录邀请</span> <span class="close-btn" >×</span> </div> <div class="content" > <div class="input-search" > <input class="ts-input"> <div class="icon-search" id="searchItem"></div> </div> <div class="choose"> <div class="choose-all choose-all-checked">全选</div> </div> <div class="add-list"> </div> </div> <div class="btn-area inv-search-btn-area" > <a class="btn btn-cancel" >取消</a> <a class="btn btn-default" >确定</a> </div> </div> </div>');
                $addItemModal.data('srcEle',$(this));

                $addItemModal.appendTo('body');


                //1.2 eventBind
                //==============================
                TerminalSelect.eventBind.call($(this),$addItemModal);

            });
        },

        eventBind : function($dialog) {

            var settings = $(this).data('settings');

            //confirm event;

            $(this).on('click','.ts-btn-confirm',function(e) {

                var inputVal = $(e.target).siblings('.ts-add-input-box').children('#tsAddInput').val(),
                    $src = $(e.target).parents('.terminal-select'),
                    settings = $src.data('settings'),
                    result;

                if(settings.callback.beforeAddedFromInput) {

                    result = settings.callback.beforeAddedFromInput(inputVal);
                }

                if(typeof(result) === "object" && (!$.isEmptyObject(result))) {

                    TerminalSelect.addListItem(result,null,$src);
                }

            });

            //delete event
            $(this).on('click','.ts-list-item-delete',function(e) {
                var id = $(e.target).parent().attr('data-id'),
                    $src = $(e.target).parents('.terminal-select'),
                    settings = $src.data('settings');

                if(settings.callback.beforeDelete) {
                    var result =  settings.callback.beforeDelete(id);
                    if(result === false) {
                         return false;
                    }
                }

                TerminalSelect.deleteListItem(id,$src);
            });

            //more event
            $(this).on('click','.ts-icon-more',function(e) {

                AddItemModule.init.call(AddItemModule,$(this).parents('.terminal-select'),$dialog);
                e.preventDefault();
            });
        },


        addListItem : function(item,$parent,$this) {

            var selectedData = $this.data('selectedData');

            // 去重
            for(var i = 0 ;i < selectedData.length ; i ++ ) {
                if(selectedData[i].id === item.id) {
                    return ;
                }
            }

            //data
            selectedData.push(item);

            //view
            var $parent = $parent ? $parent : $('.ts-select-list',$this);


            $parent.append( $('<div>',{
                'class':"ts-select-item",
                'data-id':item.id,
                'html':'<label>' +  item.displayName + '</label><a class="ts-list-item-delete">' + '删除' + '</a>'
            }));

        },

        deleteListItem : function(id,$src) {

            var obj = $src.data();

            for(var i = 0 ;i < obj.selectedData.length; i++) {
              if(obj.selectedData[i].id == id) {
                  obj.selectedData.splice(i,1);
              }
            }

            //delete dom
            $('.ts-select-item',$src).filter('[data-id='  + id +']').remove();

        },


        getSelected : function() {
            return TerminalSelect.selectedData;
        },

        createInputDom : function() {//return a input dom with selected id list as value

            var values = TerminalSelect.selectedData.map(function(item){
                return item.id;
            });

            if($('#tsHideInput').length > 0 ){
                $('#tsHideInput').remove();
            }

            var $input = $('<input>',{
                'hide':true,
                'id':'tsHideInput',
                'value':values,
                'name':TerminalSelect.settings.inputName
            });

            return $(this).after($input);
        },

        selectedData :[]

    };

    var AddItemModule = {

        //在弹出modal之前,先填充数据,如果使用模板可不调用fillModalData方法
        init : function($srcEle,$this) {

            this.src = $srcEle;
            this.elem = $this;

            $(this.elem).data({
                isFetched:false,
                data:{},
                parentNode:$srcEle
            });

            this.clearData(); //todo 这里每次都需要清除吗?是否可以优化?
            this.fetchData();
            this.eventInit();
            this.showDialog();
        },

        showDialog :function() {
            $(this.elem).show();
        },

        fetchData : function() {

            var $this = $(this.elem),
                contactData = $(this.elem).data(),
                settings = $(this.src).data('settings');

            if(contactData.isFetched === false) {
                if($.trim(settings.contactUrl) !== "") {
                    try{
                        $.getJSON(settings.contactUrl,function(data) {

                            var resultData = data;

                            if(settings.callback.onfetchedUrlCalled) {
                                var callData = settings.callback.onfetchedUrlCalled(data);
                                if(callData) {
                                    resultData = callData;
                                }
                            }

                            if(resultData === undefined) {
                                return;
                            }

                            if(typeof(resultData) === "string" || typeof(resultData) === "object"){
                                $.extend($this.data(),{
                                    isFetched:true,
                                    data:resultData
                                });

                            }else { //传入的数据不对
                                if(window.console) {
                                    console.log('传入或则返回的数据格式有误,请检查,只接受字符串或者数组类型的数据');
                                }

                                $.extend($this.data(),{
                                    isFetched:true,
                                    data:"未能取到数据"
                                });
                            }


                            AddItemModule.fillModalData($this.data('data'),$this);

                        }).fail(function(e) {
                            if(window.console) {
                                console.log('获取数据错误');
                                console.log(e);
                            }
                        })
                    }catch (e) {
                        if(window.console) {
                            console.log('获取数据错误');
                        }
                    }
                }
            }else {
                AddItemModule.fillModalData(AddItemModule.contactData.data);
            }
        },

        clearData : function(){
            $('.add-list',this.elem).empty();
        },

        fillModalData : function(initData,$root){

            //error scene : data is a string
            if(typeof (initData) === "string") {

                $('.content',$root).empty();

                $('.content',$root).append($('<p class="error-info">' +
                    initData + '</p>'));
                return;
            }

            //success scene : data is an array.

            //todo 这里是否要进行容错?比如有些返回数据是nemoNumber,有些是number或者phone字段等等?
            //todo 修改html后,这里的渲染逻辑要发生改变


            var groupsMatch = {"nemos":"企业小鱼","users":"企业用户","bruces":"bruces","boxes":"boxes","h323s":"h323s"};

            var $groupList = $('<div>');

            for(var key in groupsMatch) {

                if(initData[key].length > 0) {

                    var $itemGroup = $('<div>',{"class":"item-group"}),
                        $groupTitle = $('<div>',{
                        "class":"group-title",
                        html:'<label class="checkbox-uncheck">' + groupsMatch[key] + '</label>'
                    });

                    $itemGroup.append($groupTitle);

                    for(var i = 0 ; i < initData[key].length ; i++) {

                        var item  = initData[key][i];

                        //FIXME according to @jiajia, 接口规则:如果是人的话,返回id,name,phone,avatar,如果是硬件的话,返回id,name,nemoNumber,avatar

                        var number = item.phone ? item.phone : item.nemoNumber,
                            imgSrc = item.avatar ? item.avatar :"//devcdn.ainemo.com/page/images/noicon.png";

                        var $contactItem = $('<div>',{
                            "class":"meeting-contact-item",
                            "data-id":item.id,
                            "data-name":item.name,
                            "data-avatar":item.avatar,
                            "data-number":number
                        }),
                            $img = $('<img src= "' + imgSrc +
                            '" class="item-img">'),
                            $itemDetail = $('<div>',{
                                "class":"item-detail",
                                "html":'<label class="item-name">' + item.name +
                                '</label><br><label class="item-phone">' + number +
                                '</label>'
                            });

                        $contactItem.append($img).append($itemDetail).appendTo($itemGroup);

                    }

                    $groupList.append($itemGroup);

                }
            }
            $('.add-list',$root).append($groupList);
        },

        //事件注册
        eventInit : function(){

            var $this = $(this.elem);

            //1. 搜索
            $this.off().on('click','#searchItem',function(e) {

                e.preventDefault();

                var text = $.trim($('.ts-input',$this).val());

                $('.item-detail').filter(function(){

                    var name = $(this).children('.item-name');
                    var phone = $(this).children('.item-phone');

                    if(name.html().indexOf(text) > -1 || phone.html().indexOf(text) > -1){
                        $(this).closest('.meeting-contact-item').show();
                    }else{
                        $(this).closest('.meeting-contact-item').hide();
                    }
                });

            });

            $('.ts-input',$this).keypress(function(e){

                if(e.which==13){
                    $('#searchItem').click();
                }
            });


            //2. 全选/全部取消
            $this.off().on('click','.choose',function(e) {
                if($('.choose-all-checked',$this).length > 0 ) {
                    //取消全选
                    $('.choose-all-checked',$this).className = "choose-all choose-all-unchecked";


                }else{
                    $('.choose-all-checked',$this).className = "choose-all choose-all-checked";


                }
            });

            $('#checkAll').click(function(){//全选和全部取消都得是能看见的
                if($(this).is(':checked')){//全选
                    $('#addItemModal input[type=checkbox]').filter(':visible').prop('checked','checked');
                }else{//取消
                    $('#addItemModal input[type=checkbox]').prop('checked',false);
                }
            });


            ////4. 分组选中
            //$('.groupCheckAll').click(function(e){
            //    if($(this).is(':checked')){
            //        $(this).parent().siblings('.group-lists').find(':checkbox').filter(':visible').prop('checked','checked');
            //    }else{
            //        $(this).parent().siblings('.group-lists').find(':checkbox').prop('checked',false);
            //    }
            //    e.stopPropagation();
            //});
            //5. 确定
            $('#addItem').off().on('click',function(){
                var results=[];
                var lables= $('.item-checkbox').filter(':checked').siblings('label');
                $.each(lables,function(index,item){

                    var data = collectData(["id","displayName","type","number","avatar"],$(item));
                    TerminalSelect.addListItem(data);
                    results.push(data);
                });

                if(TerminalSelect.settings.callback.onSelect) {
                    TerminalSelect.settings.callback.onSelect(results);
                }

                $('#addItemModal').modal('hide');

            });

            ////6. 分组栏收缩
            //$('.group-title').click(function(e){
            //    if($(e.target).hasClass('group-title')){
            //        var lists = $(this).siblings('.group-lists');
            //        if(lists.is(':visible')){
            //            lists.slideUp();
            //        }else{
            //            lists.slideDown();
            //        }
            //    }
            //});


            function collectData(attrList,$item) { //["id","name","type","number","avatar"]
                var item = {};
                for(var i = 0 ;i < attrList.length; i ++) {
                    item[attrList[i]] =$item.attr('data-' + attrList[i]);
                }
                return item;
            }
        }
    };


    $.fn.terminalSelect = function(method) {
        if(TerminalSelect[method]) {
            return TerminalSelect[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return TerminalSelect.init.apply(this, arguments);
        } else {
            $.error( ' method  '+method+' is not exist.' );
        }
    };

})(jQuery);
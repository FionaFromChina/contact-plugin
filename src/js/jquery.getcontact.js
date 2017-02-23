;(function ($) {

    'use strict';

    var TerminalSelect = {

        settings:{},

        init : function(options) {

            var defaults = {
                initData:[],
                contactUrl:"",
                inputName:"terminals",
                callback:{
                    beforeDelete: function(item){
                        //return false; 终端删除
                    },
                    beforeAddedFromInput: function(inputValue){
                        //return false; 不执行添加到下面框的事件
                        return {};
                    },
                    onSelect: function(items){
                        //items,被选中的items

                    },
                    onfetchedUrlCalled : function(data){
                        return data;
                    }
                }
            };


            var settings = $.extend({},defaults, options);

            TerminalSelect.settings = settings;

            return $(this).each (function(){

                $(this).empty();

                //Part1: terminal select Dom and event;
                //1.1. create Dom fragment;

                //1.1.1 terminal Dom
                var $terminalSubDom = $('<div class="ts-choose-list"><div class="ts-add-input-box"><input class="ts-input" id="tsAddInput" type="text" placeholder="这里是placeholder" /> <div class="ts-icon-more" data-toggle="modal" data-target="#addItemModal"></div> </div> <button class="ts-btn ts-btn-primary ts-btn-confirm">确定</button> </div>');


                //1.1.2 list data
                var $terminalList = $('<div class="ts-select-list"></div>');

                if(settings.initData.length > 0 ){ //初始化数据

                    for(var i = 0 ; i< settings.initData.length ; i ++ ) {

                        var item = settings.initData[i];

                        TerminalSelect.addListItem(item,$terminalList);

                    }
                }

                $(this).append($terminalSubDom).append($terminalList);


                //1.2 eventBind
                //==============================
                TerminalSelect.eventBind(settings);


                //PART2: contact dialog dom and event;
                //2.1  create dialog fragment
                if($('#addItemModal').length === 0 ){
                    var $addItemModal = $('<div class="modal fade" id="addItemModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <h4 class="modal-title" id="myModalLabel">添加组员</h4> </div> <div class="model-search"> <div class="input-group btn-search"> <input type="text" class="form-control search-input" id="searchText" placeholder="搜索"> <span class="input-group-btn"> <a class="btn btn-default search-btn"  id="searchItem"> <span class="glyphicon glyphicon-search"></span> </a> </span> </div> <div class="choose-bar"> <input type="checkbox" id="checkAll"> <label for="checkAll">全选</label> </div> </div> <div class="modal-body" id="addItemBody"> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">取消</button> <button type="button" class="btn btn-primary" id="addItem">确定</button> </div> </div> </div> </div>');
                    $addItemModal.appendTo('body');
                }

                //2.2. modal-dialog init
                AddItemModule.init();
            });
        },

        eventBind : function(settings) {
            //confirm event;

            $('.ts-btn-confirm').on('click',function(e) {

                var inputVal = $('#tsAddInput').val(),result;

                if(settings.callback.beforeAddedFromInput) {

                    result = settings.callback.beforeAddedFromInput(inputVal);
                }

                if(typeof(result) === "object" && (!$.isEmptyObject(result))) {

                    TerminalSelect.addListItem(result);
                }

                e.preventDefault();

            });

            //delete event
            $('.terminal-select').on('click','.ts-list-item-delete',function(e) {
                var id = $(e.target).parent().attr('data-id');
                if(settings.callback.beforeDelete) {
                    var result =  settings.callback.beforeDelete(id);
                    if(result === false) {
                         return false;
                    }
                }
                TerminalSelect.deleteListItem(id);
            })
        },


        addListItem : function(item,$parent) {

            // 去重
            for(var i = 0 ;i < TerminalSelect.selectedData.length ; i ++ ) {
                if(TerminalSelect.selectedData[i].id === item.id) {
                    return ;
                }
            }

            //data
            TerminalSelect.selectedData.push(item);

            //view
            var $parent = $parent ? $parent : $('.ts-select-list');


            $parent.append( $('<div>',{
                'class':"ts-select-item",
                'data-id':item.id,
                'html':'<label>' +  item.displayName + '</label><a class="ts-list-item-delete">' + '删除' + '</a>'
            }));

        },

        deleteListItem : function(id) {

            for(var i = 0 ;i < TerminalSelect.selectedData.length; i++) {
              if(TerminalSelect.selectedData[i].id == id) {
                  TerminalSelect.selectedData.splice(i,1);
              }
            }

            //delete dom
            $('.ts-select-item').filter('[data-id='  + id +']').remove();

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

        contactData :{
            isFetched:false,
            data:{}
        },

        //在弹出modal之前,先填充数据,如果使用模板可不调用fillModalData方法
        init : function(){

            $('#addItemModal').on('show.bs.modal',function(){
                AddItemModule.clearData();
                AddItemModule.fetchData();
                AddItemModule.eventInit();
            })
        },

        fetchData : function() {
            var contactData = AddItemModule.contactData;
            if(contactData.isFetched === false) {
                if($.trim(TerminalSelect.settings.contactUrl) !== "") {
                    try{
                        $.getJSON(TerminalSelect.settings.contactUrl,function(data) {

                            var resultData = data;

                            if(TerminalSelect.settings.callback.onfetchedUrlCalled) {
                                resultData = TerminalSelect.settings.callback.onfetchedUrlCalled(data) ? TerminalSelect.settings.callback.onfetchedUrlCalled(data) :resultData;
                            }


                            if(resultData == undefined) {
                                return;
                            }

                            if(typeof(resultData) === "string" || $.isArray(resultData) === true){
                                AddItemModule.contactData = {
                                    isFetched:true,
                                    data:resultData
                                };
                            }else { //传入的数据不对
                                if(window.console) {
                                    console.log('传入或则返回的数据格式有误,请检查,只接受字符串或者数组类型的数据');
                                }
                                AddItemModule.contactData = {
                                    isFetched:true,
                                    data:"未能获取到数据"
                                };
                            }

                            AddItemModule.fillModalData(AddItemModule.contactData.data);

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
            $('#addItemBody').empty();
        },

        fillModalData : function(initData){

            //error scene : data is a string
            if(typeof (initData) === "string") {//
                $('#addItemBody').append($('<p>' +
                    initData + '</p>'));
                return;
            }

            //success scene : data is an array.

            //todo 这里是否要进行容错?比如有些返回数据是nemoNumber,有些是number或者phone字段等等?

            var modalLists=$('<ul>',{"class":"modal-lists"}),
                leni=initData.length;

            for(var i=0;i<leni;i++){
                var itemGroup = $('<li>',{
                    "class":"item-group"
                });
                var groupTitle = $('<div>',{
                    "class":"group-title",
                    html:'<input type="checkbox" ' +
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
                            "data-id":obj.id,
                            "data-type":obj.type,
                            "data-displayName":obj.name,
                            "data-avatar":obj.avatar,
                            "data-number":obj.number,
                            html:'<img class="item-img img-circle" src="' +obj.avatar+ '">' +
                            '<div class="item-detail">' +
                            '<span class="item-name">' +obj.name+ '</span>' +
                            '<br/>' +
                            '<span class="item-phone">'+obj.number+'</span>' +
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
        eventInit : function(){
            //1. 搜索
            $('#searchItem').off().on('click',function(e){

                e.preventDefault();

                var text = $.trim($('#searchText').val());

                $('.item-detail').filter(function(){

                    var name = $(this).children('.item-name');
                    var phone = $(this).children('.item-phone');
                    if(name.html().indexOf(text) > -1 || phone.html().indexOf(text) > -1){
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
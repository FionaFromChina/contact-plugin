+(function($,window,undefined) {
    $.fn.terminalSelect.defaults = {
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

    $.fn.terminalSelect = function(options) {

    }
}(jQuery,window))();
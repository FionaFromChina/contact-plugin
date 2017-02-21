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
            //create element

        }
    };




    $.fn.terminalSelect = function(options) {

        var TerminalSelect = new TerminalSelect(this,options);
        return TerminalSelect.init();

    }
}(jQuery,window))();
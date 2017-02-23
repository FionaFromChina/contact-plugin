#### 背景

在很多form表单中会需要从通讯录中添加联系人，所以将需求抽象出来做成jQuery插件来解决问题。

#### 插件介绍

* 名称：terminalSelect
* 依赖：jQuery
* 需要引入的文件：
    * jquery.terminalSelect.min.css 
    * jquery.terminalSelect.min.js
* 参数介绍

        var options = {
            initData:[{
                id:"1",
                displayName:"aa",
                avatar:"imgsrc",
                type:"2"
            }],
            contactUrl:"",//获取contact列表的URL
            inputName:"terminals",//生成的inputDom的name属性值,默认值terminals
            callback:{
                beforeDelete: function(item){
                    //return false; 终端删除
                    //这里可以做一些错误处理,比如某些item是不允许删除的,或者加是否确定要删除的confirm dialog等.
    
                },
                beforeAddedFromInput: function(inputValue){
    
                    return{
                        "type":"2",
                        "number": "736827",
                        "avatar": "http://devavatar.ainemo.com/nemo/avatar/115488-07da5995-9592-4db5-a015-e90c77f14036-1483497017859",
                        "name": "kelei的小鱼",
                        "id": "115423"
                    };
                    //return {}; 不添加
    
                },
                onSelect: function(items){
                    //items,被选中的items
    
                },
                onfetchedUrlCalled : function(data){
                    //data 结构:
                    var data = [{
                        "title":"小鱼企业",
                        "lists":[{
                            "type":"2",
                            "number": "736827",
                            "avatar": "http://devavatar.ainemo.com/nemo/avatar/115488-07da5995-9592-4db5-a015-e90c77f14036-1483497017859",
                            "name": "kelei的小鱼",
                            "id": "115423"
                        }]
                    },{
                        "title":"分组2",
                        "lists":[{
                            "type":"2",
                            "number": "736827",
                            "avatar": "http://devavatar.ainemo.com/nemo/avatar/115488-07da5995-9592-4db5-a015-e90c77f14036-1483497017859",
                            "name": "kelei的小鱼儿儿儿",
                            "id": "115488"
                        }]
                    }];
                    var errorMsg = "获取错误";
                    return data; //正确情况下返回
                    //return errorMsg = "获取错误"; 错误情况下返回
                }
            }
        };    

* 初始化
    * html:        
  
        ```
        <div class="terminal-select"></div>
        ```

    * js:
    
        ```
        $('.terminal-select').terminalSelect();
        $('.terminal-select').terminalSelect(options); //见上面options的注释
        ```
* 对外接口实现
    * 获取选择的数据

        ```
        $('.terminal-select').terminalSelect('getSelected');
        ```
    * 生成InputDOM(会追加在调用对象的后面，生成一个隐藏的Input对象)
    
        ```
        $('.terminal-select').terminalSelect('createInputDom');
        ```
* 数据结构
    ```
    {
        "type":"2",//终端类型
        "number": "736827", //电话或者小鱼号
        "avatar": "http://devavatar.ainemo.com/nemo/avatar/115488-07da5995-9592-4db5-a015-e90c77f14036-1483497017859", //头像路径
        "name": "kelei的小鱼", //显示的名称
        "id": "115423" //最后input values数据存的是id list
    }
    ```
    不管是从input添加还是从contact list选择后点击确定添加，被添加的数据结构定义如下:
* options具体说明：
* 针对不同场景的建议：

    
#### 背景

在很多form表单中会需要从通讯录中添加联系人，所以将需求抽象出来做成jQuery插件来解决问题。
1ac241385f99ff5f57fcb78c118633aa19a6f080
caeded0fe8ba27770b56a90d82a59335f8007bd7


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
                name:"a",
                avatar:"imgsrc",
                number:"123"
            }],
            contactUrl:"",//获取contact列表的URL
            inputName:"terminals",//生成的inputDom的name属性值,默认值terminals
            terminalInfoUrl:"getTerminalInfo.json"//根据小鱼号或者电话号码获取数据的url
            callback:{
                beforeDelete: function(item){
                    //return false; 终端删除
                    //这里可以做一些错误处理,比如某些item是不允许删除的,或者加是否确定要删除的confirm dialog等.
    
                },
                onTerminalUrlCalled: function(data){ //data是url返回的数据，如果有需要，可以对返回的数据进行处理。
    
                    return{
                        "type":"2",
                        "number": "736827",
                        "avatar": "http://devavatar.ainemo.com/nemo/avatar/115488-07da5995-9592-4db5-a015-e90c77f14036-1483497017859",
                        "name": "kelei的小鱼",
                        "id": "115423"
                    };
                    //return {}; 不添加
    
                },
                onSelect: function(items){ //弹出的对话框点击确定后的回调事件
                    //items,被选中的items
    
                },
                onfetchedUrlCalled : function(data){
                    //data 结构:
                    var data={
                        "bruces":[],
                        "nemos": [{
                            "nemoNumber": "679520",
                            "avatar": "http://devavatar.ainemo.com/nemo/avatar/122596-87a78055-6571-4ab9-bafe-3709fb41f438-1487234169629?k=122596-87a78055-6571-4ab9-bafe-3709fb41f438-1487234169629",
                            "name": "小鱼1024",
                            "id": "122596"
                         }];
                    var errorMsg = "获取错误";
                    return data; //返回的data结构需要和xhr返回的data一致
                    //return errorMsg = "获取错误";//用于处理错误情况
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

* 数据结构
    ```
    {
        "number": "736827", //电话或者小鱼号
        "avatar": "http://devavatar.ainemo.com/nemo/avatar/115488-07da5995-9592-4db5-a015-e90c77f14036-1483497017859", //头像路径
        "name": "kelei的小鱼", //显示的名称
        "id": "115423" //最后input values数据存的是id list
    }
    ```
    不管是从input添加还是从contact list选择后点击确定添加，被添加的数据结构定义如下:
* options具体说明：
    
* 针对不同场景的建议：
* 使用注意事项
    1. div锚点的类名需要为terminal-select,如果需要调用多个该控件，可用id进行区分。
    2. 每个div后面会自动生成一个隐藏的Input对象，name为option里面的inputName参数，方便form提交。

    
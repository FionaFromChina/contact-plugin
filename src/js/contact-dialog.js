//数据初始化
var initData = [{
    title:"小鱼企业",
    lists:[{
        imgSrc: "http://182.92.218.117/profile/picture?k=60842-841862d4-5e9d-4c4f-84ca-dc734a47b2ed-1459162720661",
        name: "baiyang",
        phone: "13800000000"
    },{
        imgSrc:"http://182.92.218.117/profile/picture?k=60842-841862d4-5e9d-4c4f-84ca-dc734a47b2ed-1459162720661",
        name:"小白",
        phone:"13900000000"
    },
        {
            imgSrc:"http://182.92.218.117/profile/picture?k=60842-841862d4-5e9d-4c4f-84ca-dc734a47b2ed-1459162720661",
            name:"小黑",
            phone:"13900000000"
        },{
            imgSrc:"http://182.92.218.117/profile/picture?k=60842-841862d4-5e9d-4c4f-84ca-dc734a47b2ed-1459162720661",
            name:"小黑",
            phone:"13900000000"
        },{
            imgSrc:"http://182.92.218.117/profile/picture?k=60842-841862d4-5e9d-4c4f-84ca-dc734a47b2ed-1459162720661",
            name:"小黑",
            phone:"13900000000"
        },{
            imgSrc:"http://182.92.218.117/profile/picture?k=60842-841862d4-5e9d-4c4f-84ca-dc734a47b2ed-1459162720661",
            name:"小黑",
            phone:"13900000000"
        },{
            imgSrc:"http://182.92.218.117/profile/picture?k=60842-841862d4-5e9d-4c4f-84ca-dc734a47b2ed-1459162720661",
            name:"小黑",
            phone:"13900000000"
        },{
            imgSrc:"http://182.92.218.117/profile/picture?k=60842-841862d4-5e9d-4c4f-84ca-dc734a47b2ed-1459162720661",
            name:"小黑",
            phone:"13900000000"
        },{
            imgSrc:"http://182.92.218.117/profile/picture?k=60842-841862d4-5e9d-4c4f-84ca-dc734a47b2ed-1459162720661",
            name:"小黑",
            phone:"13900000000"
        }]
},{
    title:"分组2",
    lists:[{
        imgSrc:"http://182.92.218.117/profile/picture?k=60842-841862d4-5e9d-4c4f-84ca-dc734a47b2ed-1459162720661",
        name:"冯白杨",
        phone:"18201507500"
    }]
}];


var addItemModule= function(){
    //在弹出modal之前,先填充数据,如果使用模板可不调用fillModalData方法
    var init = function(){
        $('#addItemModal').on('show.bs.modal',function(){
            clearData();
            fillModalData(initData);
            eventInit();
        })
    };
    var clearData = function(){
        $('#addItemBody').empty();
    };

    var fillModalData=function(initData){
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
    };
    //事件注册
    var eventInit=function(){
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
            console.log(results);
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
    };

    return{
        init:init
    }
}();









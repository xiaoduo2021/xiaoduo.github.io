
var images = [];
var wechatImage;

$(function () {

    $('#loadingToast').hide();
    // 允许上传的图片类型
    var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
    //10MB
    var maxSize = 10 * 1024 * 1024;
    // 图片最大宽度
    var maxWidth = 1500;
    // 最大上传图片数量
    var maxCount = 6;
    $('#uploaderInput').on('change', function (event) {
        $('#loadingToast').show();
        var files = event.target.files;
        // 如果没有选中文件，直接返回
        if (files.length === 0) {
            $('#loadingToast').hide();
            return;
        }

        for (var i = 0, len = files.length; i < len; i++) {
            var file = files[i];
            var reader = new FileReader();

            // 如果类型不在允许的类型范围内
            if (allowTypes.indexOf(file.type) === -1) {
                weui.alert('该类型不允许上传');
                continue;
            }

            if (file.size > maxSize) {
                weui.alert('图片太大，不允许上传');
                continue;
            }

            if ($('#property_images', '.weui-uploader__file').length >= maxCount) {
                weui.alert('最多只能上传' + maxCount + '张图片');
                $('#loadingToast').hide();
                return;
            }

            reader.onload = function (e) {
                var img = new Image();
                img.onload = function () {
                    // 不要超出最大宽度
                    var w = Math.min(maxWidth, img.width);
                    // 高度按比例计算
                    var h = img.height * (w / img.width);
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    // 设置 canvas 的宽度和高度
                    canvas.width = w;
                    canvas.height = h;
                    ctx.drawImage(img, 0, 0, w, h);
                    var base64 = canvas.toDataURL('image/png');

                    // 插入到预览区
                    if ($('.weui-uploader__file').length + 1 <= maxCount){
                        var $preview = $('<li class="weui-uploader__file" style="background-image:url(' + base64 + ')"><div class="weui-uploader__file-content">0%</div></li>');
                        $('#weui-uploader__files').append($preview);
                        var num = $('.weui-uploader__file').length;
                        $('.weui-uploader__info').html(num + '/' + maxCount);
                        images.push(base64);
                    }
                    else{
                        weui.alert('最多只能上传' + maxCount + '张图片');
                    }
                    $('#loadingToast').hide();
                };

                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

});

function postData() {
    var category = $("input[name='radio1']:checked").val();
    var length = $("input[name='radio2']:checked").val();
    var enter_time = $("#enter_time").val();
    var des = $(".weui-textarea").val();
    
    //console.log(category);
    //console.log(length);
    //console.log(enter_time);
    //console.log(des);
    //console.log(images);
    $('#loadingToast').show();
    $.ajax({
      type: "POST",
      url: "https://api.xiaoduo.ca/avant/postHousingData",
      dataType: 'json',
      data: {'category': category, 
            'length': length, 
            'enter_time': enter_time, 
            'des': des,
            'images': JSON.stringify(images)}
    }).done(function( o ) {
        if (o && o.status == 0){
            $('#loadingToast').hide();
            $(".form").hide();
            $("#hd2").show();
            $("#bd2").show();
            $('#bd2').html('<img class="result_img" src="data:image/png;base64, ' + o.data.slice(2,-1) +  ' " alt="Red dot" />')
            $("html, body").animate({ scrollTop: 0 }, "slow");
        }

    }).fail(function() {
        $('#loadingToast').hide();
        weui.alert('提交失败，请重试')
  });
}
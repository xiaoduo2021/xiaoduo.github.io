<?php

$appId = 'wx22d8bc3b6b76d921';
$appsecret = 'bd96902348a7ba9cd43ca066b4ed52fb';

$timestamp = time();
$jsapi_ticket = make_ticket($appId,$appsecret);
$nonceStr = make_nonceStr();
$url = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
$signature = make_signature($nonceStr,$timestamp,$jsapi_ticket,$url);

function make_nonceStr()
{
    $codeSet = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for ($i = 0; $i<16; $i++) {
        $codes[$i] = $codeSet[mt_rand(0, strlen($codeSet)-1)];
    }
    $nonceStr = implode($codes);
    return $nonceStr;
}

function make_signature($nonceStr,$timestamp,$jsapi_ticket,$url)
{
    $tmpArr = array(
    'noncestr' => $nonceStr,
    'timestamp' => $timestamp,
    'jsapi_ticket' => $jsapi_ticket,
    'url' => $url
    );
    ksort($tmpArr, SORT_STRING);
    $string1 = http_build_query( $tmpArr );
    $string1 = urldecode( $string1 );
    $signature = sha1( $string1 );
    return $signature;
}

function make_ticket($appId,$appsecret)
{
    // access_token 应该全局存储与更新，以下代码以写入到文件中做示例
    $data = json_decode(file_get_contents("access_token.json"));
    if ($data->expire_time < time()) {
        $TOKEN_URL="https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".$appId."&secret=".$appsecret;
        $json = file_get_contents($TOKEN_URL);
        $result = json_decode($json,true);
        $access_token = $result['access_token'];
        if ($access_token) {
            $data->expire_time = time() + 7000;
            $data->access_token = $access_token;
            $fp = fopen("access_token.json", "w");
            fwrite($fp, json_encode($data));
            fclose($fp);
        }
    }else{
        $access_token = $data->access_token;
    }

    // jsapi_ticket 应该全局存储与更新，以下代码以写入到文件中做示例
    $data = json_decode(file_get_contents("jsapi_ticket.json"));
    if ($data->expire_time < time()) {
        $ticket_URL="https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=".$access_token."&type=jsapi";
        $json = file_get_contents($ticket_URL);
        $result = json_decode($json,true);
        $ticket = $result['ticket'];
        if ($ticket) {
            $data->expire_time = time() + 7000;
            $data->jsapi_ticket = $ticket;
            $fp = fopen("jsapi_ticket.json", "w");
            fwrite($fp, json_encode($data));
            fclose($fp);
        }
    }else{
        $ticket = $data->jsapi_ticket;
    }

    return $ticket;
}

?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>深夜，学长问我睡了吗……</title>
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1">
    <meta name="description" content="今夜，给自己加戏">
    <link rel="stylesheet" type="text/css" href="css/base.css" media="all">
    <link rel="shortcut icon" type="image/x-icon" href="http://xiaoduo.ca/xijing/img/share.jpg">
    <script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>

</head>

<body><img src="img/share.jpg" style="display:none;width:300px;height:300px;" />
    <div class="all">
        <div class="all" id="loading"></div>
        <div id="play" style="display:none"></div>
    </div>
    <video id="video" webkit-playsinline="true" playsinline="true" style="width: 1px; height: 1px" type="video/mp4" preload x5-video-player-type="h5"></video>
    <div id="content">
        <input type="button" id="replay" class="btn" value="重新播放">
    </div>
</body>
<script src="js/main.js"></script>

</html>


<script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
<script>
    wx.config({
        debug: true,
        appId: '<?=$appId?>',
        timestamp: <?=$timestamp?>,
        nonceStr: '<?=$nonceStr?>',
        signature: '<?=$signature?>',
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage'
          ]
    });

    wx.ready(function () {
        var shareData = {
            title: '深夜，学长问我睡了吗……',
            desc: '今夜，给自己加戏',
            link: 'http://xiaoduo.ca/xijing/index.html', 
            imgUrl: 'http://xiaoduo.ca/xijing/img/share.jpg'
        };
        wx.onMenuShareAppMessage(shareData);
        wx.onMenuShareTimeline(shareData);
    });

    wx.error(function (res) {
      alert(res.errMsg);
    });
</script>
</html>











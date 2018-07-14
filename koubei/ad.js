const adData = {
  footer: {
    UTM: "AvantClass",
    UTSG: "SavvyPro",
    UTSC: "AvantClass",
  },
  ad: {
    UTM: [
      {
        img: "https://dummyimage.com/350x120/9e9e9e/616161",
        url: "http://www.kfc.ca",
      },
      {
        img: "https://dummyimage.com/350x120/9e9e9e/616161",
        url: "http://www.kfc.ca",
      },
    ],
    UTSG: [
      {
        img: "https://dummyimage.com/350x120/9e9e9e/616161",
        url: "http://www.kfc.ca",
      },
      {
        img: "https://dummyimage.com/350x120/9e9e9e/616161",
        url: "http://www.kfc.ca",
      },
    ],
    UTSC: [
      {
        img: "https://dummyimage.com/350x120/9e9e9e/616161",
        url: "http://www.kfc.ca",
      },
      {
        img: "https://dummyimage.com/350x120/9e9e9e/616161",
        url: "http://www.kfc.ca",
      },
    ],
  },
}

$(document).ready( function () {
  let campus = getUrlParams('campus')
  if (!campus){
    campus = 'UTSG';
  }
  campus = campus.toUpperCase();
  renderAd(campus);
  
  // hide xiaoduo ad in client
  const source = getUrlParams('source');
  if (source){
    $("#xiaoduoAdCard").hide();
  }
});


function renderAd(campus){
  $("#ad1").hide();
  $("#ad2").hide();
  // return;
  
  if (campus != 'UTSG'){
    $("#utsgAdCard").hide();
  }

  let ads = adData.ad[campus].slice();

  // pick random at top
  const index = Math.floor(Math.random()*ads.length);
  let ad1 = ads[index];
  ads.splice(index, 1);
  let ad2 = ads[Math.floor(Math.random()*ads.length)];

  $("#footer_partner").html(adData.footer[campus]);
  

  // $("#ad1 div").css("background-image", 'url(' + ad1.img + ')');
  // $("#ad2 div").css("background-image", 'url(' + ad2.img + ')');


  // click event
  $("#ad1").click(function(){
    if (ad1.url){
      location.href = ad1.url;
    }
  });
  $("#ad2").click(function(){
    if (ad2.url){
      location.href = ad2.url;
    }
  });
}

function campusMapping(courseCode){
  const last = courseCode.slice(-1);
  // console.log(last);
  return {
    '1': "UTSG",
    '3': "UTSC",
    '5': "UTM",
  }[last];
}

function getUrlParams(key){
  var url = new URL(location.href);
  var c = url.searchParams.get(key);
  return c
}

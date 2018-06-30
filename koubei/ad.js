const adData = {
  footer: {
    UTM: "AvantClass",
    UTSG: "SavvyPro",
    UTSC: "YouClass",
  },
  ad: {
    UTM: [
      {
        img: "https://www.joc.com/sites/default/files/field_feature_image/KFC_0.png",
        url: "http://www.kfc.ca",
      },
      {
        img: "https://imagesvc.timeincapp.com/v3/mm/image?url=https%3A%2F%2Ftimedotcom.files.wordpress.com%2F2018%2F06%2F800-21.jpg&w=800&q=85",
        url: "http://www.kfc.ca",
      },
    ],
    UTSG: [
      {
        img: "https://www.joc.com/sites/default/files/field_feature_image/KFC_0.png",
        url: "http://www.kfc.ca",
      },
      {
        img: "https://imagesvc.timeincapp.com/v3/mm/image?url=https%3A%2F%2Ftimedotcom.files.wordpress.com%2F2018%2F06%2F800-21.jpg&w=800&q=85",
        url: "http://www.kfc.ca",
      },
    ],
    UTSC: [
      {
        img: "https://www.joc.com/sites/default/files/field_feature_image/KFC_0.png",
        url: "http://www.kfc.ca",
      },
      {
        img: "https://imagesvc.timeincapp.com/v3/mm/image?url=https%3A%2F%2Ftimedotcom.files.wordpress.com%2F2018%2F06%2F800-21.jpg&w=800&q=85",
        url: "http://www.kfc.ca",
      },
    ],
  },
}

$(document).ready( function () {
  let campus = getUrlParams('campus').toUpperCase();
  if (!campus){
    return;
  }

  let ads = adData.ad[campus];

  // pick random at top
  const index = Math.floor(Math.random()*ads.length);
  let ad1 = ads[index];
  delete ads[ index ];
  let ad2 = ads[Math.floor(Math.random()*ads.length)];

  $("#footer_partner").html(adData.footer[campus]);
  $("#ad1").attr("src", ad1.img);
  $("#ad2").attr("src", ad2.img);

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
});

function getUrlParams(key){
  var url = new URL(location.href);
  var c = url.searchParams.get(key);
  return c
}
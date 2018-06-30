$(document).ready( function () {
  let campus = getUrlParams('campus').toUpperCase();
  if (!campus){
    return;
  }

  $.getJSON("ad_data.json", function(json) {
      const adData = json;
      let ads = adData.ad[campus];

      // pick random at top
      const index = Math.floor(Math.random()*ads.length);
      let ad1 = ads[index];
      delete ads[ index ];
      let ad2 = ads[Math.floor(Math.random()*ads.length)];

      $("#footer_partner").html(adData.footer[campus]);
      $("#ad1").attr("src", ad1.img);
      $("#ad2").attr("src", ad2.img);

      $("#ad1").attr("onclick", 'window.open("' + ad1.url + '")');
      $("#ad2").attr("onclick", 'window.open("' + ad2.url + '")');
  });
});

function getUrlParams(key){
  var url = new URL(location.href);
  var c = url.searchParams.get(key);
  return c
}
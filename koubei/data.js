let radarChart = initRadarChart();

let complete = new autoComplete({
        selector: '#courseCode_field',
        minChars: 3,
        source: function(term, suggest){
            term = term.toLowerCase();
            full_courses.sort()
            var choices = full_courses;
            var matches = [];
            for (i=0; i<choices.length; i++)
                if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
            suggest(matches);
        },
        onSelect: function(e, term, item){
          searchCourse(term);
    }
});


$(document).ready( function () {
    $('#full_table').DataTable({
      paging: false,
      // searching: false,
      columns: [
          { data: 'name' },
          { data: 'term' },
          { data: 'lecture' },
          { data: 'assisgnment' },
          { data: 'overall' },
          { data: 'courseload' },
          { data: 'recommand' },
      ],
      language: {
          "lengthMenu": "",
          "zeroRecords": "没有找到任何结果",
          "info": "",
          "infoEmpty": "没有找到任何结果",
          "infoFiltered": "",
          "search": "",
      },
    });
    $(".dataTables_filter input").addClass("form-control")
    $(".dataTables_filter input").attr("placeholder", '搜索');

});

function drawRadarChart(data) {
  radarChart.config.data = {
    labels: ["课堂质量", "作业/考试", "整体评价", "课程负荷", "推荐指数"],
    datasets: data
  };

  // Update UI
  radarChart.update();
  $('#hide-tip').show();
}

function initRadarChart() {
    var ctx = $('#radarChart');
    var myChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ["Lecture", "作业/考试", "整体评价", "课程负荷", "推荐指数"],
          datasets: {}
        },
        options: {
          maintainAspectRatio: true,
        }
    });
    return myChart;
}

function searchCourse() {
	let courseCode = $('#courseCode_field').val().toUpperCase();
	if (courseCode.length != 8){
		alert('请输入完整课程代码');
		return;
	}

  $('#search-button').attr('disabled',"true");

	const HOST = "https://api.xiaoduo.ca";
	// const HOST = "http://127.0.0.1:8082";
    $.ajax({
        type: "GET",
        data: {
            courseCode: courseCode
        },
        url: HOST + "/temp/koubei/searchCourseCode"
    }).done(function(res) {
      $('#search-button').removeAttr("disabled")

    	if (res.status == 0){
        loadTableData(res.data.full_result);
        loadChartData(res.data.avg_result);

        // show data cards
        $('#radarChartCard').show();
        $('#fullTableCard').show();

        // scroll
        $('html, body').animate({
            scrollTop: $("#radarChartCard").offset().top - 20
        }, 1000);

        $('.courseCode').html(courseCode);

        // render ads
        renderAd(campusMapping(courseCode));
      }
      else{
        alert(res['message']);
      }
    }).fail(function(jqXHR, textStatus, errorThrown) {
      $('#search-button').removeAttr("disabled")
      alert("请求失败，请稍后重试");
    });
}

function loadTableData(data){
  let lst = [];
  for (i = 0; i < data.length; i++) {
    lst.push(Object.values(data[i]));
  }
  $('#full_table').dataTable().fnClearTable();
  $('#full_table').dataTable().fnAddData(data);
}


function loadChartData(data){
  let datasets = [];
  let usedColor = [];
  let max_shown = 3;
  for (var name in data) {
      if (data.hasOwnProperty(name)) {
          result = constrctChartCell(name, data[name], usedColor, max_shown);
          datasets.push(result.cellData);
          usedColor = result.usedColor;
          max_shown -= 1;
      }
  }
  drawRadarChart(datasets);
}

function constrctChartCell(name, data, usedColor, max_shown) {
  let color = random_rgba();
  while ($.inArray(color, usedColor) != -1){
    color = random_rgba();
  }
  usedColor.push(color);
  cellData = {
          label: name,
          data: [data.lecture, data.assisgnment, data.overall, data.courseload, data.recommand],
          backgroundColor: [
              color +  '0.2)',
          ],
          borderColor: [
              color +  '1)',
          ],
          borderWidth: 2
  };
  if ((max_shown) <= 0){
    cellData.hidden = true;
  }
  return {'cellData': cellData, 'usedColor': usedColor};
}

// helper
function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',';
}

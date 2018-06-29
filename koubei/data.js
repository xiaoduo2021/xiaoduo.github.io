let radarChart = initRadarChart();

function drawRadarChart(data) {
    radarChart.config.data = {
      labels: ["Lecture", "作业/考试", "整体评价", "课程负荷", "推荐指数"],
      datasets: data
    };
    // radarChart.canvas.parentNode.style.height = '200px';
    radarChart.update();
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
	const HOST = "https://api.xiaoduo.ca";
	// const HOST = "http://127.0.0.1:8082";
    $.ajax({
        type: "GET",
        data: {
            courseCode: courseCode
        },
        url: HOST + "/temp/koubei/searchCourseCode"
    }).done(function(res) {
    	if (res.status == 0){
        loadTableData(res.data.full_result);
        loadChartData(res.data.avg_result);
        $('#courseCode').html(courseCode);
      }
      else{
        alert(res['message']);
      }
    }).fail(function(jqXHR, textStatus, errorThrown) {
      alert("请求失败，请稍后重试");
    });
}

function loadTableData(data){
  let table_html = ""
  for (i = 0; i < data.length; i++) {
    table_html += getOneCell(data[i]);
  }
  $('#table_cells').html(table_html);
}

function getOneCell(item) {
  let html = '<tr><th scope="row">' + item.name +'</th>';
  html += '<td>' + item.term + '</td>';
  html += '<td>' + item.lecture + '</td>';
  html += '<td>' + item.assisgnment + '</td>';
  html += '<td>' + item.overall + '</td>';
  html += '<td>' + item.courseload + '</td>';
  html += '<td>' + item.recommand + '</td></tr>';
  return html;
}

function loadChartData(data){
  let datasets = [];
  let usedColor = [];
  for (var name in data) {
      if (data.hasOwnProperty(name)) {
          result = constrctChartCell(name, data[name], usedColor);
          datasets.push(result.cellData);
          usedColor = result.usedColor;
      }
  }
  drawRadarChart(datasets);
}

function constrctChartCell(name, data, usedColor) {
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
  return {'cellData': cellData, 'usedColor': usedColor};
}

// helper
function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',';
}

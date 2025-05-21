"use strict";

moveClock();

function time(){
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  const timenow = `${(h < 10 ? "0" + h : h)}:${(m < 10 ? "0" + m : m)}`;
  return timenow;
}

function getAverageHistoricalData(url, measurement_type, length_of_hours){

    fetch(url + measurement_type + '/' + length_of_hours)
    .then(function(response){
      response.json()
      .then(function(data){
        if(measurement_type == 'temp')buildTempChart(data);
        else if(measurement_type == 'temp_p_response')buildTempPChart(data);
        else if(measurement_type == 'temp_i_response')buildTempIChart(data);
        else if(measurement_type == 'hum')buildHumChart(data);
        else if(measurement_type == 'hum_p_response')buildHumPChart(data);
        else if(measurement_type == 'hum_i_response')buildHumIChart(data);
      })
  })
}


function getLiveData(url, value, measurement_type){
  /*
     to make the url as url/float/temp
  */
  fetch(url + value + '/' + measurement_type)
  .then(function(response){
      response.json()
      .then(function(data){
        if(measurement_type == 'temp_p_response')liveTempPChart(data, measurement_type);
        else if(measurement_type == 'temp_i_response')liveTempIChart(data);
        else if(measurement_type == 'hum_p_response')liveHumPChart(data);
        else if(measurement_type == 'hum_i_response')liveHumIChart(data);
      })
  })
  .catch(function(error){
      console.log('Request failed', error)
  })
}

// Build the temperature charts
function buildTempChart(data){
  for(let i = 0; i < data.length; i++){
    tempData["data"]["datasets"][0]["data"].pop();
    tempData["data"]["labels"].pop();
  }

  let dataObjNew = tempData["data"]["datasets"][0]["data"];
  let timeStamp = tempData["data"]["labels"];

  for (let i = 0; i < data.length; i+=20){
    dataObjNew.push(data[i][1]);
    timeStamp.push(data[i][0].substring(11,16));
  }
  window.tempChart.update()
}

// Build the temperature charts and call for new data every one minute
getAverageHistoricalData(URL_avgraph, 'temp', 24);
setInterval(function(){
  getAverageHistoricalData(URL_avgraph, 'temp', 24);
}, 60000);

// Build the Live charts
function buildTempPChart(data){
  let dataObjNew = tempPData["data"]["datasets"][0]["data"];
  let timeStamp = tempPData["data"]["labels"];

  for (let i = 0; i < data.length; i++){
    dataObjNew.push(data[i][1]);
    timeStamp.push(data[i][0].substring(11,16));
  }
  window.tempPChart.update()
}

function liveTempPChart(data){
  let dataObjNew = tempPData["data"]["datasets"][0]["data"];
  let timeStamp = tempPData["data"]["labels"];

  dataObjNew.push(data.value);
  timeStamp.push(time());
  if(dataObjNew.length > 800)dataObjNew.shift();
  window.tempPChart.update();
}

function buildTempIChart(data){
  let dataObjNew = tempIData["data"]["datasets"][0]["data"];
  let timeStamp = tempIData["data"]["labels"];

  for (let i = 0; i < data.length; i++){
    dataObjNew.push(data[i][1]);
    timeStamp.push(data[i][0].substring(11,16));
  }
  window.tempIChart.update()
}

function liveTempIChart(data){
  let dataObjNew = tempIData["data"]["datasets"][0]["data"];
  let timeStamp = tempIData["data"]["labels"];

  dataObjNew.push(data.value);
  timeStamp.push(time());
  if(dataObjNew.length > 800)dataObjNew.shift();
  window.tempIChart.update();
}

function buildHumIChart(data){
  let dataObjNew = humIData["data"]["datasets"][0]["data"];
  let timeStamp = humIData["data"]["labels"];

  for (let i = 0; i < data.length; i++){
    dataObjNew.push(data[i][1]);
    timeStamp.push(data[i][0].substring(11,16));
  }
  window.humIChart.update()
}

function liveHumIChart(data){
  let dataObjNew = humIData["data"]["datasets"][0]["data"];
  let timeStamp = humIData["data"]["labels"];

  dataObjNew.push(data.value);
  timeStamp.push(time());
  if(dataObjNew.length > 800)dataObjNew.shift();
  window.humIChart.update();
}

function buildHumPChart(data){
  let dataObjNew = humPData["data"]["datasets"][0]["data"];
  let timeStamp = humPData["data"]["labels"];

  for (let i = 0; i < data.length; i++){
    dataObjNew.push(data[i][1]);
    timeStamp.push(data[i][0].substring(11,16));
  }
  window.humPChart.update()
}

function liveHumPChart(data){
  let dataObjNew = humPData["data"]["datasets"][0]["data"];
  let timeStamp = humPData["data"]["labels"];

  dataObjNew.push(data.value);
  timeStamp.push(time());
  if(dataObjNew.length > 800)dataObjNew.shift();
  window.humPChart.update();
}

getAverageHistoricalData(URL_avgraph, 'temp_p_response', 6);
getAverageHistoricalData(URL_avgraph, 'temp_i_response', 6);
getAverageHistoricalData(URL_avgraph, 'hum_p_response', 6);
getAverageHistoricalData(URL_avgraph, 'hum_i_response', 6);

setInterval(function(){
  getLiveData(URL_last, 'float', 'temp_p_response');
  getLiveData(URL_last, 'float', 'temp_i_response');
  getLiveData(URL_last, 'float', 'hum_p_response');
  getLiveData(URL_last, 'float', 'hum_i_response');
}, 5000);


function buildHumChart(data){
  // if there is data in the array empty it first
  for(let i = 0; i < data.length; i++){
    humData["data"]["datasets"][0]["data"].pop();
    humData["data"]["labels"].pop();
  }

  let dataObjNew = humData["data"]["datasets"][0]["data"];
  let timeStamp = humData["data"]["labels"];

  // push the new data back into the array
  for (let i = 0; i < data.length; i++){
      dataObjNew.push(data[i][1]);
      timeStamp.push(data[i][0].substring(11,16));
  }
  window.humChart.update()
}

// Get the Hunidity data for a 24 hour period
getAverageHistoricalData(URL_avgraph, 'hum', 24);
setInterval(function(){
  getAverageHistoricalData(URL_avgraph, 'hum', 24);
}, 60000);


function mixed(url, length_of_hours){
  const mixedArr = [];

  fetch(url + 'temp' + '/' + length_of_hours)
    .then(function(response){
      response.json()
      .then(function(data){
        for(let i =0; i < data.length; i++){
          data[i].push('temp')
          mixedArr.push(data[i]);
        }
      })
  })

  fetch(url + 'hum' + '/' + length_of_hours)
    .then(function(response){
      response.json()
      .then(function(data){
        for(let i =0; i < data.length; i++){
          data[i].push('hum')
         mixedArr.push(data[i])
        }
        buildMixedChart(mixedArr);
      })
  })
}

function buildMixedChart(data){
  // Both the temperature and humidity for a 24 hour period
  for(let i = 0; i < data.length; i++){
    mixedData["data"]["datasets"][0]["data"].pop();
    mixedData["data"]["datasets"][1]["data"].pop();
    mixedData["data"]["labels"].pop();
  }

  let temp_data_new = mixedData["data"]["datasets"][0]["data"];
  let hum_data_new = mixedData["data"]["datasets"][1]["data"];
  let timeStamp = mixedData["data"]["labels"];

  for (let i = 0; i < data.length; i++){
    if(data[i][2] == 'temp'){
      temp_data_new.push(data[i][1]);
      timeStamp.push(data[i][0].substring(11,16));
    }
    else if(data[i][2] == 'hum'){
      hum_data_new.push(data[i][1]);
    }
  }
  window.myLine3.update();
}
// Get mixed chart data for 24 hours
mixed(URL_avgraph, 24)
setInterval(function(){
  mixed(URL_avgraph, 24);
}, 60000);


var tempData = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Temperature over 24 hours",
        data: [],
        borderColor:'red',
        borderWidth:1,
        pointStyle: 'circle',
        pointRadius: 1,
      },
    ],
  },
  options: {
    responsive: true,
    spanGaps:true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
          ticks: {
            beginAtZero: false,
            stacked: true,
            callback: function(val, index) {
              return val.toFixed(2);
            },
          },
      }
  }
  },
};
let temp_chart_context = document.getElementById("tempChart").getContext("2d");
window.tempChart = new Chart(temp_chart_context, tempData);

let tempPData = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Temp P response",
        data: [],
        borderColor:'red',
        borderWidth:1,
        pointStyle: 'circle',
        pointRadius: 1,
      },
    ],
  },
  options: {
    responsive: true,
    spanGaps:true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
          ticks: {
            beginAtZero: false,
            stacked: true,
            callback: function(val, index) {
              return val.toFixed(2);
            },
          },
      }
  }
  },
};
let temp_P_chart_context = document.getElementById("tempPChart").getContext("2d");
window.tempPChart = new Chart(temp_P_chart_context, tempPData);

let tempIData = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Temp I response",
        data: [],
        borderColor:'red',
        borderWidth:1,
        pointStyle: 'circle',
        pointRadius: 1,
      },
    ],
  },
  options: {
    responsive: true,
    spanGaps:true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
          ticks: {
            beginAtZero: false,
            stacked: true,
            callback: function(val, index) {
              return val.toFixed(2);
            },
          },
      }
  }
  },
};
let temp_I_chart_context = document.getElementById("tempIChart").getContext("2d");
window.tempIChart = new Chart(temp_I_chart_context, tempIData);

var humData = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Humidity over 24 Hours",
        data: [],
        borderColor:'blue',
        borderWidth:1,
        pointStyle: 'circle',
        pointRadius: 1,
      },
    ],
  },
  options: {
    responsive: true,
    spanGaps:true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
        y: {
            ticks: {
              callback: function(val, index) {
                return val.toFixed(2);
              },
            },
        }
    }
  },
};
let hum_chart_context = document.getElementById("humChart").getContext("2d");
window.humChart = new Chart(hum_chart_context, humData);

let humPData = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Hum P response",
        data: [],
        borderColor:'blue',
        borderWidth:1,
        pointStyle: 'circle',
        pointRadius: 1,
      },
    ],
  },
  options: {
    responsive: true,
    spanGaps:true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
          ticks: {
            beginAtZero: false,
            stacked: true,
            callback: function(val, index) {
              return val.toFixed(2);
            },
          },
      }
  }
  },
};
let hum_P_chart_context = document.getElementById("humPChart").getContext("2d");
window.humPChart = new Chart(hum_P_chart_context, humPData);

let humIData = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Hum I response",
        data: [],
        borderColor:'blue',
        borderWidth:1,
        pointStyle: 'circle',
        pointRadius: 1,
      },
    ],
  },
  options: {
    responsive: true,
    spanGaps:true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
          ticks: {
            beginAtZero: false,
            stacked: true,
            callback: function(val, index) {
              return val.toFixed(2);
            },
          },
      }
  }
  },
};
let hum_I_chart_context = document.getElementById("humIChart").getContext("2d");
window.humIChart = new Chart(hum_I_chart_context, humIData);


var mixedData = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Temperature",
        data: [],
        borderColor:'red',
        borderWidth:1,
        pointStyle: 'circle',
        pointRadius: 1,
        yAxisID: 'y',
      },
      {
        label: "Humidity over 24 hours",
        data: [],
        borderColor: 'blue',
        borderWidth:1,
        pointStyle: 'circle',
        pointRadius: 1,
        yAxisID: 'y1',
      },
    ],
  },
  options: {
    responsive: true,
    spanGaps:true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks:{
          callback: function(val, index) {
            return val.toFixed(2);
          },
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks:{
          callback: function(val, index) {
            return val.toFixed(2);
          },
        },
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
  },
};

let temp_hum_chart_context = document.getElementById("mixedChart").getContext("2d");
window.myLine3 = new Chart(temp_hum_chart_context, mixedData);

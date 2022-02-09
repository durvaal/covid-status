const API_BASE_URL = "https://covid-19.dataflowkit.com/v1";
const MAPS_API_KEY = "";
const COVID_STATUS_TYPE = {
  ALL: "ALL",
  WORLD: "WORLD",
};

let REGIONS_DATA = [];
let CHART_DATA = [["", ""]];

function xhttpAssincrono(callBackFunction, type) {
  const xhttp = new XMLHttpRequest();

  xhttp.responseType = "json";

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      // Chama a função em callback e passa a resposta da requisição
      callBackFunction(this.response);
    }
  };

  // Path para a requisição AJAX.
  let url = API_BASE_URL;

  switch (type) {
    case COVID_STATUS_TYPE.ALL:
      url;
      break;
    case COVID_STATUS_TYPE.WORLD:
      url += "/world";
      break;
  };

  xhttp.open("GET", url, true);
  xhttp.send();
};

function initRegionsMapChart() {
  google.charts.load("current", {
    packages: ["geochart"],
    mapsApiKey: MAPS_API_KEY,
  });

  google.charts.setOnLoadCallback(drawRegionsMap);
};

function drawRegionsMap() {
  const data = google.visualization.arrayToDataTable(CHART_DATA);
  const options = {};
  const chart = new google.visualization.GeoChart(document.getElementById("regions-chart"));
  
  chart.draw(data, options);
};

function initLoading() {
  $(".regions-world-data").fadeOut();
  $(".regions-loading").fadeIn();
};

function finishLoading() {
  $(".regions-world-data").removeClass("opacity-0");
  $(".regions-world-data").fadeIn();
  $(".regions-loading").fadeOut();
};

function handleWorldCovidStatusData(data) {
  $("#world-active-cases-text").text(data["Active Cases_text"]);
  $("#world-new-cases-text").text(data["New Cases_text"]);
  $("#world-new-deaths-text").text(data["New Deaths_text"]);
  $("#world-total-cases-text").text(data["Total Cases_text"]);
  $("#world-total-deaths-text").text(data["Total Deaths_text"]);
  $("#world-total-recovered-text").text(data["Total Recovered_text"]);
  $("#world-last-update").text(data["Last Update"]);
  finishLoading();
};

function convertedRegionsApiDataToChartData(apiData) {
  const chartData = [["Região", "Total de Casos", { role: "tooltip" }]];
  
  /**
   * Mapeia o dado retornado da api para o tooltip do de cada região do mapa
   */
  apiData.forEach((region) => {
    chartData.push([
      region["Country_text"],
      region["Country_text"],
      `Casos ativos: ${region["Active Cases_text"] || 'N/A'}
       Novos casos: ${region["New Cases_text"] || 'N/A'}
       Mortes: ${region["New Deaths_text"] || 'N/A'}
       Total de casos: ${region["Total Cases_text"] || 'N/A'}
       Total de mortes: ${region["Total Deaths_text"] || 'N/A'}
       Total de recuperados: ${region["Total Recovered_text"] || 'N/A'}
       Data de atualização: ${region["Last Update"] ? new Date(region["Last Update"]).toLocaleString("PT-BR") : 'N/A'}`
    ]);
  });

  return chartData;
};

function populateWorldStatusSection() {
  CHART_DATA = convertedRegionsApiDataToChartData(REGIONS_DATA);
  initRegionsMapChart();
};

function populateRegionsStatusSection() {
  $(".carousel-inner").empty();
  $.each(REGIONS_DATA, function (index, region) {
    $(".carousel-inner").append(`<div class="carousel-item ${index === 0 ? 'active' : ''}">
      <div class="carousel-item-fake"></div>
      <div class="carousel-caption d-none d-md-block">
        <div class="card mb-4 rounded-3 shadow-sm">
          <div class="card-header py-3 text-white bg-dark border-dark">
            <h4 class="my-0 fw-normal">${region["Country_text"]}</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-6 text-end">
                <span>Casos ativos</span>
              </div>
              <div class="col-6 text-start">
                <span><b>${region["Active Cases_text"] || 'N/A'}</b></span>
              </div>
              <div class="col-6 text-end">
                <span>Novos casos</span>
              </div>
              <div class="col-6 text-start">
                <span><b>${region["New Cases_text"] || 'N/A'}</b></span>
              </div>
              <div class="col-6 text-end">
                <span>Mortes</span>
              </div>
              <div class="col-6 text-start">
                <span><b>${region["New Deaths_text"] || 'N/A'}</b></span>
              </div>
              <div class="col-6 text-end">
                <span>Total de casos</span>
              </div>
              <div class="col-6 text-start">
                <span><b>${region["Total Cases_text"] || 'N/A'}</b></span>
              </div>
              <div class="col-6 text-end">
                <span>Total de mortes</span>
              </div>
              <div class="col-6 text-start">
                <span><b>${region["Total Recovered_text"] || 'N/A'}</b></span>
              </div>
              <div class="col-6 text-end">
                <span>Total de recuperados</span>
              </div>
              <div class="col-6 text-start">
                <span><b>${region["Total Recovered_text"] || 'N/A'}</b></span>
              </div>
              <div class="col-6 text-end">
                <span>Data de atualização</span>
              </div>
              <div class="col-6 text-start">
                <span><b>${region["Last Update"] ? new Date(region["Last Update"]).toLocaleString("PT-BR") : 'N/A'}</b></span>
              </div>
            </div>
            <button type="button" class="btn btn-lg btn-outline-primary my-2 btn-save" onclick="saveRegionData(${index})">Salvar Informações</button>
          </div>
        </div>
      </div>
    </div>`);
  });
};

function handleAllCovidStatusData(regionsData) {
  REGIONS_DATA = regionsData;
  populateWorldStatusSection();
  populateRegionsStatusSection();
};

function getWorldCovidStatus() {
  initLoading();
  xhttpAssincrono(handleWorldCovidStatusData, COVID_STATUS_TYPE.WORLD);
};

function getAllCovidStatus() {
  initLoading();
  xhttpAssincrono(handleAllCovidStatusData, COVID_STATUS_TYPE.ALL);
};

$(window).resize(function(){
  drawRegionsMap();
});

$(function () {
  getWorldCovidStatus();
  getAllCovidStatus();
});
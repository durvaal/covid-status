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
  const options = {
    colorAxis: { colors: ["#0d6efd", "#ffc107", "#e31b23"] },
  };
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
  const region = mapApiData(data);
  
  $("#world-active-cases-text").text(region.activeCases);
  $("#world-new-cases-text").text(region.newCases);
  $("#world-new-deaths-text").text(region.newDeaths);
  $("#world-total-cases-text").text(region.totalCases);
  $("#world-total-deaths-text").text(region.totalDeaths);
  $("#world-total-recovered-text").text(region.totalRecovered);
  $("#world-last-update").text(region.totalRecovered);

  finishLoading();
};

function formatStringToNumber(string) {
  let number = 0;

  if (!string || string === "N/A") {
    return number;
  }

  string = string.replaceAll(",", "");
  string = string.replaceAll("+", "");
  
  number = Number.parseInt(string, 10);

  return number;
}

function mapApiData(region) {
  return {
    country: region["Country_text"],
    activeCases: region["Active Cases_text"],
    newCases: region["New Cases_text"],
    newDeaths: region["New Deaths_text"],
    totalCases: region["Total Cases_text"],
    totalDeaths: region["Total Deaths_text"],
    totalRecovered: region["Total Recovered_text"],
    lastUpdate: region["Last Update"],
  };
};

function convertedRegionsApiDataToChartData(apiData) {
  const chartData = [["Região", "Total de Casos", { role: "tooltip" }]];
  
  /**
   * Mapeia o dado retornado da api para o tooltip do de cada região do mapa
   */
  apiData.forEach((region) => {
    chartData.push([
      region.country,
      formatStringToNumber(region.activeCases),
      `Casos ativos: ${region.activeCases || "N/A"}
       Novos casos: ${region.newCases || "N/A"}
       Mortes: ${region.newDeaths|| "N/A"}
       Total de casos: ${region.totalCases || "N/A"}
       Total de mortes: ${region.totalDeaths || "N/A"}
       Total de recuperados: ${region.totalRecovered || "N/A"}
       Última atualização: ${region.lastUpdate ? new Date(region.lastUpdate).toLocaleString("PT-BR") : "N/A"}`
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
    $(".carousel-inner").append(`<div class="carousel-item ${index === 0 ? "active" : ""}">
      <div class="carousel-item-fake"></div>
      <div class="carousel-caption d-none d-md-block">
        <div class="card mb-4 rounded-3 shadow-sm">
          <div class="card-header py-3 text-primary border-primary">
            <h4 class="my-0 fw-normal">${region.country}</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-6 text-end">
                <span class="text-muted">Casos ativos</span>
              </div>
              <div class="col-6 text-start">
                <span class="text-primary"><b>${region.activeCases || "N/A"}</b></span>
              </div>
              <div class="col-6 text-end">
                <span class="text-muted">Novos casos</span>
              </div>
              <div class="col-6 text-start">
                <span class="text-primary"><b>${region.newCases || "N/A"}</b></span>
              </div>
              <div class="col-6 text-end">
                <span class="text-muted">Mortes</span>
              </div>
              <div class="col-6 text-start">
                <span class="text-primary"><b>${region.newDeaths || "N/A"}</b></span>
              </div>
              <div class="col-6 text-end">
                <span class="text-muted">Total de casos</span>
              </div>
              <div class="col-6 text-start">
                <span class="text-primary"><b>${region.totalCases || "N/A"}</b></span>
              </div>
              <div class="col-6 text-end">
                <span class="text-muted">Total de mortes</span>
              </div>
              <div class="col-6 text-start">
                <span class="text-primary"><b>${region.totalDeaths || "N/A"}</b></span>
              </div>
              <div class="col-6 text-end">
                <span class="text-muted">Total de recuperados</span>
              </div>
              <div class="col-6 text-start">
                <span class="text-primary"><b>${region.totalRecovered || "N/A"}</b></span>
              </div>
              <div class="col-6 text-end">
                <span class="text-muted">Última atualização</span>
              </div>
              <div class="col-6 text-start">
                <span class="text-primary"><b>${region.lastUpdate ? new Date(region.lastUpdate).toLocaleString("PT-BR") : "N/A"}</b></span>
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
  REGIONS_DATA = regionsData.map((region) => mapApiData(region));
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
const API_BASE_URL = "https://covid-19.dataflowkit.com/v1";
const MAPS_API_KEY = "AIzaSyAh3RiYwcqytVpa4UBr3Iy9umjSdcP4bXU";
const COVID_STATUS_TYPE = {
  ALL: "ALL",
  WORLD: "WORLD",
};
let REGIONS_DATA = [];

function showSaveWithSuccessToast() {
  $("#saveWithSuccessToast").toast("show");
};

function showNotSaveWithSuccessToast() {
  $("#notSaveWithSuccessToast").toast("show");
};

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

function initRegionsMapChart(chartData) {
  google.charts.load("current", {
    packages: ["geochart"],
    mapsApiKey: MAPS_API_KEY,
  });
};

function loadRegionsMapChart(chartData) {
  initRegionsMapChart();

  google.charts.setOnLoadCallback(function() {
    drawRegionsMap(chartData);
  });
};

function drawRegionsMap(chartData) {
  const data = google.visualization.arrayToDataTable(chartData);
  const options = {
    colorAxis: { colors: ["#0d6efd", "#ffc107", "#e31b23"] },
  };
  const chart = new google.visualization.GeoChart(document.getElementById("regions-chart"));
  
  chart.draw(data, options);
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

function getConvertedRegionsApiDataToChartData(apiData) {
  const chartData = [["Região", "Total de Casos", { role: "tooltip" }]];
  
  /**
   * Mapeia o dado retornado da api para o tooltip do de cada região do mapa
   */
  apiData.forEach((region) => {
    chartData.push([
      region.country || "N/A",
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

function populateWorldStatusSection(regionsData) {
  REGIONS_DATA = regionsData;
  loadRegionsMapChart(getConvertedRegionsApiDataToChartData(regionsData));
};

function populateRegionsStatusSection(regionsData) {
  $(".carousel-inner").empty();
  $.each(regionsData, function (index, region) {
    $(".carousel-inner").append(`<div class="carousel-item ${index === 0 ? "active" : ""}">
      <div class="carousel-item-fake"></div>
      <div class="carousel-caption d-none d-md-block">
        <div class="card mb-4 rounded-3 shadow-sm">
          <div class="card-header py-3 text-primary border-primary">
            <h4 class="my-0 fw-normal">${region.country || "N/A"}</h4>
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
  // Alguns objetos não retornam o lastUpdate totalizando 7 campos, o objeto completo possui 8 campos, e tem objetos que possuem 1 campo
  const regionsDataFiltered = regionsData.filter((region) => Object.entries(region).length >= 7).map((region) => mapApiData(region));

  populateWorldStatusSection(regionsDataFiltered);
  populateRegionsStatusSection(regionsDataFiltered);
};

function getWorldCovidStatus() {
  initLoading();
  xhttpAssincrono(handleWorldCovidStatusData, COVID_STATUS_TYPE.WORLD);
};

function getAllCovidStatus() {
  initLoading();
  xhttpAssincrono(handleAllCovidStatusData, COVID_STATUS_TYPE.ALL);
};

function saveRegionData(index) {
  const regionDataToSave = {
    [REGIONS_DATA[index].country]: [
      REGIONS_DATA[index],
    ],
  };
  const REGIONS_DATA_STORAGE = JSON.parse(localStorage.getItem("REGIONS_DATA_STORAGE"));

  // Quando não existe nenhuma região salva
  if (!REGIONS_DATA_STORAGE) {
    localStorage.setItem("REGIONS_DATA_STORAGE", JSON.stringify(regionDataToSave));
    showSaveWithSuccessToast();
  } else {
    const regionDataHasSaved = REGIONS_DATA_STORAGE[REGIONS_DATA[index].country];

    // Quando já existe a região salva, um novo objeto é salvo na lista dessa região
    if (regionDataHasSaved) {
      const hasRegionDataWithSameLastUpdateValue = REGIONS_DATA_STORAGE[REGIONS_DATA[index].country].some((region) => region.lastUpdate === REGIONS_DATA[index].lastUpdate);

      if (hasRegionDataWithSameLastUpdateValue) {
        showNotSaveWithSuccessToast();
      } else {
        REGIONS_DATA_STORAGE[REGIONS_DATA[index].country].push(REGIONS_DATA[index]);
      
        localStorage.setItem("REGIONS_DATA_STORAGE", JSON.stringify(REGIONS_DATA_STORAGE));
        showSaveWithSuccessToast();
      }
    } else {
      // Quando a região não existe mas já existe outra região, a nova região é concatenada as demais regiões
      const NEW_REGIONS_DATA_STORAGE = Object.assign(REGIONS_DATA_STORAGE, regionDataToSave);

      localStorage.setItem("REGIONS_DATA_STORAGE", JSON.stringify(NEW_REGIONS_DATA_STORAGE));
      showSaveWithSuccessToast();
    }
  }
};

$(window).resize(function(){
  drawRegionsMap();
});

$(function () {
  getWorldCovidStatus();
  getAllCovidStatus();
});
function deleteWithSuccessToast() {
  $("#deleteWithSuccessToast").toast("show");
};

function initBarChart() {
  google.charts.load("current", { "packages": ["bar"] });
};

function loadMapChart(index, informations) {
  initBarChart();
  google.charts.setOnLoadCallback(function () {
    drawMap(index, informations);
  });
};

function drawMap(index, informations) {
  const data = google.visualization.arrayToDataTable(informations);
  const options = {
    legend: { textStyle: { fontSize: 12 } },
  };
  const chart = new google.charts.Bar(document.getElementById(`region-chart-${index}`));

  chart.draw(data, google.charts.Bar.convertOptions(options));
};

function getConvertedRegionInformationsToChartData(regionInformations) {
  const chartData = [["Data de atualização", "Total de casos", "Total de mortes", "Total de recuperados"]];

  regionInformations.forEach((region) => {
    chartData.push([
      region.lastUpdate ? new Date(region.lastUpdate).toLocaleString("PT-BR") : "N/A",
      formatStringToNumber(region.totalCases),
      formatStringToNumber(region.totalDeaths),
      formatStringToNumber(region.totalRecovered),
    ]);
  });

  return chartData;
};

function populateRegionsSection(REGIONS_DATA_STORAGE) {
  $("#regions-informations").empty();

  if (!Object.entries(REGIONS_DATA_STORAGE).length) {
    $("#regions-informations-alert").removeClass("d-none");
  } else {
    $.each(Object.entries(REGIONS_DATA_STORAGE), function (index, region) {
      const [country, informations] = region;

      $("#regions-informations").append(`<div class="col-12">
        <div class="card mb-4 rounded-3 shadow-sm">
          <div class="card-header py-3 text-primary border-primary">
            <h4 class="my-0 fw-normal">${country || "N/A"}</h4>
          </div>
          <div class="card-body">
            <div id="region-chart-${index}" class="regions-chart"></div>
            <button type="button" class="btn btn-lg btn-outline-primary my-4 btn-save" onclick="deleteRegionData('${country}')">Excluir Informações</button>
          </div>
        </div>
      </div>`);

      loadMapChart(index, getConvertedRegionInformationsToChartData(informations));
    });
  }
};

function deleteRegionData(country) {
  const REGIONS_DATA_STORAGE = JSON.parse(localStorage.getItem("REGIONS_DATA_STORAGE")) || {};
  delete REGIONS_DATA_STORAGE[country];

  localStorage.setItem("REGIONS_DATA_STORAGE", JSON.stringify(REGIONS_DATA_STORAGE));

  getRegionsDataStorage();
  deleteWithSuccessToast();
};

function getRegionsDataStorage() {
  const REGIONS_DATA_STORAGE = JSON.parse(localStorage.getItem("REGIONS_DATA_STORAGE")) || {};
  populateRegionsSection(REGIONS_DATA_STORAGE);
};

$(window).resize(function(){
  getRegionsDataStorage();
});

$(function () {
  getRegionsDataStorage();
  finishLoading();
});
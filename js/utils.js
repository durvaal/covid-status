function formatStringToNumber(string) {
  let number = 0;

  if (!string || string === "N/A") {
    return number;
  }

  string = string.replaceAll(",", "");
  string = string.replaceAll("+", "");
  
  number = Number.parseInt(string, 10);

  return number;
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

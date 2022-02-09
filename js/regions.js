function showSaveWithSuccessToast() {
  $("#saveWithSuccessToast").toast("show");
};

function showNotSaveWithSuccessToast() {
  $("#notSaveWithSuccessToast").toast("show");
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
      const hasRegionDataWithSameLastUpdateValue = REGIONS_DATA_STORAGE[REGIONS_DATA[index].country].filter((region) => region.lastUpdate === REGIONS_DATA[index].lastUpdate);

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
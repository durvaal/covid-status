function saveRegionData(index) {
  const regionDataToSave = {
    [REGIONS_DATA[index]["Country_text"]]: [
      REGIONS_DATA[index],
    ],
  };
  const REGIONS_DATA_STORAGE = JSON.parse(localStorage.getItem("REGIONS_DATA_STORAGE"));

  if (!REGIONS_DATA_STORAGE) {
    // Quando não existe nenhuma região salva
    localStorage.setItem("REGIONS_DATA_STORAGE", JSON.stringify(regionDataToSave));
  } else {
    const regionDataHasSaved = REGIONS_DATA_STORAGE[REGIONS_DATA[index]["Country_text"]];

    if (regionDataHasSaved) {
      // Quando já existe a região salva, um novo objeto é salvo na lista dessa região
      REGIONS_DATA_STORAGE[REGIONS_DATA[index]["Country_text"]].push(REGIONS_DATA[index]);
      
      localStorage.setItem("REGIONS_DATA_STORAGE", JSON.stringify(REGIONS_DATA_STORAGE));
    } else {
      // Quando a região não existe mas já existe outra região, a nova região é concatenada as demais regiões
      const NEW_REGIONS_DATA_STORAGE = Object.assign(REGIONS_DATA_STORAGE, regionDataToSave);

      localStorage.setItem("REGIONS_DATA_STORAGE", JSON.stringify(NEW_REGIONS_DATA_STORAGE));
    }
  }
};
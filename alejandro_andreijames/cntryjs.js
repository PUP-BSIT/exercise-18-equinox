async function countryInformation() {
    const countryInput = document.querySelector("#input_country").value;
  
    const countryResponse = await fetch(
      `https://restcountries.com/v3.1/name/${countryInput}`
    );
    const countryData = await countryResponse.json();
  
    if (!countryData.length) {
      alert("Country not found");
      return;
    }
  
    const region = countryData[0].region[0];
  
    const regionResponse = await fetch(
      `https://restcountries.com/v3.1/region/${region}`
    );
    const regionData = await regionResponse.json();
  
    displayCountryDetails(countryData[0]);
  
    displayRelatedCountries(regionData);
  }
  
  function displayCountryDetails(country) {
    const countryDetailsElement = document.querySelector("#details");
    countryDetailsElement.innerHTML = `<h2>${country.name.common}</h2>
                                        <p>Region: ${country.region[0]}</p>
                                        <p>Capital: ${country.capital[0]}</p>
                                        <p>Population: ${country.population}</p>
                                        <p>Area: ${country.area} sq km</p>
                                        <p>Language: ${Object.values( 
                                          country.languages
                                        ).join(", ")}</p>`;
  }
  
  function displayRelatedCountries(relatedCountries) {
    const relatedCountriesElement = document.querySelector("#related");
    const relatedCountriesList = relatedCountries
      .map((country) => `<li>${country.name.common}</li>`)
      .join("");
    relatedCountriesElement.innerHTML = `<h2>Lists of Related Countries</h2>
                                            ${relatedCountriesList}`;
  }
  
async function searchCountry() {
  const searchInput = document.getElementById("searchInput").value;
  try {
    const countryResponse = await fetch(
      `https://restcountries.com/v3.1/name/${searchInput}`
    );
    const countryData = await countryResponse.json();

    const country = countryData[0];
    const region = country.region;

    const regionResponse = await fetch(
      `https://restcountries.com/v3.1/region/${region}`
    );
    const regionData = await regionResponse.json();

    displayCountryDetails(country);
    displayOtherCountries(regionData);
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayCountryDetails(country) {
  const countryDetails = document.getElementById("countryDetails");
  countryDetails.innerHTML = `
      <h2>${country.name.common}</h2>
      <p>Capital: ${country.capital}</p>
      <p>Timezone: ${country.timezones}</p>
      <p>Population: ${country.population}</p>
      <p>Region: ${country.region}</p>
      <p>Area Size: ${country.area}</p>
    `;
}

function displayOtherCountries(regionData) {
  const otherCountries = document.getElementById("otherCountries");

  regionData.sort((a, b) => {
    const countryA = a.name.common.toUpperCase();
    const countryB = b.name.common.toUpperCase();
    if (countryA < countryB) {
      return -1;
    }
    if (countryA > countryB) {
      return 1;
    }
    return 0;
  });

  otherCountries.innerHTML = `
      <h3>Other Countries in the Same Region:</h3>
      <ul>
        ${regionData
          .map((country) => `<li>${country.name.common}</li>`)
          .join("")}
      </ul>
    `;
}

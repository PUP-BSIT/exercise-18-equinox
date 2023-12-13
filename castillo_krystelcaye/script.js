let nameInput = document.querySelector("#name");
let commentInput = document.querySelector("#comment");
let commentButton = document.querySelector("#comment_button");
let commentsSectionSort = document.querySelector(".group-comment");
let ascendingButton = document.querySelector("#sort_ascending");
let descendingButton = document.querySelector("#sort_descending");
let comments = [];

nameInput.addEventListener("input", toggleCommentButton);
commentInput.addEventListener("input", toggleCommentButton);
commentButton.addEventListener("click", addComment);
ascendingButton.addEventListener("click", sortCommentsAscending);
descendingButton.addEventListener("click", sortCommentsDescending);

function toggleCommentButton() {
    let nameValue = nameInput.value;
    let commentValue = commentInput.value;

    commentButton.disabled = !(nameValue.trim() && commentValue.trim());
}

function addComment() {
    let name = nameInput.value;
    let comment = commentInput.value;

    if (name.trim() || comment.trim()) {
        return;
    }

    let timestamp = new Date().toLocaleString();

    let commentObj = {
        name: name,
        comment: comment,
        timestamp: timestamp,
    };

    comments.push(commentObj);

    nameInput.value = '';
    commentInput.value = '';
    commentButton.setAttribute('disabled', 'true');

    displayComments();
}

function displayComments() {
    commentsSectionSort.innerHTML = '';

    for (let comment of comments) {
        let commentElement = document.createElement('div');
        commentElement.innerHTML = `<p class="input">- <em>${comment.name}: 
        ${comment.comment}</em> (Date: ${comment.timestamp})</p>`
        commentsSectionSort.appendChild(commentElement);
    }
}

function sortCommentsAscending(event) {
    event.preventDefault();

    comments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    displayComments();
}

function sortCommentsDescending(event) {
    event.preventDefault();

    comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    displayComments();
}

function searchCountry() {
    const searchInput = document.querySelector('#searchInput').value;

    fetch(`https://restcountries.com/v3.1/name/${searchInput}`)
        .then(response => response.json())
        .then(countryData => {
            const region = countryData[0].region;

            fetch(`https://restcountries.com/v3.1/region/${region}`)
                .then(response => response.json())
                .then(regionData => {
                    displayCountryDetails(countryData[0]);
                    displaySameRegionCountries(regionData);
                })
                .catch(error => console.error('Error fetching region data:',
                 error));
        })
        .catch(error => console.error('Error fetching country data:', error));
}

function displayCountryDetails(country) {
    const detailsList = document.querySelector('#details_List');
    detailsList.innerHTML = ` 
    <h2>${country.name.common}</h2>
    <p>Capital: ${country.capital}</p>
    <p>Status: ${country.status}</p>
    <p>Population: ${country.population}</p>
    <p>Borders: ${country.borders}</p>
    <p>Continents: ${country.continents}</p>
  `; 
}

function displaySameRegionCountries(regionData) {
    const regionList = document.querySelector('#region_List');
    regionList.innerHTML = `
    <h3>Other Countries in the Same Region:</h3>
    <ul>
      ${regionData
        .map((country) => `<li>${country.name.common}</li>`)
        .join("")}
    </ul>
  `; 
}

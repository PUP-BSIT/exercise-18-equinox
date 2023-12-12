const baseUrl = 'https://wibs.tech/restapi/alejandro_backend.php';

async function fetchAnime() {
    try {
        const response = await fetch(baseUrl);
        const data = await response.json();
        console.log('Anime:', data);
        return data;
    } catch (error) {
        console.error('Error fetching anime:', error);
    }
}

async function addAnime(animeData) {
    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(animeData),
        });
        console.log(await response.text());
    } catch (error) {
        console.error('Error adding anime:', error);
    }
}

async function updateAnime(animeId, animeData) {
    try {
        const response = await fetch(`${baseUrl}?id=${animeId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ ...animeData, id: animeId }),
        });
        console.log(await response.text());
    } catch (error) {
        console.error('Error updating anime:', error);
    }
}

async function deleteAnime(animeId) {
    try {
        const response = await fetch(`${baseUrl}?id=${animeId}`, {
            method: 'DELETE',
        });
        console.log(await response.text());
    } catch (error) {
        console.error('Error deleting anime:', error);
    }
}

function updateAnimeList(animes) {
    const animeList = document.getElementById('anime_list');
    animeList.innerHTML = '';

    animes.forEach(anime => {
        const listItem = document.createElement('li');
        listItem.textContent = `Title: ${anime.title}, 
        Author: ${anime.author}, 
        Year Released: ${anime.year_released}, 
        Studio: ${anime.studio}, 
        Seasons: ${anime.seasons}, 
        Episodes: ${anime.episodes}`;

        const editButton = createButton('Edit', () => handleEdit(anime.id));
        const deleteButton = createButton('Delete', async () => {
            await deleteAnime(anime.id);
            const updatedAnimes = await fetchAnime();
            updateAnimeList(updatedAnimes);
        });

        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        animeList.appendChild(listItem);
    });
}

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

function handleEdit(animeId) {
    console.log('Edit button clicked for anime ID:', animeId);

    fetch(`${baseUrl}?id=${animeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(animeDetailsArray => {
            const animeDetails = animeDetailsArray[0];

            console.log('Anime details:', animeDetails);

            if (animeDetails && animeDetails.title) {
                const editForm = document.createElement('form');
                editForm.innerHTML = `
                    <label for="editTitle">Title:</label>
                    <input type="text" id="editTitle" 
                    name="title" 
                    value="${animeDetails.title}" required>

                    <label for="editAuthor">Author:</label>
                    <input type="text" id="editAuthor" 
                    name="author" 
                    value="${animeDetails.author || ''}" required>

                    <label for="editStudio">Studio:</label>
                    <input type="text" id="editStudio" 
                    name="studio" 
                    value="${animeDetails.studio || ''}" required>

                    <label for="editYearReleased">Year Released:</label>
                    <input type="number" id="editYearReleased" 
                    name="year_released" 
                    value="${animeDetails.year_released || ''}" required>

                    <label for="editSeasons">Seasons:</label>
                    <input type="number" id="editSeasons" 
                    name="seasons" 
                    value="${animeDetails.seasons || ''}" required>

                    <label for="editEpisodes">Episodes:</label>
                    <input type="number" id="editEpisodes" 
                    name="episodes" 
                    value="${animeDetails.episodes || ''}" required>

                    <button type="submit">Save Changes</button>
                `;

                editForm.addEventListener('submit', async (event) => {
                    event.preventDefault();

                    const updatedAnimeData = {
                    title: editForm.elements.editTitle.value,
                    author: editForm.elements.editAuthor.value,
                    studio: editForm.elements.editStudio.value,
                    year_released: editForm.elements.editYearReleased.value,
                    seasons: editForm.elements.editSeasons.value,
                    episodes: editForm.elements.editEpisodes.value,
                    };

                    await updateAnime(animeId, updatedAnimeData);

                    const updatedAnimes = await fetchAnime();
                    updateAnimeList(updatedAnimes);

                    editForm.remove();
                });

                document.body.appendChild(editForm);
            } else {
                console.error(
                    'Error: Anime details not available or incomplete');
            }
        })
        .catch(error => console.error(
            'Error fetching anime details for editing:', error));
}

document.addEventListener('DOMContentLoaded', async () => {
    const addAnimeForm = document.getElementById('add_anime_form');
    const response = await fetchAnime();

    if (response) {
        updateAnimeList(response);
    }

    addAnimeForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(addAnimeForm);
        const animeData = Object.fromEntries(formData.entries());

        await addAnime(animeData);
        addAnimeForm.reset();

        const updatedAnimes = await fetchAnime();
        updateAnimeList(updatedAnimes);
    });
});

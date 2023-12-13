const baseUrl = 'https://wibs.tech/restapi/alejandro_backend.php';

async function fetchAnime() {
    try {
        const response = await fetch(baseUrl);
        const data = await response.json();
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
    } catch (error) {
        console.error('Error updating anime:', error);
    }
}

async function deleteAnime(animeId) {
    try {
        const response = await fetch(`${baseUrl}?id=${animeId}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Error deleting anime:', error);
    }
}

function updateAnimeList(animes) {
    const animeList = document.querySelector('#anime_list');
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
                    <label for="edit_title">Title:</label>
                    <input type="text" id="edit_title" 
                    name="title" 
                    value="${animeDetails.title}" required>

                    <label for="edit_author">Author:</label>
                    <input type="text" id="edit_author" 
                    name="author" 
                    value="${animeDetails.author || ''}" required>

                    <label for="edit_studio">Studio:</label>
                    <input type="text" id="edit_studio" 
                    name="studio" 
                    value="${animeDetails.studio || ''}" required>

                    <label for="edit_year_released">Year Released:</label>
                    <input type="number" id="edit_year_released" 
                    name="year_released" 
                    value="${animeDetails.year_released || ''}" required>

                    <label for="edit_seasons">Seasons:</label>
                    <input type="number" id="edit_seasons" 
                    name="seasons" 
                    value="${animeDetails.seasons || ''}" required>

                    <label for="edit_episodes">Episodes:</label>
                    <input type="number" id="edit_episodes" 
                    name="episodes" 
                    value="${animeDetails.episodes || ''}" required>

                    <button type="submit">Save Changes</button>
                `;

                editForm.addEventListener('submit', async (event) => {
                    event.preventDefault();

                    const updatedAnimeData = {
                    title: editForm.elements.edit_title.value,
                    author: editForm.elements.edit_author.value,
                    studio: editForm.elements.edit_studio.value,
                    year_released: editForm.elements.edit_year_released.value,
                    seasons: editForm.elements.edit_seasons.value,
                    episodes: editForm.elements.edit_episodes.value,
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
    const addAnimeForm = document.querySelector('#add_anime_form');
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

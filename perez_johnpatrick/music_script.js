const baseUrl = 'https://wibs.tech/restapi/perez_backend.php';

async function fetchMusic() {
    try {
        const response = await fetch(baseUrl);
        const data = await response.json();
        console.log('Music:', data);
        return data;
    } catch (error) {
        console.error('Error fetching music:', error);
    }
}

async function addMusic(musicData) {
    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(musicData),
        });
        console.log(await response.text());
    } catch (error) {
        console.error('Error adding music:', error);
    }
}

async function updateMusic(musicId, musicData) {
    try {
        const response = await fetch(`${baseUrl}?id=${musicId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ ...musicData, id: musicId }),
        });
        console.log(await response.text());
    } catch (error) {
        console.error('Error updating music:', error);
    }
}

async function deleteMusic(musicId) {
    try {
        const response = await fetch(`${baseUrl}?id=${musicId}`, {
            method: 'DELETE',
        });
        console.log(await response.text());
    } catch (error) {
        console.error('Error deleting music:', error);
    }
}

function updateMusicList(music) {
    const music_list = document.getElementById('music_list');
    music_list.innerHTML = '';

    music.forEach(musicItem => {
        const listItem = document.createElement('li');
        listItem.textContent = `Title: ${musicItem.title}, Artist:
        ${musicItem.artist},
        Genre: ${musicItem.genre}, Year: ${musicItem.release_year},
        Album: ${musicItem.album}`;

        const editButton = createButton
        ('Edit', () => handleEdit(musicItem.id));
        const deleteButton = createButton('Delete', async () => {
            await deleteMusic(musicItem.id);
            const updatedMusic = await fetchMusic();
            updateMusicList(updatedMusic);
        });

        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        music_list.appendChild(listItem);
    });
}

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

function handleEdit(musicId) {
    console.log('Edit button clicked for music ID:', musicId);

    fetch(`${baseUrl}?id=${musicId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(musicDetailsArray => {
            const musicDetails = musicDetailsArray[0];

            console.log('Music details:', musicDetails);

            if (musicDetails && musicDetails.title) {
                const editForm = document.createElement('form');
                editForm.innerHTML = `
                    <label for="editTitle">Title:</label>
                    <input type="text" id="editTitle" name="title" 
                        value="${musicDetails.title}" required>
                    <label for="editArtist">Artist:</label>
                    <input type="text" id="editArtist" name="artist" 
                        value="${musicDetails.artist || ''}" required>
                    <label for="editYear">Year:</label>
                    <input type="number" id="editYear" name="release_year" 
                        value="${musicDetails.release_year || ''}" required>
                    <label for="editGenre">Genre:</label>
                    <input type="text" id="editGenre" name="genre" 
                        value="${musicDetails.genre || ''}" required>
                    <label for="editAlbum">Album:</label>
                    <input type="text" id="editAlbum" name="album" 
                        value="${musicDetails.album || ''}" required>
                    <button type="submit">Save Changes</button>
                `;

                editForm.addEventListener('submit', async (event) => {
                    event.preventDefault();

                    const updatedMusicData = {
                        title: editForm.elements.editTitle.value,
                        artist: editForm.elements.editArtist.value,
                        genre: editForm.elements.editGenre.value,
                        release_year: editForm.elements.editYear.value,
                        album: editForm.elements.editAlbum.value,
                    };

                    await updateMusic(musicId, updatedMusicData);

                    const updatedMusic = await fetchMusic();

                    updateMusicList(updatedMusic);

                    editForm.remove();
                });

                document.body.appendChild(editForm);
            } else {
                console.error(
                    'Error: Music details not available or incomplete');
            }
        })
        .catch(error => console.error(
            'Error fetching music details for editing:', error));
}

document.addEventListener('DOMContentLoaded', async () => {
    const add_music_form = document.getElementById('add_music_form');
    const response = await fetchMusic();

    if (response) {
        updateMusicList(response);
    }

    add_music_form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(add_music_form);
        const musicData = Object.fromEntries(formData.entries());

        await addMusic(musicData);
        add_music_form.reset();

        const updatedMusic = await fetchMusic();
        updateMusicList(updatedMusic);
    });
});
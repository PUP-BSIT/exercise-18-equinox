const baseUrl = 'https://wibs.tech/restapi/castillo_backend.php';

async function fetchKdramas() {
    try {
        const response = await fetch(baseUrl);
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching kdramas:', error);
    }
}

async function addKdrama(kdramaData) {
    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(kdramaData),
        });

    } catch (error) {
        console.error('Error adding kdrama:', error);
    }
}

async function updateKdrama(kdramaId, kdramaData) {
    try {
        const response = await fetch(`${baseUrl}?id=${kdramaId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ ...kdramaData, id: kdramaId }),
        });

    } catch (error) {
        console.error('Error updating kdrama:', error);
    }
}

async function deleteKdrama(kdramaId) {
    try {
        const response = await fetch(`${baseUrl}?id=${kdramaId}`, {
            method: 'DELETE',
        });

    } catch (error) {
        console.error('Error deleting kdrama:', error);
    }
}

function updateKdramaList(kdramas) {
    const kdrama_list = document.querySelector('#kdrama_list');
    kdrama_list.innerHTML = '';

    kdramas.forEach(kdrama => {
        const listItem = document.createElement('li');
        listItem.textContent = `Title: ${kdrama.title}, Cast: ${kdrama.cast}, 
        Year: ${kdrama.release_year}, Genre: ${kdrama.genre}, 
        Rating: ${kdrama.rating}`;

        const editButton = createButton('Edit', () => handleEdit(kdrama.id));
        const deleteButton = createButton('Delete', async () => {
            await deleteKdrama(kdrama.id);
            const updatedKdramas = await fetchKdramas();
            updateKdramaList(updatedKdramas);
        });

        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        kdrama_list.appendChild(listItem);
    });
}

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

function handleEdit(kdramaId) {

    fetch(`${baseUrl}?id=${kdramaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(kdramaDetailsArray => {
            const kdramaDetails = kdramaDetailsArray[0];

            if (kdramaDetails && kdramaDetails.title) {
                const editForm = document.createElement('form');
                editForm.innerHTML = `
                    <label for="editTitle">Title:</label>
                    <input type="text" id="editTitle" name="title" 
                        value="${kdramaDetails.title}" required>
                    <label for="editCast">Cast:</label>
                    <input type="text" id="editCast" name="cast" 
                        value="${kdramaDetails.cast || ''}" required>
                    <label for="editYear">Year:</label>
                    <input type="number" id="editYear" name="release_year" 
                        value="${kdramaDetails.release_year || ''}" required>
                    <label for="editGenre">Genre:</label>
                    <input type="text" id="editGenre" name="genre" 
                        value="${kdramaDetails.genre || ''}" required>
                    <label for="editRating">Rating:</label>
                    <input type="number" id="editRating" name="rating" 
                        value="${kdramaDetails.rating || ''}" required>
                    <button type="submit">Save Changes</button>
                `;

                editForm.addEventListener('submit', async (event) => {
                    event.preventDefault();

                    const updatedKdramaData = {
                        title: editForm.elements.editTitle.value,
                        cast: editForm.elements.editCast.value,
                        release_year: editForm.elements.editYear.value,
                        genre: editForm.elements.editGenre.value,
                        rating: editForm.elements.editRating.value,
                    };

                    await updateKdrama(kdramaId, updatedKdramaData);

                    const updatedKdramas = await fetchKdramas();

                    updateKdramaList(updatedKdramas);

                    editForm.remove();
                });

                document.body.appendChild(editForm);
            } else {
                console.error(
                    'Error: Kdrama details not available or incomplete');
            }
        })
        .catch(error => console.error(
            'Error fetching kdrama details for editing:', error));
}

document.addEventListener('DOMContentLoaded', async () => {
    const add_kdrama_form = document.querySelector('#add_kdrama_form');
    const response = await fetchKdramas();

    if (response) {
        updateKdramaList(response);
    }

    add_kdrama_form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(add_kdrama_form);
        const kdramaData = Object.fromEntries(formData.entries());

        await addKdrama(kdramaData);
        add_kdrama_form.reset();

        const updatedKdramas = await fetchKdramas();
        updateKdramaList(updatedKdramas);
    });
});

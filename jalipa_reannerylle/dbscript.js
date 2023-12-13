const baseUrl = "https://wibs.tech/restapi/rylle_backend.php";

async function fetchPokemons() {
  try {
    const response = await fetch(baseUrl);
    const data = await response.json();
    console.log("Pokemons:", data);
    return data;
  } catch (error) {
    console.error("Error fetching pokemons:", error);
  }
}

async function addPokemon(pokemonData) {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(pokemonData),
    });
    console.log(await response.text());
  } catch (error) {
    console.error("Error adding pokemon:", error);
  }
}

async function updatePokemon(pokemonId, pokemonData) {
  try {
    const response = await fetch(`${baseUrl}?id=${pokemonId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ ...pokemonData, id: pokemonId }),
    });
    console.log(await response.text());
  } catch (error) {
    console.error("Error updating pokemon:", error);
  }
}

async function deletePokemon(pokemonId) {
  try {
    const response = await fetch(`${baseUrl}?id=${pokemonId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error("Error deleting pokemon:", error);
  }
}

function updatePokemonList(pokemons) {
  const pokemonList = document.querySelector("#pokemon_list");
  pokemonList.innerHTML = "";

  pokemons.forEach((pokemon) => {
    const listItem = document.createElement("li");

    const name = document.createElement("b");
    name.textContent = `Name: ${pokemon.name}, `;
    listItem.appendChild(name);

    const type = document.createElement("b");
    type.textContent = `Type: ${pokemon.type}, `;
    listItem.appendChild(type);

    listItem.innerHTML += `Level: ${pokemon.level}, `;

    const ability = document.createElement("b");
    ability.textContent = `Ability: ${pokemon.ability}, `;
    listItem.appendChild(ability);

    listItem.innerHTML += `Location: ${pokemon.location}`;

    const editButton = createButton("Edit", () => handleEdit(pokemon.id));
    const deleteButton = createButton("Delete", async () => {
      await deletePokemon(pokemon.id);
      const updatedPokemons = await fetchPokemons();
      updatePokemonList(updatedPokemons);
    });

    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    pokemonList.appendChild(listItem);
  });
}

function createButton(text, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
}

function handleEdit(pokemonId) {
  console.log("Edit button clicked for pokemon ID:", pokemonId);

  fetch(`${baseUrl}?id=${pokemonId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((pokemonDetailsArray) => {
      const pokemonDetails = pokemonDetailsArray[0];

      console.log("Pokemon details:", pokemonDetails);

      if (pokemonDetails && pokemonDetails.name) {
        const editForm = document.createElement("form");
        editForm.innerHTML = `
                <label for="name">Name:</label>
                <input type="text" id="edit_name" name="name" value="${
                  pokemonDetails.name
                }" required><br>

                <label for="type">Type:</label>
                <input type="text" id="edit_type" name="type" value="${
                  pokemonDetails.type || ""
                }" required><br>

                <label for="level">Level:</label>
                <input type="number" id="edit_level" name="level" value="${
                  pokemonDetails.level || ""
                }" required><br>

                <label for="ability">Ability:</label>
                <input type="text" id="edit_ability" name="ability" value="${
                  pokemonDetails.ability || ""
                }" required><br>

                <label for="location">Location:</label>
                <input type="text" id="edit_location" name="location" value="${
                  pokemonDetails.location || ""
                }" required><br>

            <button type="submit">Save Changes</button>
             `;

        editForm.addEventListener("submit", async (event) => {
          event.preventDefault();

          const updatedPokemonData = {
            name: editForm.elements.edit_name.value,
            type: editForm.elements.edit_type.value,
            level: editForm.elements.edit_level.value,
            ability: editForm.elements.edit_ability.value,
            location: editForm.elements.edit_location.value,
          };

          await updatePokemon(pokemonId, updatedPokemonData);

          const updatedPokemons = await fetchPokemons();
          updatePokemonList(updatedPokemons);

          editForm.remove();
        });

        document.body.appendChild(editForm);
      } else {
        console.error("Error: Pokemon details not available or incomplete");
      }
    })
    .catch((error) =>
      console.error("Error fetching pokemon details for editing:", error)
    );
}

document.addEventListener("DOMContentLoaded", async () => {
  const addPokemonForm = document.querySelector("#add_pokemon_form");
  const response = await fetchPokemons();

  if (response) {
    updatePokemonList(response);
  }

  addPokemonForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(addPokemonForm);
    const pokemonData = Object.fromEntries(formData.entries());

    await addPokemon(pokemonData);
    addPokemonForm.reset();

    const updatedPokemons = await fetchPokemons();
    updatePokemonList(updatedPokemons);
  });
});

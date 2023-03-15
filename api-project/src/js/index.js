async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function returnFetch(entry) {
  try {
    const response = await fetch(entry);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return 1;
  }
}

async function getAllTypes() {
  const url = "https://pokeapi.co/api/v2/type";
  const typeData = await fetchData(url);
  return typeData.results.map((type) => type.name);
}

async function getPokemonByType(type) {
  const url = `https://pokeapi.co/api/v2/type/${type}`;
  const typeData = await fetchData(url);
  return typeData.pokemon.map((p) => p.pokemon);
}

function displayPokemon(pokemon) {
  const pokemonList = document.getElementById("pokemonList");
  pokemonList.innerHTML = "";
  pokemon.forEach((p) => {
    const listItem = document.createElement("li");
    listItem.textContent = p.name;
    pokemonList.appendChild(listItem);
  });
}

const typeSelect = document.getElementById("typeSelect");
typeSelect.addEventListener("change", async () => {
  const selectedType = typeSelect.value;
  const pokemonData = await getPokemonByType(selectedType);
  const pokemon = pokemonData.map((p) => {
    return {
      name: p.name,
      types: p.types.map((t) => t.type.name),
    };
  });
  displayPokemon(pokemon);
});

async function init() {
  const allTypes = await getAllTypes();
  allTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeSelect.appendChild(option);
  });
}

init();

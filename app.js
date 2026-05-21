const typeColors = {
    fire: "from-red-500 to-orange-500",
    water: "from-blue-500 to-cyan-500",
    grass: "from-green-500 to-lime-500",
    electric: "from-yellow-300 to-yellow-600",
    psychic: "from-pink-500 to-purple-500",
    ghost: "from-purple-700 to-indigo-900",
    normal: "from-gray-400 to-gray-600"
};

async function getPokemon() {
    const id = Math.floor(Math.random() * 151) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return data;
}

document.getElementById('openCard').onclick = async () => {
    const pokemon = await getPokemon();
    renderCard(pokemon);
}

function renderCard(pokemon) {
    const card = document.getElementById('card');
    const bgColor = typeColors[pokemon.types[0].type.name] || "from-slate-500 to-slate-700";

    card.innerHTML =
    `
    <div class ="max-w-md bg-gradient-to-br ${bgColor} rounded-lg shadow-md overflow-hidden animate-pulse">
        <img class="rounded-t-lg w-full bg-slate-200" 
        src ="${pokemon.sprites.other.showdown.front_default}">

        <div class="p-5">
            <h5 class="mb-2 font-bold text-gray-900 text-2xl tracking-tight capitalize">${pokemon.name}</h5>

            <p class="mb-3 font-normal text-gray-700">#${pokemon.id}</p>

            <button id="saveBtn" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800">Guardar</button>

        </div>
        
    </div>
    `;
    document.getElementById('saveBtn').onclick = () => {
        addToDeck(pokemon);
    };
}

async function addToDeck(pokemon) {
    await savePokemon(pokemon);
    await loadDeck();
}

async function loadDeck() {
    const result = await db.allDocs({ include_docs: true });
    renderDeck(result.rows);
}

function renderDeck(pokemons){
    const deck = document.getElementById('deck');
    deck.innerHTML = '';
    pokemons.forEach(pokemon => {
        deck.innerHTML += `
        <div class="bg-white rounded-xl p-4 shadow-lg">
            <img src ="${pokemon.doc.sprites.other.showdown.front_default}" class="w-full h-32 object-contain">
            <h3 class="text-black text-xl font-bold capitalize">${pokemon.doc.name}</h3>
            <p class="text-gray-700"> lvl: ${pokemon.doc.level}</p>
        </div>
        `
    });
}
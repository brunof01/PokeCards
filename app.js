const typeColors = {
    normal: "from-gray-400 to-gray-600",
    fire: "from-red-500 to-orange-500",
    water: "from-blue-500 to-cyan-500",
    electric: "from-yellow-300 to-yellow-600",
    grass: "from-green-500 to-lime-500",
    ice: "from-cyan-300 to-sky-500",
    fighting: "from-red-700 to-red-900",
    poison: "from-purple-500 to-fuchsia-700",
    ground: "from-amber-500 to-yellow-700",
    flying: "from-sky-400 to-indigo-500",
    psychic: "from-pink-500 to-purple-500",
    bug: "from-lime-500 to-green-700",
    rock: "from-yellow-700 to-stone-800",
    ghost: "from-purple-700 to-indigo-900",
    dragon: "from-indigo-600 to-violet-800",
    dark: "from-gray-700 to-black",
    steel: "from-slate-400 to-slate-700",
    fairy: "from-pink-300 to-rose-500"
};

async function getPokemon() {
    const id = Math.floor(Math.random() * 1025) + 1;
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
    showToast(`${pokemon.name} foi salvo no seu Deck!`);
    await loadDeck();
}

async function loadDeck() {
    const result = await db.allDocs({ include_docs: true });
    renderDeck(result.rows);
}

function renderDeck(pokemons){
    const deck = document.getElementById('deck');
    deck.innerHTML = '';
    pokemons.forEach((pokemon, index) => {
        deck.insertAdjacentHTML('beforeend', `
        <div class="bg-white rounded-xl p-4 shadow-lg">
            <img src ="${pokemon.doc.sprites.other.showdown.front_default}" class="w-full h-32 object-contain">
            <h3 class="text-black text-xl font-bold capitalize">${pokemon.doc.name}</h3>
            <p class="text-gray-700"> lvl: ${pokemon.doc.level}</p>
            <button id="btn-modal-${index}" data-modal-target="default-modal" data-modal-toggle="default-modal" class="text-black bg-brand border bg-blue-700 border-transparent hover:bg-blue-800 focus:ring-1 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none" type="button"> Detalhes da Carta
            </button>
        </div>
        `);
        document.getElementById(`btn-modal-${index}`).onclick = () => {
            showDetails(pokemon.doc);
        };
        if (typeof initFlowbite === 'function') {
        initFlowbite();
    }
    });
}

function showToast(message){
    const toast = document.getElementById('toast-sucess');
    const toastMessage = document.getElementById('toast-message');

    toastMessage.innerText = message;
    toast.classList.remove('hidden');

    setTimeout(() =>{
        toast.classList.add('hidden');
    }, 3000);
}

function showDetails(pokemon){
    const modalContainer = document.getElementById('modal-content');
    const bgColor = typeColors[pokemon.types[0].type.name] || "from-slate-500 to-slate-700";
    modalContainer.innerHTML =
    `
    <div class ="max-w-md bg-gradient-to-br ${bgColor} rounded-lg shadow-md overflow-hidden">

        <div class="p-5">
            <h5 class="mb-3 font-bold text-gray-900 text-2lg tracking-tight capitalize">Nome: ${pokemon.name}</h5>
            <p class="mb-3 font-bold text-gray-900 text-2lg tracking-tight capitalize">Código: ${pokemon.id}</p>
            <p class="mb-3 font-bold text-gray-900 text-2lg tracking-tight capitalize">Tipo: ${pokemon.types[0].type.name}</p>

        </div>
        
    </div>
    `;
} 
async function getPokemon(){
    const id = Math.floor(Math.random() * 151) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return{
        id: data.id,
        name: data.name,
        image: data.sprites.front_default
    };
} 

document.getElementById('openCard').onclick = async () =>
{
    const pokemon = await getPokemon();
    renderCard(pokemon);
}

function renderCard(pokemon){
    const card = document.getElementById('card');
    card.innerHTML = 
    `
    <div class ="max-w-md bg-white border border-gray-200 rounded-lg shadow-sm">
        <img class="rounded-t-lg w-full bg-slate-200" 
        src ="${pokemon.image}">          

        <h5 class="mb-2 font-bold text-gray-900 text-2xl tracking-tight capitalize">${pokemon.name}</h5>
        <p class="mb-3 font-normal text-gray-700">#${pokemon.id}</p>
        <button id="saveBtn" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bf-blue-700 rounded-lg hover:bg-blue-800">Guardar</button>
    </div>
    `;
    document.getElementById('saveBtn').onclick = () => {
        addToDeck(pokemon.id, pokemon.name, pokemon.image);
    };
}

async function addToDeck(id, name, image){
    await savePokemon( {id, name, image});
    await loadDeck();
}

async function loadDeck(){
    const result = await db.allDocs({include_docs: true});
    const deck = document.getElementById('deck');
    deck.innerHTML = '';
    result.rows.forEach(row => {
        const pokemon = row.doc;
        deck.innerHTML += 
        `
        <div class="card">
            <img src ="${pokemon.image}">
            <p>${pokemon.name}</p>
            <p>lvl: ${pokemon.level}</p>
        </div>
        `;
    });
}
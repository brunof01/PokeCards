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
    <div class ="card">
        <img src ="${pokemon.image}">
        <p>${pokemon.name}</p>
        <button id="saveBtn">Guardar</button>
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
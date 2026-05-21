const db = new PouchDB('deck');

async function savePokemon(pokemon){
    try{
        const existing = await db.get(pokemon.id.toString());
        existing.level += 1;
        await db.put(existing);
    } catch{
        pokemon._id = pokemon.id.toString();
        pokemon.level = 1;
        await db.put(pokemon);
    }
}
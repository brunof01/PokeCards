const db = new PouchDB('deck');

async function savePokemon(pokemon){
    try{
        const existing = await db.get(String(pokemon.id));
        existing.level += 1;
        await db.put(existing);
    } catch{
        await db.put(
            {
                _id: String(pokemon.id),
                name: pokemon.name,
                image: pokemon.image,
                level: 1
            }
        );
    }
}
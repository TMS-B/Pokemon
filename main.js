/* Lorsque je clique sur un pokemon --> doit apparaitre : nom, image, type, stats

rechercher un pokemon via une searchbar, à la recherche du nom complet --> 
s'il existe --> afficher sa page (try)
sinon --> erreur (catch)

ajouter bouton favoris sur chacune des fiches --> liste paginer
--> ajouter un onglet avc tous les fav
--> retirer un favoris

afficher un message s'il y a une erreur dans l'api et ou si un pokemon n'existe pas 

<div class="statsContainer1">
        <h1 class="idPokemon">${pokemons[id].id}</h1>
        <img class="pokeFace" src="${pokemons[id].image}">
        <div class="dataPokemon">
            <p class="statOne">HP ${pokemons[id].stats.HP}</p>
            <p class="statOne">Attaque Special ${pokemons[id].stats.special_attack}</p>
            <p class="statOne">Attaque ${pokemons[id].stats.attack}</p>
            <p class="statOne">Defense Special ${pokemons[id].stats.special_defense}</p>
            <p class="statOne">Defense ${pokemons[id].stats.defense}</p>
            <p class="statOne">Vitesse ${pokemons[id].stats.speed}</p>
        </div>
        <div class="type">
            <p class="statTwo">${pokemons[id].apiTypes[0].name}</p>
            <img class="statTwo" src="${pokemons[id].apiTypes[0].image}">
        </div>
    </div>
*/
let nextButton = document.getElementById("nextBtn");
let previousButton = document.getElementById("previousBtn");
let pokemon_list = document.getElementById("pokemonList");
let searchInput = document.getElementById("searchBar")
let numbersOfItems = 20;
let firstDisplay = 0;
let lastDisplay = firstDisplay + numbersOfItems;
let pokemons;
let evolutions = "";

async function searchPokemon() {
    lastDisplay = firstDisplay + numbersOfItems;
    firstDisplay = 0;
    try {
        const res = await fetch("./pokemon.json");
        const json = await res.json();
        pokemons = json;
    } catch (error) {
        console.error("Erreur lors du chargement du fichier JSON", error);
    }
}

function showPokemon(){
    pokemon_list.innerHTML = `<div class="pokemonRow">
                <div class="favorite">Favoris</div>
                <div class="id">N°</div>
                <div class="image">Img.</div>
                <div class="name">Pokémon</div>
                <div class="description">Type</div>
            </div>`;
        for (let i = firstDisplay; i < lastDisplay; i++){
        let colonneContainer = document.createElement("div");
        colonneContainer.id = i;
        colonneContainer.innerHTML = 
        `<div class="favorite">
            <img id="starFavorite" src="./image/star.svg" alt="star favorite">
        </div>
        <div class="id">${pokemons[i].id}</div>
        <div class="image"><img src="${pokemons[i].image}" alt="${pokemons[i].name}"/></div>
        <div class="name">${pokemons[i].name}</div>
        <div class="description">${pokemons[i].apiTypes[0].name}</div>`;
        colonneContainer.className = "pokemonRow";
        colonneContainer.addEventListener('click', pokemonStat)
        pokemon_list.appendChild(colonneContainer);
    }
}
function pokemonStat(){
    let id = parseInt(this.id);
    let pokemonDetails = document.createElement("div");
    pokemonDetails.innerHTML = `
    <div class="overlayModalTrigger"></div>
    <div class="cardPokemon">   
        <button class="closeModalTrigger">X</button>
        <div class="statsContainer">
            
            <div class="leftCard">
               <h1 class="idPokemon">ID : ${pokemons[id].id}</h1>
               <img class="pokeFace" src="${pokemons[id].image}"> 
               <div class="type">
                    <p class="statTwo">${pokemons[id].apiTypes[0].name}</p>
                    <img class="statTwo" src="${pokemons[id].apiTypes[0].image}">
                </div>
            </div>
            <div class="dataPokemon">
                <p class="statOne">HP : ${pokemons[id].stats.HP}</p>
                <p class="statOne">Attaque Special : ${pokemons[id].stats.special_attack}</p>
                <p class="statOne">Attaque : ${pokemons[id].stats.attack}</p>
                <p class="statOne">Defense Special : ${pokemons[id].stats.special_defense}</p>
                <p class="statOne">Defense : ${pokemons[id].stats.defense}</p>
                <p class="statOne">Vitesse : ${pokemons[id].stats.speed}</p>
            </div>
        </div>
        <hr>
        <div class="pokemonAround">
            ${ id > 0 ? '<img class="pokemonBefore" src="'+ pokemons[id-1].image +'" alt="'+ pokemons[id-1].name +'"/>': ""}
            ${ id+1 < pokemons.length ? '<img class="pokemonAfter" src="'+ pokemons[id+1].image +'" alt="'+ pokemons[id+1].name +'"/>': ""}
        </div>
    </div>`;
    pokemonDetails.className = "detailsWindows";
    document.querySelector("main").appendChild(pokemonDetails);
//variable dedans, le terner commence à 0, ''= immense string, : = condition de notre terner et si la condition n'est pas rempli alors c'est null -->
}
window.onload = async () => {
    await searchPokemon();
    showPokemon();
}
nextButton.addEventListener('click', () =>{
    if (lastDisplay < pokemons.length){
        firstDisplay += numbersOfItems;
        lastDisplay += numbersOfItems;
        showPokemon(); 
    }else {
    } 
});
previousButton.addEventListener('click', () =>{
    if (firstDisplay != 0){
        firstDisplay -= numbersOfItems;
        lastDisplay -= numbersOfItems;
        showPokemon();
    }
});

searchInput.addEventListener("keyup", searchbar)

async function searchbar(e) {
    const searchString = e.target.value.toLowerCase().replace(/\s/g, "");
    if (searchString === "" && e.keyCode != 13){
        await searchPokemon();
        showPokemon();
    }
    if (e.keyCode != 13 || searchString === "")return;         // keycode => va traduire les touches du claviers en numerique et 13 = touche "ENTER"
    pokemon_list.innerHTML = "";
    fetch ("https://pokebuildapi.fr/api/v1/pokemon/"+searchString)
    .then (data => {
        if (data.ok){
            return data.json();
        }else if (data.status === 500){
            alert("Ce Pokémon n'existe pas. Veuillez rechercher un pokémon valide. Merci. bien cordialement, l'équipe de toute l'AFEC Dax. Joyeux Noel, Hanouka, joyeuse Thanks Giving, Pâques, St Valentin. Bon carnaval de RIO !!!")
        }
    })
    .then (json => {
        pokemons = [];
        pokemons.push(json);
        lastDisplay = 1;
        firstDisplay = 0;
        showPokemon();
    })
    .catch ((error) => console.error("Erreur lors du chargement du fichier JSON", error))
    
}
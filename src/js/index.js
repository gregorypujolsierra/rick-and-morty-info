const API_URL = 'https://rickandmortyapi.com/api/';
var temp_api_data;

/*** HOME ***/

var characters_data;
var current_page_index = 1;

function selectPage(event) {
    current_page_index = Number(event.target.id.replace('page-', ''));
    getPageData();
}

function getPageData() {
    getApiData('character/?page=', current_page_index);
    setTimeout(() => {
            characters_data = temp_api_data;
            getCharacterItems();
        },
        100
    );
}

function getApiData(url_complement, id) {
    fetch(API_URL + url_complement + id.toString())
        .then(response => response.json())
        .then(data => {
            temp_api_data = data;
        })
        .catch(error => {console.log((error))});
}

function getCharacterItems() {
    let characters = characters_data.results;
    let main_container = document.getElementById('allCharactersMainContainer');
    let old_container = document.getElementById('allCharactersContainer');
    let container = createNode('div');
    container.id = 'allCharactersContainer';
    characters.map(function (character) {
        let item = createNode('div'),
            image = createNode('img'),
            name = createNode('span');
        image.id = 'ch-' + character.id;
        image.onclick = () => selectCharacter(event);
        image.src = character.image;
        name.innerText = character.name;
        append(item, image);
        append(item, name);
        append(container, item);
    });
    main_container.replaceChild(container, old_container);
}

function createIndexButtons() {
    let total_pages = characters_data.info.pages;
    let current_page = current_page_index;
    const div = document.getElementById('pageIndexButtons');
    for (let i = 1; i <= total_pages; i++) {
        let button = createNode('button');
        button.id = 'page-' + (i < 10 ? '0' : '') + i;
        button.className = 'page-index' + (i === current_page ? ' current-page' : '');
        button.onclick = () => selectPage(event);
        button.innerText = i;
        append(div, button);
    }
}

function createNode(element) {
    return document.createElement(element);
}

function append(parent, element) {
    return parent.appendChild(element);
}

getPageData();
setTimeout(() => createIndexButtons(), 500);


/*** CHARACTER PAGE ***/

var selected_character = null;

function selectCharacter(event) {
    let id = Number(event.target.id.replace('ch-', ''));
    getApiData('character/', id);
    setTimeout(() => {
            selected_character = temp_api_data;
            getCharacterData();
        },
        100
    );
}

function getCharacterData() {
    let chr = selected_character;
    let main_container = document.getElementById('characterPage');
    let old_container = document.getElementById('characterCardContainer');
    let container = createNode('div');
    container.id = 'characterCardContainer';
    let card_header = createNode('div'),
        card_info = createNode('div'),
        image = createNode('img'),
        name = createNode('h2'),
        status = createNode('div'),
        specie = createNode('div'),
        gender = createNode('div'),
        origin = createNode('div'),
        location = createNode('div'),
        episodes = createNode('ul');
    image.src = chr.image;
    name.innerText = chr.name;
    status.innerText = 'STATUS: ' + chr.status;
    specie.innerText = 'SPECIE: ' + chr.species + (chr.type ? ', ' + chr.type : '');
    gender.innerText = 'GENDER: ' + chr.gender;
    origin.innerText = 'ORIGIN: ' + chr.origin.name;
    location.innerText = 'LAST LOCATION: ' + chr.location.name;
    episodes.innerText = 'EPISODES';
    chr.episode.map(link => {
        let li = createNode('li'),
            a = createNode('a');
        a.href = a.innerText = link;
        append(li, a);
        append(episodes, li);
    });
    append(card_header, image);
    append(card_header, name);
    append(card_info, status);
    append(card_info, specie);
    append(card_info, gender);
    append(card_info, origin);
    append(card_info, location);
    append(card_info, episodes);
    append(container, card_header);
    append(container, card_info);
    main_container.replaceChild(container, old_container);
}

const API_URL = 'https://rickandmortyapi.com/api/';

/*** HOME ***/

var characters_data;
var current_page_index = 1;

function selectPage(event) {
    current_page_index = getOnlyNumbers(event.target.id);
    getPageData();
}

function getPageData() {
    getApiData('character/?page=', current_page_index)
        .then(data => {
            characters_data = data;
        })
        .then(() => getCharacterItems())
        .catch(error => console.log(error));
    setTimeout(() => {
        },
        100
    );
}

function getApiData(url_complement, id) {
    return fetch(API_URL + url_complement + id.toString())
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => console.log(error));
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


/*** UTILITIES ***/

function createNode(element) {
    return document.createElement(element);
}

function append(parent, element) {
    return parent.appendChild(element);
}

function getOnlyNumbers(string) {
    const regex = /(\d+)/g;
    return string.match(regex);
}

getPageData();   // To init home
setTimeout(() => createIndexButtons(), 200);


/*** CHARACTER PAGE ***/

var selected_character = null;

function selectCharacter(event) {
    let id = getOnlyNumbers(event.target.id);
    getApiData('character/', id)
        .then(data => {
            selected_character = data;
        })
        .then(() => serveCharacterInfo())
        .catch(error => console.log(error));
    setTimeout(() => {
        },
        100
    );
}

function serveCharacterInfo() {
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
        episodes = createNode('div');
    image.src = chr.image;
    name.innerText = chr.name;
    status.innerText = 'STATUS: ' + chr.status;
    specie.innerText = 'SPECIE: ' + chr.species + (chr.type ? ', ' + chr.type : '');
    gender.innerText = 'GENDER: ' + chr.gender;
    origin.innerText = 'ORIGIN: ' + chr.origin.name;
    location.innerText = 'LAST LOCATION: ' + chr.location.name;
    episodes.innerText = 'EPISODES';
    chr.episode.map(function (link) {
        var li = createNode('li');
        let id = link.replace(API_URL + 'episode/', '');
        getApiData('episode/', id)
            .then(data => {
                li.innerText = data.name + ' (' + data.episode + ')';
                li.id = 'ep-' + data.id;
                li.onclick = () => selectEpisode(event);
                append(episodes, li);
            })
            .catch(error => console.log(error));
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

function getEpisodeData(link) {
    return fetch(link)
        .then(response => response.json())
        .then(data => {
            return data
        })
        .catch(error => {
            console.log((error))
        });
}


/*** EPISODE PAGE ***/

var selected_episode;

function selectEpisode(event) {
    let id = getOnlyNumbers(event.target.id);
    getApiData('episode/', id)
        .then(data => {
            selected_episode = data;
        })
        .then(() => serveEpisodeInfo())
        .catch(error => console.log(error));
}

function serveEpisodeInfo() {
    let ep = selected_episode;
    let main_container = document.getElementById('episodePage');
    let old_container = document.getElementById('episodeInfoContainer');
    let container = createNode('div');
    container.id = 'episodeInfoContainer';
    let name = createNode('h1'),
        ep_number = createNode('h2'),
        air_date = createNode('span'),
        characters = createNode('div');
    name.innerText = ep.name;
    ep_number.innerText = ep.episode;
    air_date.innerText = 'Aired on ' + ep.air_date;
    ep.characters.map(link => {
        var chr_image = createNode('img');
        let id = link.replace(API_URL + 'character/', '');
        getApiData('character/', id)
            .then(data => {
                chr_image.src = data.image;
                chr_image.id = 'ep-ch' + data.id;
                chr_image.onclick = () => selectCharacter(event);
                append(characters, chr_image);
            })
            .catch(error => console.log(error));
    });
    append(container, name);
    append(container, ep_number);
    append(container, air_date);
    append(container, characters);
    main_container.replaceChild(container, old_container);
}

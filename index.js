const API_URL = 'https://rickandmortyapi.com/api/';

/*** HOME ***/

var characters_data;
var total_pages;
var current_page_index = 1;

function selectPage(event) {
    let old_button = document.getElementById('page-' + current_page_index);
    old_button.className = old_button.className.replace(' current-page', '');
    current_page_index = Number(getOnlyNumbers(event.target.id));
    getPageData();
    let current_button = document.getElementById(event.target.id);
    current_button.className += ' current-page';
    let prev = document.getElementById('prevPage');
    prev.disabled = current_page_index === 1;
    let next = document.getElementById('nextPage');
    next.disabled = current_page_index === total_pages;
}

function getPageData() {
    getApiData('character/?page=', current_page_index)
        .then(data => {
            characters_data = data;
        })
        .then(() => getCharacterItems())
        .catch(error => console.log(error));
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
    total_pages = characters_data.info.pages;
    let current_page = current_page_index;
    const div = document.getElementById('pageIndexButtons');
    for (let i = 1; i <= total_pages; i++) {
        let button = createNode('button');
        button.id = 'page-' + i;
        button.className = 'page-index' + (i === current_page ? ' current-page' : '');
        button.onclick = () => selectPage(event);
        button.innerText = i;
        append(div, button);
    }
    prevNextPageButtons();
}

function prevNextPageButtons() {
    let prev = document.getElementById('prevPage');
    let next = document.getElementById('nextPage');
    prev.onclick = () => {goToPrevNextPage(false)};
    next.onclick = () => {goToPrevNextPage(true)};
}

function goToPrevNextPage(next) {
    let id = current_page_index,
        target = new Array('id'),
        event = new Array('target');
    next ? id += 1 : id -= 1;
    target.id = id;
    event.target = target;
    event.target.id = 'page-' + id.toString();
    selectPage(event);
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
}

function serveCharacterInfo() {
    let chr = selected_character;
    let main_container = document.getElementById('characterPage');
    let old_container = document.getElementById('characterContainer');
    let container = createNode('div');
    container.id = 'characterContainer';
    container.className = 'modal-container';
    let inner_container = createNode('div'),
        card_container = createNode('div'),
        card_header = createNode('div'),
        card_info = createNode('div'),
        image = createNode('img'),
        name = createNode('h2'),
        status = createNode('div'),
        specie = createNode('div'),
        gender = createNode('div'),
        origin = createNode('div'),
        location = createNode('div'),
        episodes = createNode('div'),
        close = createNode('button');
    inner_container.className = 'inner-container';
    card_container.className = 'card-container';
    card_header.className = 'card-header';
    card_info.className = 'card-info';
    image.src = chr.image;
    name.innerText = chr.name;
    name.className = 'character-name';
    status.className = specie.className = gender.className = origin.className = location.className = 'card-info-props';
    status.innerHTML = 'STATUS:' + '<span>' + chr.status + '</span>';
    specie.innerHTML = 'SPECIE:' + '<span>' + chr.species + (chr.type ? ', ' + chr.type : '') + '</span>';
    gender.innerHTML = 'GENDER:' + '<span>' + chr.gender + '</span>';
    origin.innerHTML = 'ORIGIN:' + '<span>' + chr.origin.name + '</span>';
    location.innerHTML = 'LAST LOCATION:' + '<span>' + chr.location.name + '</span>';
    episodes.className = 'episodes';
    episodes.innerHTML = '<h3>CHARACTER\'S EPISODES</h3>';
    chr.episode.map(function (link) {
        var li = createNode('li'),
            ep_name = createNode('span');
        let id = link.replace(API_URL + 'episode/', '');
        getApiData('episode/', id)
            .then(data => {
                ep_name.innerText = data.name;
                ep_name.id = 'ep-span-' + data.id;
                li.innerText = '(' + data.episode + ')';
                li.id = 'ep-' + data.id;
                li.onclick = () => {
                    closeModal(main_container);
                    selectEpisode(event);
                };
                append(li, ep_name);
                append(episodes, li);
            })
            .catch(error => console.log(error));
    });
    close.innerText = 'X';
    close.className = 'close-modal';
    close.onclick = () => {main_container.style.display = "none"};
    append(card_header, image);
    append(card_header, name);
    append(card_info, status);
    append(card_info, specie);
    append(card_info, gender);
    append(card_info, origin);
    append(card_info, location);
    append(card_container, card_header);
    append(card_container, card_info);
    append(inner_container, card_container);
    append(inner_container, episodes);
    append(container, inner_container);
    append(container, close);
    main_container.replaceChild(container, old_container);
    main_container.style.display = "flex";
    window.onclick = function(event) {
        if (event.target === main_container) {
            main_container.style.display = "none";
        }
    }
}

function closeModal(modal) {
    modal.style.display = "none"
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
    container.className = 'modal-container';
    let inner_container = createNode('div'),
        ep_info_container = createNode('div'),
        name = createNode('h2'),
        ep_number = createNode('h3'),
        air_date = createNode('span'),
        characters_container = createNode('div'),
        characters = createNode('div'),
        close = createNode('button');
    ep_info_container.className = 'ep-info-container';
    inner_container.className = 'inner-container flex-column';
    name.innerText = ep.name;
    ep_number.innerText = ep.episode;
    air_date.innerText = 'Aired on ' + ep.air_date;
    characters_container.id = 'episodeCharactersContainer';
    characters_container.innerHTML = '<h3>CHARACTERS APPEARING IN THIS EPISODE</h3>';
    characters.id = 'episodeCharacters';
    ep.characters.map(link => {
        var chr_container = createNode('div'),
            chr_image = createNode('img'),
            chr_name = createNode('span');
        let id = getOnlyNumbers(link);
        getApiData('character/', id)
            .then(data => {
                chr_image.src = data.image;
                chr_image.id = 'ep-ch' + data.id;
                chr_image.onclick = () => {
                    closeModal(main_container);
                    selectCharacter(event)
                };
                chr_name.innerText = data.name;
                append(chr_container, chr_image);
                append(chr_container, chr_name);
                append(characters, chr_container);
            })
            .catch(error => console.log(error));
    });
    close.innerText = 'X';
    close.className = 'close-modal';
    close.onclick = () => {main_container.style.display = "none"};
    append(ep_info_container, name);
    append(ep_info_container, ep_number);
    append(ep_info_container, air_date);
    append(inner_container, ep_info_container);
    append(characters_container, characters);
    append(inner_container, characters_container);
    append(container, inner_container);
    append(container, close);
    main_container.replaceChild(container, old_container);
    main_container.style.display = "flex";
    window.onclick = function(event) {
        if (event.target === main_container) {
            main_container.style.display = "none";
        }
    }
}

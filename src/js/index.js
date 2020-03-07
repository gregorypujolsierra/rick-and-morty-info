var character_data = {};
var current_page_index = 1;
const base_url = 'https://rickandmortyapi.com/api/';

function selectPage(event) {
    current_page_index = event.target.id;
    getPageData(event.target.id);
}

function getPageData(page_index) {
    const url_suf = 'character/?page=';
    fetch(base_url + url_suf + page_index.toString())
        .then(response => response.json())
        .then(data => {
            character_data = data;
            createCharacterItems();
        })
        .catch(error => {console.log((error))});
}

function createCharacterItems() {
    let characters = character_data.results;
    let main_container = document.getElementById('charactersMainContainer');
    let old_container = document.getElementById('charactersContainer');
    let container = createNode('div');
    container.id = 'charactersContainer';
    characters.map(function (character) {
        let item = createNode('div'),
            image = createNode('img'),
            name = createNode('span');
        image.src = character.image;
        name.innerHTML = character.name;
        append(item, image);
        append(item, name);
        append(container, item);
    });
    main_container.replaceChild(container, old_container);
}

function createIndexButtons() {
    let total_pages = character_data.info.pages;
    let current_page = current_page_index;
    const div = document.getElementById('pageIndexButtons');
    for (let i = 1; i <= total_pages; i++) {
        let button = createNode('button');
        button.id = i;
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

getPageData(current_page_index);
setTimeout(() => createIndexButtons(), 500);

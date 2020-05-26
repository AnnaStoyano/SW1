window.onload = function () {
    let heroes = this.document.querySelector('.heroes');
    creatElements(heroes);
    allHeroes(heroes);
    heroes.addEventListener('click', function (e) {
        let target = e.target;
        if (target.classList.contains('hero-name') || target.tagName === 'IMG') {
            let table = target.parentElement.lastElementChild;
            table.classList.toggle('visability');
        }
    })
}

async function loadHeroInfo(table, header, num) {
    let url = `https://swapi.dev/api/people/${num+1}/?format=json`;
    load(url)
        .then(hero => {
            ShowHeroHeaderInfo(header, hero);
            ShowHeroTableInfo(table, hero);
        })
}

function creatElements(conteiner) {
    for (let i = 0; i < 10; i++) {
        conteiner.insertAdjacentHTML('beforeend', `<div class="hero-item">
                <img src="img/${i+1}.png">
                <h3 class='hero-name'></h3>
                <table class="hero-info"></table>
                </div>`)
    }
}

function ShowHeroHeaderInfo(header, info) {
    header.innerHTML = info.name;
}

function ShowHeroTableInfo(table, info) {
    AddRow(info.name, table, 'Name');
    AddRow(info['birth_year'], table, 'Birth Year');
    AddRow(info.gender, table, 'Gender');
    AddRow(info.homeworld, table, 'Homeworld');
    AddRow(info.vehicles, table, 'Vehicles')
    AddRow(info.films, table, 'Films')
}

function AddRow(url, table, rowName) {
    let arr = [];
    if (!IsArray(url)) {
        if (url.indexOf('http') == -1) {
            table.insertAdjacentHTML("beforeend", `
        <tr class="table-row">
        <td class="row-item row-name">${rowName}</td>
        <td class="row-item row-value">${url}</td>
        </tr>`)
        } else {
            url = modifyUrl(url);
            load(url)
                .then(res => res.name).then(res => {
                    table.insertAdjacentHTML("beforeend", `
                    <tr class="table-row">
                    <td class="row-item row-name">${rowName}</td>
                    <td class="row-item row-value">${res}</td>
                    </tr>`)
                });
        }
    } else {
        for (let i = 0; i < url.length; i++) {
            url[i] = modifyUrl(url[i]);
            load(url[i])
                .then(res => {
                    let value = res.title ? res.title : res.name;
                    arr.push(value);
                    if (i == url.length - 1) {
                        table.insertAdjacentHTML("beforeend", `
                    <tr class="table-row"><td class="row-item row-name">${rowName}</td><td class="row-item row-value">${arr.join('<br>')}</td></tr>`);
                    }
                })
        }
    }
}


function IsArray(str) {
    return (str.constructor == Array);
}

function modifyUrl(url) {
    let arr = url.split("://");
    arr[0] = arr[0] + 's';
    str = arr.join("://");
    return str;
}

async function load(url) {
    let prom = fetch(url)
        .then(resolve => resolve.json())
        .then(item => item);
    return prom;
}

function allHeroes(conteiner) {
    let heroes = conteiner.children;
    for (let i = 0; i < conteiner.childElementCount; i++) {
        let table = heroes[i].lastElementChild;
        let header = heroes[i].children[1];
        let index = getIndex(i);
        loadHeroInfo(table, header, index);
    }
}

function getIndex(i) {
    let temp;
    if (i == 5) {
        temp = 7;
    } else if (i > 5 && i < 8) {
        temp = i + 3;
    } else if (i === 8) {
        temp = 13;
    } else {
        temp = i;
    }
    return temp;
}
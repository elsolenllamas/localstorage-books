let firstTime = true;

function watchEvents() {
    const favIcons = document.querySelectorAll('.fav-icon');
    const booksIcons = document.querySelectorAll('.link-author');
    if(favIcons) {
        for(i=0;i<favIcons.length; i++) {
            favIcons[i].addEventListener("click", checkFav);
        }
    }

    if(booksIcons) {
        for(i=0;i<booksIcons.length; i++) {
            booksIcons[i].addEventListener("click", getAuthorBooks);
        }
    }
    document.getElementById('favorites-list-container').style.display = 'block';
}

// get authors from API
function getBooks() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
            if (xmlhttp.status == 200) {
                const data = JSON.parse(xmlhttp.responseText);
                printAuthors(data, printKeys);
            }
           else if (xmlhttp.status == 400) {
                console.log('There was an error 400');
           }
           else {
                console.log('something else other than 200 was returned');
           }
        }
    };
    xmlhttp.open("GET", "http://openlibrary.org/subjects/science_fiction.json?details=true", true);
    xmlhttp.send();
}

function getAuthorBooks(event) {
    event.preventDefault();
    let query = event.target.innerText;
    console.log(query);
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
            if (xmlhttp.status == 200) {
                const data = JSON.parse(xmlhttp.responseText);
                console.log(data.docs);
            }
           else if (xmlhttp.status == 400) {
                console.log('There was an error 400');
           }
           else {
                console.log('something else other than 200 was returned');
           }
        }
    };
    xmlhttp.open("GET", "http://openlibrary.org/search.json?q="+ query, true);
    xmlhttp.send();
}


// function with closure
function printAuthors(data, callback) {
    const authors = data.authors;
    for(i=0;i<authors.length; i++) {
        const mainTag = document.getElementById("books");
        const namesItem = document.createElement("li");
        namesItem.className = "names";
        namesItem.innerHTML = '<span>' + authors[i].name + '</span>';
        mainTag.appendChild(namesItem);
    }
    callback(authors, printUsers);
}

// print stars in DOM
function printKeys(data, callback) {
    for(i=0;i<data.length; i++) {
        const authorLi = document.querySelectorAll('.names');
        for(i=0;i<authorLi.length; i++) {
            authorLi[i].insertAdjacentHTML('beforeend', '<i class="fa fa-star-o fav-icon" data-id='+ data[i].key +'></i>');
        }
    }
    watchEvents();
    callback(data);
    printFavorites();
}

function printUsers(data) { 
    for(i=0;i<data.length; i++) {
        const authorLi = document.querySelectorAll('.names');
        for(i=0;i<authorLi.length; i++) {
            authorLi[i].insertAdjacentHTML('afterBegin', '<i class="fa fa-user-o user-icon" data-author='+ data[i].key +'></i>');
        }
    }
}

// switch add/remove
function checkFav(event) {
    let favId = event.target.dataset.id;
    if (event.target.classList.contains('favorited')) {
        removeFav(event);
    } else {
        addFav(event);
    }
}

// add a favorite to localStorage
function addFav(event) {
    let favName = event.target.parentElement.innerText;
    let favId = event.target.dataset.id;
    event.target.classList.add('favorited');

    if (localStorage.favorites) {
        let favorites = JSON.parse(localStorage.getItem('favorites'));
        newauthor = {id:favId, name:favName};

        favorites.author.push(newauthor);
        let favtoadd = JSON.stringify(favorites);
        localStorage.setItem("favorites", favtoadd);
    } else {
        let favorites = { author:[]};
        newauthor = {id:favId, name:favName};

        favorites.author.push(newauthor);
        let favtoadd = JSON.stringify(favorites);
        localStorage.setItem("favorites", favtoadd);
    }
     printFavorites();
}

// utility function to find index to remove 
function findIndex(array, key, value) {
    for (let i = 0; i < array.length; i++) {
        if (array[i][key] == value) {
            return i;
        }
    }
    return null;
}

// remove a favorite from localStorage
function removeFav(event) {
    let favorites = JSON.parse(localStorage.getItem('favorites'));
    let favId = event.target.dataset.id;
    event.target.classList.remove('favorited');
    let index = findIndex(favorites.author, "id", favId);
    favorites.author.splice(index,1);
    let favtoadd = JSON.stringify(favorites);
    localStorage.setItem("favorites", favtoadd);
    printFavorites();
}

// print list of authors favorited and stars
function printFavorites() {
    let currentFavorites = JSON.parse(localStorage.getItem('favorites'));
    const allIcons = document.querySelectorAll('.fav-icon');
    if(!firstTime) {
        document.getElementById('favorites-list').innerHTML = '';
    }
    if(currentFavorites) {
        for (let i = 0; i < currentFavorites.author.length; i++) {
            for (let j = 0; j < allIcons.length; j++) {
                let authorKey = allIcons[j].dataset.id;
                if(currentFavorites.author[i].id === authorKey) {
                    document.querySelectorAll('[data-id=' + CSS.escape(authorKey) + ']')[0].classList.add('favorited');
                }
            }
            const favoritedAuthor = document.createElement("span");
            favoritedAuthor.className = "names";
            favoritedAuthor.innerHTML = '<a href="#" class="link-author">' + currentFavorites.author[i].name + '</a>';
            document.getElementById('favorites-list').appendChild(favoritedAuthor);
            firstTime = false;
        }
    }
    watchEvents();
}

document.addEventListener('DOMContentLoaded', function() {
    getBooks();
}, false);

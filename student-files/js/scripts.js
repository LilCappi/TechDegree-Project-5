const randomUserUrl = 'https://randomuser.me/api/?results=12';

function fetchData(url) {
    return fetch(url)
            .then (res => res.json())
            .catch(error => console.log('Something went wrong fetching data.', error))
}

async function displayUsers() {
    const userData = await fetchData(randomUserUrl);
    console.log(userData);
    showUsers(userData.results);
}

function showUsers(array) {
    array.forEach(element => {
        const elementHTML = `
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${element.picture.large}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${element.name.first} ${element.name.last}</h3>
                    <p class="card-text">${element.email}</p>
                    <p class="card-text cap">${element.location.city}, ${element.location.state}</p>
                </div>
            </div>
        `;
        document.querySelector('.gallery').insertAdjacentHTML('beforeend', elementHTML);
    });
}

displayUsers();
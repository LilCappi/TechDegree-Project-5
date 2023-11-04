const container = document.querySelector('.gallery');

const randomUserUrl = 'https://randomuser.me/api/?results=12';
let users = [];

async function getUsers(url) {
    const response = await fetch(url);
    const userData = await response.json();
    users = userData.results
    displayUsers(users);
}

function displayUsers(array) {
    const arrayElements = array.map((element) => `
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
        `)
    .join('');
    container.insertAdjacentHTML('beforeend', arrayElements);
};

container.addEventListener('click', (e) => {
    const selectedDiv = e.target.closest('.card-info-container');
    if (!selectedDiv) return;

    const userDataset = selectedDiv.dataset.name;
    console.log(userDataset);
})

getUsers(randomUserUrl);
const searchContainer = document.querySelector('.search-container')
const container = document.querySelector('.gallery');
const body = document.querySelector('body');                                                // Variables to store manipulated elements
const randomUserUrl = 'https://randomuser.me/api/?results=12&nat=us';

let currentUserIndex;
let totalUsers = [];                                                                        // Variables to store manipulated user data
let searchedUsers;

async function getUsers(url) {                                                              // An async function that request information from the 'random User'
    createSearchBar();                                                                      // API and then displays the fetched data to the browser
    const response = await fetch(url);                                                      //
    const userData = await response.json();                                                 // The function also creates and appends a search bar to the DOM 
    totalUsers = userData.results                                                           // so the array of 'users' can be searched through    
    searchedUsers = totalUsers;
    displayUsers(totalUsers);
}

function searchForUsers(input, array) {                                                     // A function that filters through the array of 'totalUsers'
    const matchingUsers = array.filter(user => {                                            // and displays those users    
        const usersName = `${user.name.first} ${user.name.last}`.toLowerCase();             //
        return usersName.includes(input.toLowerCase());                                     // If there are no 'users' that match the search criteria,        
    });                                                                                     // display 'No Users Found' message on the page
    searchedUsers = matchingUsers;
    if (matchingUsers.length === 0) {
        container.innerHTML = '';
        container.innerHTML = `<h3>No Users Found</h3>`
    } else {
        container.innerHTML = '';
        displayUsers(matchingUsers);
    }
}

function createSearchBar() {                                                                          // A function that creates the search bar form and appends it to the page
    const searchBarHTML = `                                                                               
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
    `;
    searchContainer.insertAdjacentHTML('beforeend', searchBarHTML);

    const searchInput = document.querySelector('.search-input');

    searchInput.addEventListener('keyup', () => {                                             // Event listener that takes in the input from the search bar and envokes 
        const inputValue = searchInput.value.toLowerCase();                                   // 'searchForUsers' function and runs that what is returned through                                                             // 'displayUsers' function
        searchForUsers(inputValue, totalUsers);
    })

    searchInput.addEventListener('search', () => {                                            // Event listener that displays all 'users' again when the search bar is cleared
        container.innerHTML = '';
        displayUsers(totalUsers);
    })
}

function displayUsers(array) {                                                                              // A function that creates and appends a new 'div' for each
    array.forEach(element => {                                                                              // 'users' in an array
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
        container.insertAdjacentHTML('beforeend',elementHTML);
    })
};

function formatBirthday(date) {                                                                 // A function that formats 'user' birthday information for better display
    const bDay = date.slice(0, 10).split('-');
    return `${bDay[1]}/${bDay[2]}/${bDay[0]}`
}

function displayUserModal(user) {                                                                               // A function that displays a modal of a selected 'user'
    const modalHTML = `    
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="modal-text">${user.email}</p>
                <p class="modal-text cap">${user.location.city}</p>
                <hr>
                <p class="modal-text">${user.cell}</p>
                <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
                <p class="modal-text">Birthday: ${formatBirthday(user.dob.date)}</p>
            </div>
        </div>

         <div class="modal-btn-container">
             <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
             <button type="button" id="modal-next" class="modal-next btn">Next</button>
         </div>
    </div>
    `;

    body.insertAdjacentHTML('afterbegin', modalHTML);                                           // Appends the new modal to the DOM
    const overlay = document.querySelector('.modal-container');
    overlay.classList.add('open');

    const modalPrevButton = document.querySelector('#modal-prev');  
    const modalNextButton = document.querySelector('#modal-next');                              // Variables to store manipulated modal elements
    const modalCloseButton = document.querySelector('#modal-close-btn');

    if (searchedUsers.length === 1) {                                                           // Checks to see how many 'users' within the 'searchedUsers' array
        document.querySelector('.modal-btn-container').remove();                                // or what the 'users' index compared to 'searchedUsers' array length
    } else if (currentUserIndex === 0) {                                                        // to determine 'prev' and 'next' button manipulation
        modalPrevButton.remove();
    } else if ((currentUserIndex + 1) === searchedUsers.length) {
        modalNextButton.remove();
    }

    modalCloseButton.addEventListener('click', () => {                                          // Removes the modal if the 'exit' button is clicked
        overlay.remove();
    })

    window.addEventListener('keydown', (event) => {                                             // Removes the modal if the 'escape' key is pressed
        if (event.key === 'Escape') {
            overlay.remove();
        }
    })

    modalPrevButton.addEventListener('click', () => {                                           // Removes the current modal from view and displays a
        if (currentUserIndex > 0) {                                                             // modal for the previous 'user' on the page
            currentUserIndex--;
            const prevUser = searchedUsers[currentUserIndex];
            overlay.remove();
            displayUserModal(prevUser);
        }
    })
    modalNextButton.addEventListener('click', () => {                                           // Removes the current modal from view and displays a
        if (currentUserIndex < (searchedUsers.length - 1)) {                                    // modal for the next 'user' on the page
            currentUserIndex++;
            const nextUser = searchedUsers[currentUserIndex];
            overlay.remove();
            displayUserModal(nextUser);
        }
    })
}

container.addEventListener('click', (event) => {                                                // An event listener that listens for clicks on a users div and searches 
    const selectedDiv = event.target.closest('.card');                                          // for the user that matches and displays a modal for the selected user        
    if (!selectedDiv) return;

    const userDataset = selectedDiv.querySelector('#name').innerText;

    currentUserIndex = searchedUsers.findIndex(
        (user) => (user.name.first + ' ' + user.name.last) === userDataset
    );

    displayUserModal(searchedUsers[currentUserIndex]);
})

getUsers(randomUserUrl);
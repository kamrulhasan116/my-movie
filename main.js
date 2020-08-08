// Film Class
class Film {
    constructor(title, releaseDate,typeOfMovie){
        this.title = title;
        this.releaseDate = releaseDate;
        this.typeOfMovie = typeOfMovie;
    }
}

// UI Class - Handle UI Tasks
class UI {
    static displayFilms(){
        const films = Store.getFilms();

        films.forEach((film) => UI.addFilmToList(film));
    }

    static addFilmToList(film){
        //Find Film list and create new row element
        const list = document.querySelector('#film-list');
        const row = document.createElement('tr');
        // Add Class name for search results
        row.className = 'film-entry';
        //Add Inner HTML with film title, release date and delete button with appropiate classes
        row.innerHTML = `
            <td>${film.title}</td>
            <td>${film.releaseDate}</td>
            <td>${film.typeOfMovie}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        //Add new Element to list
        list.appendChild(row);
    }

    static deleteFilm(target){
        if(target.classList.contains('delete')){
            target.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        //Add Bootstrap Error or Success Alert Class
        div.className = `alert alert-${className}`;
        //Add Message
        div.appendChild(document.createTextNode(message));

        //Get Parent
        const container = document.querySelector('.container');
        //Get element to insert alert before
        const form = document.querySelector('#film-form');
        //Insert Div in Container Parent and before Form Element
        container.insertBefore(div, form);
        // Remove Alert after Delay
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields(){
        //Clear input fields
        document.querySelector('#title').value = '';
        document.querySelector('#release-date').value = '';
        document.querySelector('#type-movie').value = '';
    }

}

// Store Class - Handles Local Data Storage
class Store {
    static getFilms(){
        let films;
        //If no items in local storage under films key, return empty array
        if(localStorage.getItem('films') === null){
            films = [];
        } else {
            //Parse Stringified array of films
            films = JSON.parse(localStorage.getItem('films'));
        }
        return films;
    }

    static addFilm(film){
        // Get Current Films list
        const films = Store.getFilms();
        // Push new Film onto Array of Films
        films.push(film);
        // Stringify Films array and set to Local Storage
        localStorage.setItem('films', JSON.stringify(films));
    }

    static removeFilm(filmTitle){
        // Get Current Films list
        const films = Store.getFilms();

        //Loop through films, if film title matches that passes, remove that element using index
        films.forEach((film, index) => {
            if(film.title === filmTitle){
                films.splice(index, 1);
            }
        });
        //Reset dataset in local storage
        localStorage.setItem('films', JSON.stringify(films));
    }
}

// Event - Display Films
document.addEventListener('DOMContentLoaded', UI.displayFilms);

// Event - Add Film
document.querySelector('#film-form').addEventListener('submit', (e)=> {
    //Prevent Default Submit Action
    e.preventDefault();

    //Get value from Form Inputs
    const title = document.querySelector('#title').value;
    const releaseDate = document.querySelector('#release-date').value;
    const typeOfMovie = document.querySelector('#type-movie').value;

    //Validation
    if(title === '' || releaseDate === '' || typeOfMovie === ''){
        UI.showAlert('Please Complete all Fields', 'danger');
    } else {
        //Instantiate new form object with input data
        const film = new Film(title, releaseDate,typeOfMovie);

        //Show success Alert
        UI.showAlert('Film Added', 'success');

        //Add Book to Local Storage
        Store.addFilm(film);

        //Add new film
        UI.addFilmToList(film);

        //Clear Field
        UI.clearFields();
    }

});


// Event - Remove Film
        document.querySelector('#film-list').addEventListener('click', (e)=> {
            //Remove from UI
            UI.deleteFilm(e.target);

            //Remove from Local Storage
            Store.removeFilm(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);


            UI.showAlert('Book Removed', 'success');
        });

//Film List Search
const filmSearchInput = document.querySelector('#filmSearchInput');

filmSearchInput.addEventListener('keyup', ()=> {
    //Get input value
    let searchedValue = document.querySelector('#filmSearchInput').value.toUpperCase();
    //Get Table
    let table = document.querySelector('#film-list-table');
    //Get all Film Entries Elements
    let tr = document.getElementsByClassName('film-entry');

    //Loop through film entries in table
    for(i = 0; i < tr.length; i++){
        //Get Film name
        let filmName = tr[i].getElementsByTagName('td')[0].textContent;
        //Returns index of which letters can be found in the film name, if -1, searched value cannot be found
        if(filmName.toUpperCase().indexOf(searchedValue) > -1){
            // Remove Styling - Show Element
            tr[i].style.display = "";
        } else {
            // Display none - hide element
            tr[i].style.display = "none";
        }
    };
});
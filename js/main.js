const app = {
    searchQuery: null,
    actorID: null,
    movieID: null,
    baseURL: null,
    pages: [],
    active: null,
    init: () => {
        console.log("the script is loaded");
        document.getElementById('btn').addEventListener('click',app.search);
    },
    search: ev => {
        //stop the form being submitted
        ev.preventDefault();

        app.searchQuery = document.getElementById('actor').value;
        console.log(app.searchQuery);
        let p = document.createElement('p');
        p.textContent = app.searchQuery;
        document.querySelector('main').appendChild(p);

        //old way to reset form
        // document.forms[0].reset();
        document.querySelector('form').reset();
    }
}
document.addEventListener('DOMContentLoaded', app.init);
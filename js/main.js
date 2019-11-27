const app = {
    searchQuery: null,
    actorID: null,
    movieID: null,
    baseURL: null,
    pages: [],
    active: null,

    //the api key for my account on TMDB
    apiKey: '89c8c4c56a53dd80baf99fc3b4c4a86c',

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
        p.textContent = "You Searched: " + app.searchQuery;
        document.querySelector('main').appendChild(p);

        //old way to reset form
        // document.forms[0].reset();
        document.querySelector('form').reset();


        //how to get a /search/person
        url = `https://api.themoviedb.org/3/search/person?api_key=${app.apiKey}&query=${app.searchQuery}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {

                //how to display all the actors with a name match
                data.results.forEach(actor => {
                    let d = document.createElement('p');
                    d.textContent = actor.name;
                    document.querySelector('main').appendChild(d);
                })

                //now to display the movie results for the first actor returned (for testing)
                //first check if data.results is not null
                
                if(data.results[0]){
                    data.results[0].known_for.forEach(movie => {
                        let testMovies = document.createElement('p');
                        testMovies.textContent = movie.id + " " + movie.original_title;
                        document.querySelector('main').appendChild(testMovies);
                    })
                }
                
            })
            .catch(err => {
                console.log(err.message);
            })
    }
}
document.addEventListener('DOMContentLoaded', app.init);
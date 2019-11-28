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
        let url = `https://api.themoviedb.org/3/search/person?api_key=${app.apiKey}&query=${app.searchQuery}`;
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
                        //create the element holding the movie results
                        let testMovies = document.createElement('p');
                        testMovies.textContent = movie.id + " " + movie.original_title;
                        testMovies.setAttribute("data-movieid", movie.id);
                        document.querySelector('main').appendChild(testMovies);
                    })
                    app.movieID = data.results[0].known_for[0].id;
                }

                //now to see if i can handle the next fetch call
                //movie url is the 
                let movieUrl = `https://api.themoviedb.org/3/movie/${app.movieID}?api_key=${app.apiKey}`
                let castURL = `https://api.themoviedb.org/3/movie/${app.movieID}/credits?api_key=${app.apiKey}`

                let requests = [fetch(movieUrl), fetch(castURL)];

                //now to do the promise for both urls:

                Promise.all(requests)
                    .then(responses => {
                        return [responses[0].json(), responses[1].json()];
                    })
                    .then(details => {
                        console.log(details[0]);
                    })
                    .catch(err => {
                        console.log(err.message);
                    })

                        
                        
                    })
                    .catch(err => {
                        console.log(err.message);
                    })
    }
}
document.addEventListener('DOMContentLoaded', app.init);
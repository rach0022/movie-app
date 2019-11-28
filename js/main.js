const app = {
    searchQuery: null,
    actorData: [],
    movieID: null,
    baseURL: null,
    imageBaseURL: "https://image.tmdb.org/t/p/",
    pages: [],
    active: null,

    //the api key for my account on TMDB
    apiKey: '89c8c4c56a53dd80baf99fc3b4c4a86c',

    init: () => {
        console.log("the script is loaded");
        document.getElementById('btn').addEventListener('click',app.search);
    },
    //build a title in html for the page, 
    //pass in title which is the text content
    //and pass in parent referecen where you want the title appeneded too
    buildTitle: (title, parent) => {
        let p = document.createElement('h3');
        p.textContent = title;
        parent.appendChild(p);
    },

    //build an img element with only a movie object from TMDB being given
    buildTMDBImage: (movie, size, parent) => {
        //set the width property of the image src query
        let width = `w${size}/`;
        
        let poster = document.createElement('img');
        poster.title = movie.tagline;
        poster.alt = movie.tagline;
        poster.src = app.imageBaseURL + width + movie.poster_path;
        parent.appendChild(poster);
    },
    buildActorPage: ev => {
        //this is where we build the actor data for page 3
        //this will show the actors name plus a list of movies they are known for

        //first stop the form from submitting accidentally
        ev.preventDefault();
        ev.stopPropagation();

        //build the title for this page
        app.buildTitle(ev.target.textContent, document.querySelector('main'));
        //now to display the movie results for the first actor returned (for testing)
        //go through each moevie in the actors corresponding knownfor arrray
        //use the data-actornum from the ev.target
        app.actorData[ev.target.getAttribute("data-actornum")].forEach(movie => {
            //create the element holding the movie results
            let testMovies = document.createElement('p');
            testMovies.textContent = movie.id + " " + movie.original_title;
            testMovies.setAttribute("data-movieid", movie.id);

            //add a click listener to test if movies can generate movie & cast data
            testMovies.addEventListener('click', app.buildMoviePage);
            document.querySelector('main').appendChild(testMovies);
        })
    },
    //build a function to process the movie data from the double fetch promise all call
    processMovies: moviePromise => {
        moviePromise.then(data => {

            //cehck if it is cast data or movie data
            if(data.cast){
                //this is where we build the cast data for page 4
                //set a title to show the cast
                app.buildTitle("Cast Members:", document.querySelector('main'));
                //if it is cast data loop through each cast member and build a name
                data.cast.forEach(member => {
                    let p = document.createElement('p');
                    p.textContent = `Actor: ${member.name} | Character in movie: ${member.character}`;
                    document.querySelector('main').appendChild(p);
                })
                console.log("cast data:", data.cast);
                

                // data.cast.forea 
            } else {
                //this is where we build the movie data for the page 4
                console.log("movie data", data);

                //create the title for the page
                app.buildTitle(`Released: ${data.release_date} Title: ${data.title}`, document.querySelector('main'));
                app.buildTMDBImage(data, 200, document.querySelector('main'));
                

            }
            
        })
    },

    //call this function when you need to build teh movie page and also cast details for that movie
    buildMoviePage: ev => {
        ev.preventDefault();
        ev.stopPropagation();
        //now to see if i can handle the next fetch call
        //movie url is the
        app.movieID = ev.target.getAttribute("data-movieid");
        let movieUrl = fetch(`https://api.themoviedb.org/3/movie/${app.movieID}?api_key=${app.apiKey}`);
        let castURL = fetch(`https://api.themoviedb.org/3/movie/${app.movieID}/credits?api_key=${app.apiKey}`);

        let requests = [movieUrl, castURL];

        //now to do the promise for both urls:
        //reroute to processMovies call back to make sure promises are done pending
        Promise.all(requests)
            .then(movies => {
                
                //taken from steve promise all fetch video
                movies.forEach(movie => {
                    app.processMovies(movie.json());
                })
            })
            .catch(err => {
                console.log(err.message);
            })
    },
    search: ev => {
        //stop the form being submitted
        ev.preventDefault();
        ev.stopPropagation();

        app.searchQuery = document.getElementById('actor').value;
        console.log(app.searchQuery);

        app.buildTitle("You Searched: " + app.searchQuery, document.querySelector('main'));

        //old way to reset form
        // document.forms[0].reset();
        document.querySelector('form').reset();

        //if there is a search query
        if(app.searchQuery){

            //how to get a /search/person
            let url = `https://api.themoviedb.org/3/search/person?api_key=${app.apiKey}&query=${app.searchQuery}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {

                    //how to display all the actors with a name match
                    data.results.forEach(actor => {
                        let d = document.createElement('p');
                        d.textContent = actor.name;

                        //push the movies known for each actor onto the actor movie data arry
                        //and then set a data-actor to the index location of the corresponding known for
                        //data in the app.actorData array to call it later in build movies.
                        app.actorData.push(actor.known_for);
                        d.setAttribute("data-actornum",app.actorData.length-1 );
                        d.addEventListener('click', app.buildActorPage);
                        document.querySelector('main').appendChild(d);
                    })
                })
                .catch(err => {
                    console.log(err.message);
                })
            }
        }
    }
document.addEventListener('DOMContentLoaded', app.init);
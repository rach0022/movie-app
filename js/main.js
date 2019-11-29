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

        //set the default active page to the searchpage
        app.active = document.getElementById('searchpage');

        //set up the app.pages with each "page" (corresponding div element)
        app.updatePages();

        //add the event listener to the back button
        document.getElementById('backbutton').addEventListener('click', app.backButton);

        //add the event listener to the search button
        document.getElementById('search').addEventListener('click', app.search);
    },

    //remove all child elements from a parent element
    //will be used to reset individual pages for app
    removeElements: parent => {
        //while the parent nodes has a child node
        //keep looking until there are no children
        if(parent.firstChild){
            while(parent.firstChild){
                parent.removeChild(parent.firstChild);
            }
        }
    },
    //build a title in html for the page, 
    //pass in title which is the text content
    //and pass in parent referecen where you want the title appeneded too
    buildTitle: (title, parent) => {
        let p = document.createElement('h3');
        p.textContent = title;
        parent.appendChild(p);
    },
    //build an html element based on what is specified
    //set textcontent to the text specififed and 
    //make the parent to apeend to the parent
    buildElement: (text, element, parent) => {
        let p = document.createElement(`${element}`);
        p.textContent = text;
        parent.appendChild(p);
    },
    //build an img element with only a movie object from TMDB being given
    buildMovieImage: (movie, size, parent) => {
        //set the width property of the image src query
        let width = `w${size}/`;
        
        let poster = document.createElement('img');
        poster.title = movie.tagline;
        poster.alt = movie.tagline;
        if(movie.poster_path){
            poster.src = app.imageBaseURL + width + movie.poster_path;
        } else {
            poster.src = "images/noMoviePoster.png";
        }
        parent.appendChild(poster);
    },

    buildActorImage: (actor, size, parent) => {

        // set the width propery of the image src query:
        let width = `w${size}`;

        //create the html img element and set the correspoding attirbutes to values
        //from actor
        let poster = document.createElement('img');
        poster.title = actor.name;
        poster.alt = actor.name;
        if(actor.profile_path){
            poster.src = app.imageBaseURL + width + actor.profile_path;
        } else {
            poster.src = "images/noProfile.jpg";
        }
        

        //append the image to the parent specified
        parent.appendChild(poster);

    },
    //added method to change page
    //the current page will be flipped from active
    //the new page will be flipped into active
    changePage: newPage=>{
        //swtich the active class onthe active page 
        app.active.classList.toggle('active');

        //change the app.active into the new page and toggle the active class on said page
        app.active = newPage;
        newPage.classList.toggle('active');

        //now make it so that the window view will go back 
        //to the top of the page so the user doesnt have to scroll each time
        //use the window.scrollTo method with options to define it as smooth
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    },
    buildActorPage: ev => {
        //this is where we build the actor data for page 3
        //this will show the actors name plus a list of movies they are known for

        //first stop the form from submitting accidentally
        ev.preventDefault();
        ev.stopPropagation();

        //first get a reference to the proper output div and remove all children within it
        let output = document.getElementById('actordetails');
        app.removeElements(output);

        //change the current page and the properties in the app
        app.changePage(output);

        //build the title for this page
        app.buildTitle("Movies by: " + ev.target.parentNode.getAttribute("data-actorname"), output);

        //build the poster image for the actor:
        console.log(ev.target.parentNode.getAttribute("data-actornum"));
        app.buildActorImage(app.actorData[ev.target.parentNode.getAttribute("data-actornum")], 300, output);

        //now to display the movie results for the first actor returned (for testing)
        //go through each moevie in the actors corresponding knownfor arrray
        //use the data-actornum from the ev.target
        app.actorData[ev.target.parentNode.getAttribute("data-actornum")].known_for.forEach(movie => {
            //now create a movie div to add the movies too
            let movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');
            
            //create the element holding the movie results
            let testMovies = document.createElement('p');
            testMovies.textContent = movie.id + " " + movie.original_title;
            movieDiv.setAttribute("data-movieid", movie.id);

            //add a click listener to test if movies can generate movie & cast data
            movieDiv.addEventListener('click', app.buildMoviePage);
            movieDiv.appendChild(testMovies);
            app.buildMovieImage(movie, 200, movieDiv);
            output.appendChild(movieDiv);
        })
    },
    //build a function to process the movie data from the double fetch promise all call
    processMovies: moviePromise => {

        //first set the output to the proper div
        //and remove any elemnts from this div
        let output = document.getElementById('movieresults');

        

        moviePromise.then(data => {

            //cehck if it is cast data or movie data
            //also check if the data.cast is null and remove all elements
            //incase the cast data is remaining for another movie
            if(data.cast){
                //first set the proper output and clear whatever is there
                output = document.getElementById('cast');
                app.removeElements(output);
                //this is where we build the cast data for page 4
                //set a title to show the cast
                app.buildTitle("Cast Members:", output);
                //if it is cast data loop through each cast member and build a name
                data.cast.forEach(member => {
                    //build an img for each cast member and show the actors name and character
                    app.buildActorImage(member, 200, output);
                    app.buildElement(`Cast #${member.cast_id} ${member.name} | Character in movie: ${member.character}`, 'p', output);

                });
                console.log("cast data:", data.cast);
                

                // data.cast.forea 
            } else {
                //first set the proper output  of movie details and clear whatever is there
                output = document.getElementById('moviedetails');
                app.removeElements(output);


                //this is where we build the movie data for the page 4
                console.log("movie data", data);

                //create the title for the page
                app.buildTitle(`Released: ${data.release_date} Title: ${data.title}`, output);

                //get all the genres and display them under the movie
                let genreText = document.createElement('p');
                genreText.textContent = "Genres: ";
                if(data.genres){
                    data.genres.forEach(genre =>{
                        genreText.textContent += genre.name + " ";
                    });
                    output.appendChild(genreText);
                } else {
                    genreText += "Not Found";
                    //since genre is underfined, remove the cast from the page
                    output = document.getElementById('cast');
                    app.removeElements(output);
                    app.buildTitle("Cast Members:\nUndefined", output);
                }
                app.buildMovieImage(data, 200, output);
            }

            
        })
        .catch(err =>{
            console.log("error occured:",err.message);

        })
        //change the active page style and set the active page in the app
        app.changePage(output);
    },

    //call this function when you need to build teh movie page and also cast details for that movie
    buildMoviePage: ev => {
        //first make sure the default events dont happen
        ev.preventDefault();
        ev.stopPropagation();

        //now to see if i can handle the next fetch call
        //movie url is the
        app.movieID = ev.target.parentNode.getAttribute("data-movieid");
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

        //first get a reference to the proper output div
        //and then remove all the children from the div
        //and then switch the reference of the current page
        let output = document.getElementById('searchresults');
        app.changePage(output);
        app.removeElements(output);

        //switch the active page to the output div
        app.active = output;

        app.searchQuery = document.getElementById('actor').value;
        console.log("You searched:",app.searchQuery);

        app.buildTitle("You Searched: " + app.searchQuery, output);

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
                        let actorDiv = document.createElement('div');
                        actorDiv.classList.add('actor');

                        app.buildActorImage(actor, 200, actorDiv);
                        let d = document.createElement('p');
                        d.textContent = actor.name;

                        //push the movies known for each actor onto the actor movie data arry
                        //and then set a data-actor to the index location of the corresponding known for
                        //data in the app.actorData array to call it later in build movies.
                        app.actorData.push(actor);
                        actorDiv.setAttribute("data-actornum",app.actorData.length-1 );
                        actorDiv.setAttribute("data-actorname", actor.name);
                        actorDiv.addEventListener('click', app.buildActorPage);
                        actorDiv.appendChild(d);
                        output.appendChild(actorDiv);
                    })
                })
                .catch(err => {
                    console.log(err.message);
                });
        }
    },
    backButton: ev => {
        //stop any default acations from the button occuring:
        ev.preventDefault();
        ev.stopPropagation();

        //update the pages for app.pages:
        app.updatePages();

        switch(app.active){
            case app.pages[0]:
                // the do nothing statement for the back button 
                break;
            case app.pages[1]:
                app.changePage(document.getElementById('searchpage'));
                break;
            case app.pages[2]:
                    app.changePage(document.getElementById('searchresults'));
                break;
            case app.pages[3]:
                app.changePage(document.getElementById('actordetails'));
                break;
        }
    },
    updatePages: () => {
        //set up the app.pages with each "page" (corresponding div element)
        app.pages.push(document.getElementById('searchpage')); //element 0
        app.pages.push(document.getElementById('searchresults')); //element 1
        app.pages.push(document.getElementById('actordetails')); //element 2
        app.pages.push(document.getElementById('movieresults')); //element 3
    }
}
document.addEventListener('DOMContentLoaded', app.init);

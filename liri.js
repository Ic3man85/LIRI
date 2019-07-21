require("dotenv").config();
let keys = require("./keys.js");
let request = require("request")
let Spotify = require("node-spotify-api")
let spotify = new Spotify(keys.spotify);
let axios = require("axios");
let moment = require('moment');
let fs = require("fs");


let command = process.argv[2];
let input = "";
let nodeArgs = process.argv;
for (let i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        input = input + "%20" + nodeArgs[i];
    } else {
        input += nodeArgs[i];
    }
}
let randomFunction = function(command, input) {
    switch (command) {
        case "concert-this":
            concertInfo(input);
            break;
        case "spotify-this-song":
            songInfo(input);
            break;
        case "movie-this":
            if (!input) {
                input = "Mr. Nobody"
                movieInfo(input);
            } else {
                movieInfo(input);
            }
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("Liri doesnt know that!");
    }
};

function concertInfo(input) {
    axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
        .then(function(response) {
            // console.log(response.data);
            for (let i = 0; i < response.data.length; i++) {
                console.log("-----" + input + "-----")
                console.log("Venue Name: " + response.data[i].venue.name);
                console.log("Location: " + response.data[i].venue.city + ", " +
                    response.data[i].venue.region + " " + response.data[i].venue.country);
                console.log("Date-Time: " + moment(response.data[i].datetime).format("MM/DD/YYYY-hh:mm"));
                console.log("------------------\n")
            }
        })
        .catch(function(error) {
            if (error) {
                console.log(error);
            }
        });
}

function songInfo(input, spotify) {
    spotify
        .search({ type: 'track', query: input })
        .then(function(response) {
            console.log(response);
        })
        .catch(function(err) {
            console.log(err);
        });
}

function movieInfo(input) {
    axios.get("http://www.omdbapi.com/?t=" + input + "&y=&plot=full&tomatoes=true&apikey=trilogy")
        .then(function(response) {
            console.log(response);
            let movie = response.data;
            console.log("Title: " + movie.Title);
            console.log("---------------------------------")
            console.log("Year released: " + movie.Released);
            console.log("IMDB rating: " + movie.imdbRating);
            console.log("Rotten Tomatoes ratiing: " + movie.Ratings[1].Value);
            console.log("Country: " + movie.Country);
            console.log("Language: " + movie.Language);
            console.log("---------------------------------")
            console.log("Plot: " + movie.Plot);
            console.log("---------------------------------")
            console.log("Actors: " + movie.Actors);

        }).catch(function(error) {
            if (error) {
                console.log(error);
            }
        });
}

function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);

        let random = data.split(", ");
        if (random.length === 2) {
            randomFunction(random[0], random[1]);
        } else if (random.length === 1) {
            randomFunction(random[0]);
        }
    })
}

let runFunction = function(one, two) {
    randomFunction(one, two);
}

runFunction(command, input);
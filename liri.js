require("dotenv").config();
let keys = require("./keys.js");
let Spotify = require("node-spotify-api")
let spotify = new Spotify(keys.spotify);
let axios = require("axios");
let moment = require('moment');
let fs = require("fs");


let command = process.argv[2];
let input = process.argv.slice(3).join(" ");
let song = "";
let nodeArgs = process.argv;
for (let i = 3; i < nodeArgs.length; i++) {
    if (i => 3 && i < nodeArgs.length) {
        song = song + "%20" + nodeArgs[i];
    } else {
        song += nodeArgs[i];
    }
}
switch (command) {
    case "concert-this":
        concertInfo(input);
        break;
    case "spotify-this-song":
        if (!input) {
            input = "The Sign";
            songInfo(input, spotify);
        } else {
            songInfo(input, spotify);
        }
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
        doWhatItSays(input);
        break;
    default:
        console.log("Liri doesnt know that!");
}

function concertInfo(input) {
    axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
        .then(function(response) {
            // console.log(response.data);
            for (let i = 0; i < response.data.length; i++) {
                console.log("-----UPCOMING CONCERTS------")
                console.log("Name: " + input)
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
    spotify.search({
            type: "track",
            query: input,
        },
        function(err, response) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }
            console.log("query:" + input);
            let result = response.tracks.items;
            for (let i = 0; i < 5; i++) {
                console.log("\n-----SONG INFORMATION-----");
                console.log("Artist: " + result[i].artists[0].name);
                console.log("Track: " + result[i].name);
                console.log("Preview: " + result[i].preview_url);
                console.log("Spotify: " + result[i].external_urls.spotify);
                console.log("Album: " + result[i].album.name);
                console.log("--------------------------");
            }
        }
    )
}

function movieInfo(input) {
    axios.get("http://www.omdbapi.com/?t=" + input + "&y=&plot=full&tomatoes=true&apikey=trilogy")
        .then(function(response) {
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

function doWhatItSays(input) {

    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);
        if (error) {
            return console.log(error);
        }
        var random = data.split(',');
        songInfo(random[0], random[1]);
    });
}
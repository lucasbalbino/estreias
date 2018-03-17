const axios = require('axios');

function urlJustWatchGeneral(type, index) {
    return 'https://apis.justwatch.com/content/titles/pt_BR/new?body=%7B' +
        '%22age_certifications%22:null,' +
        '%22content_types%22:%5B%22movie%22%5D,' +
        '%22genres%22:null,' +
        '%22languages%22:null,' +
        '%22max_price%22:null,' +
        '%22min_price%22:null,' +
        '%22monetization_types%22:%5B%22flatrate%22,%22free%22,%22rent%22,%22buy%22,%22ads%22%5D,' +
        '%22page%22:' + index + ',' +
        '%22page_size%22:1,' +
        '%22presentation_types%22:null,' +
        '%22providers%22:%5B%22' + type + '%22%5D,' +
        '%22release_year_from%22:null,' +
        '%22release_year_until%22:null,' +
        '%22scoring_filter_types%22:null,' +
        '%22timeline_type%22:null,' +
        '%22titles_per_provider%22:100' +
        '%7D';
}

function urlJustWatchMovie(id) {
    return "https://apis.justwatch.com/content/titles/movie/" + id + "/locale/pt_BR";
}

function urlTMDBMovie(title, year) {
    return 'https://api.themoviedb.org/3/search/movie?' +
        'api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&' +
        'language=pt-BR&' +
        'include_adult=false&' +
        'region=BRA&' +
        'query=' + title + '&' +
        'year=' + year;
}

function urlTMDBVideos(id) {
    return 'https://api.themoviedb.org/3/movie/' + id + '/videos?' +
        'api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb';
}

function urlOMDB(title, year) {
    return 'https://www.omdbapi.com/?t=' + title + '&apikey=623c5bc3&y=' + year;
}

function getMediaURL(arr, type) {
    let url = "";
    let typeID = (type === "nfx") ? 8 : ((type === "hbg") ? 31 : 0);
    arr.forEach(function (el) {
        if (el.provider_id === typeID) {
            url = el.urls.standard_web;
        }
    });
    return url;
}

function getScoreJustWatch(arr) {
    let items = [];
    arr.forEach(function (el) {
        switch (el.provider_type) {
            case "tomato:meter":
                items.push({
                    "type": "rt",
                    "rating": el.value
                });
                break;
            case "imdb:score":
                items.push({
                    "type": "imdb",
                    "rating": el.value
                });
                break;
            case "metacritic:score":
                items.push({
                    "type": "mc",
                    "rating": el.value
                });
                break;
        }
    });
    return items;
}

function getCredits(arr, role) {
    let QTD = 4;
    let items = [];
    arr.every(function (el) {
        if (role === "ACTOR" && items.length === QTD) {
            return false;
        } else if (el.role.toUpperCase() === role) {
            items.push(el.name);
            return true;
        } else {
            return true;
        }
    });
    return items;
}

// let type = "nfx";//"hbg";
function getJustWatchMovie(type, callback) {
    let dados = [];

    axios.get(urlJustWatchGeneral(type, 1)).then((response) => {
        let json = response.data;

        let items = [];

        if(json.days.length === 0) {
            return;
        }
        date = json.days[0].date;

        items = json.days[0].providers[0].items;

        let itemsProcessed = 0;
        items.forEach((item, i) => {
            itemsProcessed++;
            let idIMDB = "";
            let idTMDB = "";
            let idJustWatch = item.id;
            let title = item.title;
            let subtitle = item.original_title;
            let year = item.original_release_year;
            let releaseDate = "";
            let netflixDate = "";
            let hbogoDate = "";
            let director = [];
            let cast = [];
            let genre = [];
            let movieAge = "";
            let runtime = "";
            let score = [];
            let synopsis = "";
            let popularity = "";
            let posterImage = "";
            let trailerURL = "";
            let netflixURL = "";
            let hbogoURL = "";

            if (type === "nfx") {
                netflixDate = date;
            } else if (type === "hbg") {
                hbogoDate = date;
            }

            axios.get(urlJustWatchMovie(idJustWatch)).then((response) => {
                let result = response.data;
                director = getCredits(result.credits, "DIRECTOR");
                cast = getCredits(result.credits, "ACTOR");
                movieAge = result.age_certification;
                runtime = result.runtime;
                score = getScoreJustWatch(result.scoring);
                synopsis = result.short_description;
                popularity = result.tmdb_popularity;
                netflixURL = getMediaURL(result.offers, "nfx");
                hbogoURL = getMediaURL(result.offers, "hbg");
                //clips = trailerURL

                axios.get(urlTMDBMovie(subtitle, year)).then((response) => {
                    let json = response.data;
                    if (json.total_results !== 0) {
                        let result = json.results[0];
                        idTMDB = result.id;
                        title = result.title;
                        popularity = result.popularity;
                        posterImage = "http://image.tmdb.org/t/p/w500" + result.poster_path;
                        genre = result.genre_ids;
                        synopsis = result.overview;
                        releaseDate = result.release_date;

                        axios.get(urlTMDBVideos(idTMDB)).then((response) => {
                            let json = response.data;
                            if (json.results.length > 0) {
                                for (let k = json.results.length - 1; k >= 0; k--) {
                                    let result = json.results[k];
                                    if (result.type.toLowerCase() === "trailer" && result.site.toLowerCase() === "youtube") {
                                        trailerURL = "https://www.youtube.com/embed/" + result.key;
                                        break;
                                    }
                                }
                            }

                            axios.get(urlOMDB(subtitle, year)).then((response) => {
                                let json = response.data;
                                if (json.Response !== "False") {
                                    let result = json;
                                    idIMDB = result["imdbID"];
                                    cast = result["Actors"].split(",").map(function (item) {
                                        return item.trim();
                                    });
                                    director = result["Director"].split(",").map(function(item) {
                                        return item.trim();
                                    });
                                }

                                let d = {
                                    "idTMDB": idTMDB,
                                    "idIMDB": idIMDB,
                                    "idJustWatch": idJustWatch,
                                    "releaseDate": releaseDate,
                                    "netflixDate": netflixDate,
                                    "hbogoDate": hbogoDate,
                                    "title": title,
                                    "subtitle": subtitle,
                                    "year": year,
                                    "runtime": runtime,
                                    "director": director,
                                    "genre": genre,
                                    "cast": cast,
                                    "movieAge": movieAge,
                                    "posterImage": posterImage,
                                    "popularity": popularity,
                                    "synopsis": synopsis,
                                    "score": score,
                                    "trailerURL": trailerURL,
                                    "netflixURL": netflixURL,
                                    "hbogoURL": hbogoURL
                                };

                                dados.push(d);

                                if(itemsProcessed === items.length) {
                                    callback(dados);
                                }
                            }).catch(function (error) {
                                console.log(error);
                            });
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            }).catch(function (error) {
                console.log(error);
            });
        });
    }).catch(function (error) {
        console.log(error);
    });
}

module.exports = {
    getMovie: getJustWatchMovie
};
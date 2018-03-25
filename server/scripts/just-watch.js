const axios = require('axios');
const url = require('./urls');

const QTD_CAST = 4;
const TYPE_NFX = 8;
const TYPE_HBG = 31;

function getMediaURL(arr, type) {
    let url = "";
    let typeID = (type === "nfx") ? TYPE_NFX : ((type === "hbg") ? TYPE_HBG : 0);
    arr.forEach(function (el) {
        if (el.provider_id === typeID) {
            url = el.urls.standard_web;
        }
    });
    return url;
}

function getTMDBID(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].provider_type === "tmdb:id") {
            return arr[i].value;
        }
    }
    return null;
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

function getScoreOMDB(ratings, score) {
    for (let j = 0; j < ratings.length; j++) {
        let type = "";
        if (ratings[j]["Source"] === "Internet Movie Database") {
            if (score.map(function (e) {
                    return e.type;
                }).indexOf('imdb') === -1) {
                score.push({
                    "type": "imdb",
                    "rating": parseFloat(ratings[j]["Value"].split("/")[0])
                });
            }
        }
        if (ratings[j]["Source"] === "Rotten Tomatoes") {
            if (score.map(function (e) {
                    return e.type;
                }).indexOf('rt') === -1) {
                score.push({
                    "type": "rt",
                    "rating": parseFloat(ratings[j]["Value"].split("%")[0])
                });
            }
        }
        if (ratings[j]["Source"] === "Metacritic") {
            if (score.map(function (e) {
                    return e.type;
                }).indexOf('mc') === -1) {
                score.push({
                    "type": "mc",
                    "rating": parseFloat(ratings[j]["Value"].split("/")[0])
                });
            }
        }
    }
    return score;
}

function getCredits(arr, role) {
    let items = [];
    if (arr) {
        arr.every(function (el) {
            if (role === "ACTOR" && items.length === QTD_CAST) {
                return false;
            } else if (el.role.toUpperCase() === role) {
                items.push(el.name.replace(/'/g, "\\'"));
                return true;
            } else {
                return true;
            }
        });
    }
    return items;
}

function getJustWatchMovie(type, index, callback) {
    if (type === "netflix") {
        type = "nfx";
    } else if (type === "hbo-go") {
        type = "hbg";
    }

    let dados = [];

    axios.get(url.urlJustWatchGeneral(type, index)).then((response) => {
        let json = response.data;

        let items = [];

        if (json.days.length === 0) {
            console.log("NENHUM FILME ENCONTRADO");
            return;
        }
        let date = json.days[0].date;

        items = json.days[0].providers[0].items;

        console.log("[" + date + "] FILMES ENCONTRADOS: " + items.length);
        let itemsProcessed = 0;
        items.forEach((item, i) => {
            setTimeout(() => {

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

                axios.get(url.urlJustWatchMovie(idJustWatch)).then((response) => {
                    let result = response.data;
                    director = getCredits(result.credits, "DIRECTOR");
                    cast = getCredits(result.credits, "ACTOR");
                    idTMDB = getTMDBID(result.scoring);
                    movieAge = (result.age_certification) ? result.age_certification : "";
                    runtime = (result.runtime) ? result.runtime : 0;
                    score = getScoreJustWatch(result.scoring);
                    synopsis = result.short_description;
                    popularity = result.tmdb_popularity;
                    netflixURL = getMediaURL(result.offers, "nfx");
                    hbogoURL = getMediaURL(result.offers, "hbg");
                    posterImage = (result.poster) ? "https://images.justwatch.com" + result.poster.replace("{profile}", "s592/") : "";
                    //clips = trailerURL

                    axios.get(idTMDB ?
                        url.urlTMDBMovieID(idTMDB) :
                        url.urlTMDBMovie(subtitle, year)
                    ).then((response) => {
                        let json = response.data;
                        if (idTMDB || json.total_results !== 0) {
                            let result = (idTMDB) ? json : json.results[0];
                            idTMDB = result.id;
                            title = result.title;
                            popularity = result.popularity;
                            posterImage = "http://image.tmdb.org/t/p/w500" + result.poster_path;
                            genre = result.genre_ids;
                            if (result.overview) {
                                synopsis = result.overview;
                            }
                            releaseDate = result.release_date;

                            axios.get(url.urlTMDBVideos(idTMDB)).then((response) => {
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

                                axios.get(url.urlOMDB(subtitle, year)).then((response) => {
                                    let json = response.data;
                                    if (json.Response !== "False") {
                                        let result = json;
                                        idIMDB = result["imdbID"];
                                        cast = result["Actors"].split(",").map(function (item) {
                                            return item.replace(/'/g, "\\'").trim();
                                        });
                                        director = result["Director"].split(",").map(function (item) {
                                            return item.replace(/'/g, "\\'").trim();
                                        });
                                        score = getScoreOMDB(result["Ratings"], score);
                                    }

                                    itemsProcessed++;
                                    dados.push({
                                        "idTMDB": idTMDB,
                                        "idIMDB": idIMDB,
                                        "idJustWatch": idJustWatch,
                                        "releaseDate": releaseDate,
                                        "netflixDate": netflixDate,
                                        "hbogoDate": hbogoDate,
                                        "title": (title) ? title.replace(/'/g, "\\'") : title,
                                        "subtitle": (subtitle) ? subtitle.replace(/'/g, "\\'") : subtitle,
                                        "year": year,
                                        "runtime": runtime,
                                        "director": director,
                                        "genre": genre,
                                        "cast": cast,
                                        "movieAge": movieAge,
                                        "posterImage": posterImage,
                                        "popularity": popularity,
                                        "synopsis": (synopsis) ? synopsis.replace(/'/g, "\\'") : synopsis,
                                        "is3D": null,
                                        "isIMAX": null,
                                        "score": score,
                                        "trailerURL": trailerURL,
                                        "netflixURL": netflixURL,
                                        "hbogoURL": hbogoURL
                                    });
                                    console.log("> Filme '" + title + "' adicionado");

                                    if (itemsProcessed === items.length) {
                                        callback(type, dados);
                                    }
                                }).catch(function (error) {
                                    itemsProcessed++;

                                    dados.push({
                                        "idTMDB": idTMDB,
                                        "idIMDB": idIMDB,
                                        "idJustWatch": idJustWatch,
                                        "releaseDate": releaseDate,
                                        "netflixDate": netflixDate,
                                        "hbogoDate": hbogoDate,
                                        "title": (title) ? title.replace(/'/g, "\\'") : title,
                                        "subtitle": (subtitle) ? subtitle.replace(/'/g, "\\'") : subtitle,
                                        "year": year,
                                        "runtime": runtime,
                                        "director": director,
                                        "genre": genre,
                                        "cast": cast,
                                        "movieAge": movieAge,
                                        "posterImage": posterImage,
                                        "popularity": popularity,
                                        "synopsis": (synopsis) ? synopsis.replace(/'/g, "\\'") : synopsis,
                                        "is3D": null,
                                        "isIMAX": null,
                                        "score": score,
                                        "trailerURL": trailerURL,
                                        "netflixURL": netflixURL,
                                        "hbogoURL": hbogoURL
                                    });
                                    console.log("> Filme '" + title + "' adicionado (sem OMDB): " + error.message);

                                    if (itemsProcessed === items.length) {
                                        callback(type, dados);
                                    }
                                });
                            }).catch(function (error) {
                                itemsProcessed++;
                                console.log("> Erro ao inserir Filme '" + title + "': " + error.message);
                            });
                        } else {
                            itemsProcessed++;

                            dados.push({
                                "idTMDB": idTMDB,
                                "idIMDB": idIMDB,
                                "idJustWatch": idJustWatch,
                                "releaseDate": releaseDate,
                                "netflixDate": netflixDate,
                                "hbogoDate": hbogoDate,
                                "title": (title) ? title.replace(/'/g, "\\'") : title,
                                "subtitle": (subtitle) ? subtitle.replace(/'/g, "\\'") : subtitle,
                                "is3D": null,
                                "isIMAX": null,
                                "year": year,
                                "runtime": runtime,
                                "director": director,
                                "genre": genre,
                                "cast": cast,
                                "movieAge": movieAge,
                                "posterImage": posterImage,
                                "popularity": popularity,
                                "synopsis": (synopsis) ? synopsis.replace(/'/g, "\\'") : synopsis,
                                "score": score,
                                "trailerURL": trailerURL,
                                "netflixURL": netflixURL,
                                "hbogoURL": hbogoURL
                            });

                            console.log("> Filme '" + title + "' adicionado (sem TMDB)");

                            if (itemsProcessed === items.length) {
                                callback(type, dados);
                            }
                        }
                    }).catch(function (error) {
                        itemsProcessed++;

                        dados.push({
                            "idTMDB": idTMDB,
                            "idIMDB": idIMDB,
                            "idJustWatch": idJustWatch,
                            "releaseDate": releaseDate,
                            "netflixDate": netflixDate,
                            "hbogoDate": hbogoDate,
                            "title": (title) ? title.replace(/'/g, "\\'") : title,
                            "subtitle": (subtitle) ? subtitle.replace(/'/g, "\\'") : subtitle,
                            "year": year,
                            "runtime": runtime,
                            "director": director,
                            "genre": genre,
                            "cast": cast,
                            "movieAge": movieAge,
                            "posterImage": posterImage,
                            "popularity": popularity,
                            "synopsis": (synopsis) ? synopsis.replace(/'/g, "\\'") : synopsis,
                            "is3D": null,
                            "isIMAX": null,
                            "score": score,
                            "trailerURL": trailerURL,
                            "netflixURL": netflixURL,
                            "hbogoURL": hbogoURL
                        });

                        console.log("> Filme '" + title + "' adicionado (sem TMDB): " + error.message);

                        if (itemsProcessed === items.length) {
                            callback(type, dados);
                        }
                    });
                }).catch(function (error) {
                    itemsProcessed++;
                    console.log("> Erro ao inserir Filme '" + title + "': " + error.message);
                });
            }, i * 600);
        });
    }).catch(function (error) {
        console.log(error.message);
    });
}

module.exports = {
    getMovie: getJustWatchMovie
};
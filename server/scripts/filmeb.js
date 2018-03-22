const axios = require('axios');
const request = require('request');
const cheerio = require('cheerio');
const url = require('./urls');

const RELEASE_YEARS = ["2016", "2017", "2018"];

function getScoreOMDB(ratings) {
    let score = [];
    for (let j = 0; j < ratings.length; j++) {
        let type = "";
        if (ratings[j]["Source"] === "Internet Movie Database") {
            score.push({
                "type": "imdb",
                "rating": parseFloat(ratings[j]["Value"].split("/")[0])
            });
        }
        if (ratings[j]["Source"] === "Rotten Tomatoes") {
            score.push({
                "type": "rt",
                "rating": parseFloat(ratings[j]["Value"].split("%")[0])
            });
        }
        if (ratings[j]["Source"] === "Metacritic") {
            score.push({
                "type": "mc",
                "rating": parseFloat(ratings[j]["Value"].split("/")[0])
            });
        }
    }
    return score;
}

function transformDate(date) {
    let temp = date.split("/");
    return temp[2] + "-" + temp[1] + "-" + temp[0];
}

function getCorrectIndex(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (RELEASE_YEARS.indexOf(arr[i].release_date.split("-")[0]) !== -1) {
            return i;
        }
    }
    return -1;
}

function getFilmeBMovie(type, initialDate, finalDate, callback) {
    let dados = [];

    console.log("COLETANDO URL '" + type + "' entre o período " + initialDate + " e " + finalDate);
    request(url.urlFilmeB(type, initialDate, finalDate), (error, response, html) => {
        if (!error && response.statusCode === 200) {

            const $ = cheerio.load(html);

            let qtd = $(".views-row").length;

            let releaseDate = "";
            if ($(".data-extenso").length) {
                releaseDate = transformDate($(".data-extenso").text());
            }

            console.log("FILMES ENCONTRADOS: " + qtd);
            let itemsProcessed = 0;
            $(".views-row").each((index, el) => {
                setTimeout(() => {

                    let idTMDB = "";
                    let idIMDB = "";
                    let title = "";
                    let subtitle = "";
                    let year = "";
                    let runtime = "";
                    let country = [];

                    let director = [];
                    let distribution = [];
                    let genre = [];
                    let cast = [];
                    let movieAge = "";
                    let is3D = null;
                    let isIMAX = null;
                    let posterImage = "";
                    let popularity = 0;
                    let synopsis = "";
                    let score = [];
                    let trailerURL = "";

                    if ($(el).find("div.weeksep").length) {
                        releaseDate = transformDate($(el).find("div.weeksep").text().split(",")[1].trim());
                    }

                    let conteudo = $(el).find("span.views-field.views-field-php")
                    let titleA = conteudo.find("a").first();
                    title = titleA.text().trim();

                    subtitle = conteudo.find("i").text().trim();

                    let texto = conteudo.text();
                    let temp = texto.split("[")[1].split("]")[0].split(", ");
                    year = temp[temp.length - 1].trim();
                    country = temp.slice(1, temp.length - 1).map(function (item) {
                        return item.replace(/'/g, "\\'").trim();
                    });

                    temp = texto.split("[")[1].split("]")[1].split("(");
                    director = temp[0].substring(5).split(",").map(function (item) {
                        return item.replace(/'/g, "\\'").trim();
                    });
                    distribution = temp[1].split(")")[0].split("/").map(function (item) {
                        return item.replace(/'/g, "\\'").trim();
                    });

                    temp = texto.split(".");
                    for (let i = 1; i < temp.length; i++) {
                        if (temp[i].split(":").length === 2) {
                            let variavel = temp[i].split(":")[0].trim().toLowerCase();
                            let result = temp[i].split(":")[1].trim();
                            if (variavel === "elenco") {
                                cast = result.split(",").map(function (item) {
                                    return item.replace(/'/g, "\\'").trim();
                                });
                            } else if (variavel === "classificação") {
                                if (result.indexOf("10") >= 0) {
                                    movieAge = "10";
                                } else if (result.indexOf("12") >= 0) {
                                    movieAge = "12";
                                } else if (result.indexOf("14") >= 0) {
                                    movieAge = "14";
                                } else if (result.indexOf("16") >= 0) {
                                    movieAge = "16";
                                } else if (result.indexOf("18") >= 0) {
                                    movieAge = "18";
                                } else if (result.toLowerCase().indexOf("livre") >= 0) {
                                    movieAge = "L";
                                }
                            }
                        } else if (temp[i].toLowerCase().indexOf("3d") >= 0) {
                            is3D = true;
                        } else if (temp[i].toLowerCase().indexOf("imax") >= 0) {
                            isIMAX = true;
                        }
                    }

                    axios.get(url.urlTMDBMovie(subtitle)).then((response) => {
                        let json = response.data;
                        if (json.total_results !== 0) {
                            let k = getCorrectIndex(json.results);
                            if (k === -1) {
                                console.log("> Erro ao inserir Filme '" + title + "' (" + subtitle + "). É provável que o nome esteja errado");
                                return true;
                            }
                            let result = json.results[k];
                            idTMDB = result.id;
                            title = result.title;
                            subtitle = result.original_title;
                            popularity = result.popularity;
                            posterImage = "http://image.tmdb.org/t/p/w500" + result.poster_path;
                            genre = result.genre_ids;
                            synopsis = result.overview;


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

                                axios.get(url.urlOMDB(subtitle)).then((response) => {
                                    let json = response.data;
                                    if (json.Response !== "False") {
                                        let result = json;
                                        idIMDB = result["imdbID"];
                                        year = result["Year"];
                                        runtime = (result["Runtime"] !== "N/A") ? parseInt(result["Runtime"].split(" ")[0]) : "";
                                        cast = result["Actors"].split(",").map(function (item) {
                                            return item.replace(/'/g, "\\'").trim();
                                        });
                                        score = getScoreOMDB(result["Ratings"]);
                                    }

                                    itemsProcessed++;

                                    dados.push({
                                        "idTMDB": idTMDB,
                                        "idIMDB": idIMDB,
                                        "releaseDate": releaseDate,
                                        "title": (title) ? title.replace(/'/g, "\\'") : title,
                                        "subtitle": (subtitle) ? subtitle.replace(/'/g, "\\'") : subtitle,
                                        "year": year,
                                        "runtime": runtime,
                                        "movieAge": movieAge,
                                        "posterImage": posterImage,
                                        "popularity": popularity,
                                        "synopsis": (synopsis) ? synopsis.replace(/'/g, "\\'") : synopsis,
                                        "is3D": is3D,
                                        "isIMAX": isIMAX,
                                        "trailerURL": trailerURL,
                                        "country": country,
                                        "director": director,
                                        "distribution": distribution,
                                        "genre": genre,
                                        "cast": cast,
                                        "score": score
                                    });

                                    console.log("> Filme '" + title + "' adicionado");

                                    if (itemsProcessed === qtd) {
                                        callback(dados);
                                    }

                                }).catch(function (error) {
                                    itemsProcessed++;

                                    dados.push({
                                        "idTMDB": idTMDB,
                                        "idIMDB": idIMDB,
                                        "releaseDate": releaseDate,
                                        "title": (title) ? title.replace(/'/g, "\\'") : title,
                                        "subtitle": (subtitle) ? subtitle.replace(/'/g, "\\'") : subtitle,
                                        "year": year,
                                        "runtime": runtime,
                                        "movieAge": movieAge,
                                        "posterImage": posterImage,
                                        "popularity": popularity,
                                        "synopsis": (synopsis) ? synopsis.replace(/'/g, "\\'") : synopsis,
                                        "is3D": is3D,
                                        "isIMAX": isIMAX,
                                        "trailerURL": trailerURL,
                                        "country": country,
                                        "director": director,
                                        "distribution": distribution,
                                        "genre": genre,
                                        "cast": cast,
                                        "score": score
                                    });

                                    console.log("> Filme '" + title + "' adicionado (sem OMDB):" + error.message);

                                    if (itemsProcessed === qtd) {
                                        callback(dados);
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
                                "releaseDate": releaseDate,
                                "title": (title) ? title.replace(/'/g, "\\'") : title,
                                "subtitle": (subtitle) ? subtitle.replace(/'/g, "\\'") : subtitle,
                                "year": year,
                                "runtime": runtime,
                                "movieAge": movieAge,
                                "posterImage": posterImage,
                                "popularity": popularity,
                                "synopsis": (synopsis) ? synopsis.replace(/'/g, "\\'") : synopsis,
                                "is3D": is3D,
                                "isIMAX": isIMAX,
                                "trailerURL": trailerURL,
                                "country": country,
                                "director": director,
                                "distribution": distribution,
                                "genre": genre,
                                "cast": cast,
                                "score": score
                            });

                            console.log("> Filme '" + title + "' adicionado (sem TMDB)");

                            if (itemsProcessed === qtd) {
                                callback(type, dados);
                            }
                        }
                    }).catch(function (error) {
                        itemsProcessed++;

                        dados.push({
                            "idTMDB": idTMDB,
                            "idIMDB": idIMDB,
                            "releaseDate": releaseDate,
                            "title": (title) ? title.replace(/'/g, "\\'") : title,
                            "subtitle": (subtitle) ? subtitle.replace(/'/g, "\\'") : subtitle,
                            "year": year,
                            "runtime": runtime,
                            "movieAge": movieAge,
                            "posterImage": posterImage,
                            "popularity": popularity,
                            "synopsis": (synopsis) ? synopsis.replace(/'/g, "\\'") : synopsis,
                            "is3D": is3D,
                            "isIMAX": isIMAX,
                            "trailerURL": trailerURL,
                            "country": country,
                            "director": director,
                            "distribution": distribution,
                            "genre": genre,
                            "cast": cast,
                            "score": score
                        });

                        console.log("> Filme '" + title + "' adicionado (sem TMDB): " + error.message);

                        if (itemsProcessed === qtd) {
                            callback(type, dados);
                        }
                    });
                }, index * 600);
            });
        }
    });
}

module.exports = {
    getMovie: getFilmeBMovie
};
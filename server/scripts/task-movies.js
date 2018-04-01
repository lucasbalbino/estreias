const jw = require('./just-watch');
const fb = require('./filmeb');

function getMovie(type, initialDate, finalDate, isYear) {
    if (isTV(type)) {
        jw.getMovie(type, 1, insertOnDataBase);
    } else {
        // let time = (isYear) ? "y" : "w";
        // fb.getMovie("w", "2018-12-27", "2019-01-02", insertOnDataBase);
        fb.getMovie("", "", "", insertOnDataBase);
    }
}

const fs = require('fs');
function saveOnFile(type, result) {

    if (!result) {
        return;
    }

    result.forEach((data) => {
        fs.appendFile('workspace/result.json', JSON.stringify(data) + ",\n", function (err) {
            if (err) throw err;
            console.log(printDate(type, data) + ": Filme '" + data.title + "' salvo");
        });
    });
}


function doNothing(type, result) {

    if (!result) {
        return;
    }

    console.log(type, result);
}

function isTV(type) {
    return (type === "netflix" || type === "hbo-go");
}

function printDate(type, data) {
    let date = (type === "nfx") ?
        data.netflixDate : (type === "hbg") ?
            data.hbogoDate : data.releaseDate;
    return type + "] [" + date;
}

const db = require('../db');
function insertOnDataBase(type, result) {

    if (!result) {
        return;
    }

    console.log("[" + printDate(type, result[0]) + "] FILMES PROCESSADOS: " + result.length);
    result.forEach((data, i) => {
        let append = "";
        if (isTV(type)) {
            append = "just_watch_id=" + data.idJustWatch;
        } else {
            append = "title='" + data.title + "' AND year='" + data.year + "'";
        }
        db.query("SELECT id FROM movies WHERE " + append, (err, result) => {
            if (err) throw err;
            if (result && result.length > 0) {
                let idMovie = result[0].id;
                console.log("[" + printDate(type, data) + "] (" + i + ") Filme '" + data.title + "' já está presente banco. ID: " + idMovie);

                let updateMovie = "UPDATE movies SET " +
                    "tmdb_id='" + data.idTMDB + "', " +
                    "imdb_id='" + data.idIMDB + "', " +
                    "just_watch_id='" + data.idJustWatch + "', " +
                    "release_date='" + data.releaseDate + "', " +
                    "netflix_date='" + data.netflixDate + "', " +
                    "hbo_go_date='" + data.hbogoDate + "', " +
                    "title='" + data.title + "', " +
                    "subtitle='" + data.subtitle + "', " +
                    "year='" + data.year + "', " +
                    "runtime='" + data.runtime + "', " +
                    "movie_age='" + data.movieAge + "', " +
                    "poster_image='" + data.posterImage + "', " +
                    "popularity='" + data.popularity + "', " +
                    "synopsis='" + data.synopsis + "', " +
                    "is_3d=" + data.is3D + ", " +
                    "is_imax=" + data.isIMAX + ", " +
                    "trailer_url='" + data.trailerURL + "', " +
                    "netflix_url='" + data.netflixURL + "', " +
                    "hbo_go_url='" + data.hbogoURL + "'" +
                    " WHERE " + append;

                db.query(updateMovie, (err, result) => {
                    if (err) throw err;
                    console.log("[" + printDate(type, data) + "] (" + i + ") Filme '" + data.title + "' atualizado.");

                    if (data.score && data.score.length > 0)
                        scoreMovie(idMovie, type, data, i);
                    if (data.genre && data.genre.length > 0)
                        genreMovie(idMovie, type, data, i);
                    if (data.country && data.country.length > 0)
                        countryMovie(idMovie, type, data, i);
                    if (data.distribution && data.distribution.length > 0)
                        distributionMovie(idMovie, type, data, i);
                    if ((data.director && data.director.length > 0) || (data.actor && data.actor.length > 0))
                        creditsMovie(idMovie, type, data, i);
                });
            } else {
                let insertMovie = "INSERT INTO movies (tmdb_id, imdb_id, just_watch_id," +
                    "release_date, netflix_date, hbo_go_date, title, subtitle, year," +
                    "runtime, movie_age, poster_image, popularity, synopsis, trailer_url," +
                    "netflix_url, hbo_go_url, is_3d, is_imax) VALUES (" +
                    "'" + data.idTMDB + "', " +
                    "'" + data.idIMDB + "', " +
                    "'" + data.idJustWatch + "', " +
                    "'" + data.releaseDate + "', " +
                    "'" + data.netflixDate + "', " +
                    "'" + data.hbogoDate + "', " +
                    "'" + data.title + "', " +
                    "'" + data.subtitle + "', " +
                    "'" + data.year + "', " +
                    "'" + data.runtime + "', " +
                    "'" + data.movieAge + "', " +
                    "'" + data.posterImage + "', " +
                    "'" + data.popularity + "', " +
                    "'" + data.synopsis + "', " +
                    "'" + data.trailerURL + "', " +
                    "'" + data.netflixURL + "', " +
                    "'" + data.hbogoURL + "', " +
                    "" + data.is3D + ", " +
                    "" + data.isIMAX + "" +
                    ") ON DUPLICATE KEY UPDATE tmdb_id=VALUES(tmdb_id), imdb_id=VALUES(imdb_id), just_watch_id=VALUES(just_watch_id)," +
                    "release_date=VALUES(release_date), netflix_date=VALUES(netflix_date), hbo_go_date=VALUES(hbo_go_date)," +
                    "title=VALUES(title), subtitle=VALUES(subtitle), year=VALUES(year), runtime=VALUES(runtime), movie_age=VALUES(movie_age)," +
                    "poster_image=VALUES(poster_image), popularity=VALUES(popularity), synopsis=VALUES(synopsis), trailer_url=VALUES(trailer_url)," +
                    "netflix_url=VALUES(netflix_url), hbo_go_url=VALUES(hbo_go_url), is_3d=VALUES(is_3d), is_imax=VALUES(is_imax)";

                db.query(insertMovie, (err, result) => {
                    if (err) throw err;

                    let idMovie = result.insertId;
                    if (idMovie !== 0) {
                        console.log("[" + printDate(type, data) + "] (" + i + ") Filme '" + data.title + "' salvo no banco. ID: " + idMovie);

                        if (data.score && data.score.length > 0)
                            scoreMovie(idMovie, type, data, i);
                        if (data.genre && data.genre.length > 0)
                            genreMovie(idMovie, type, data, i);
                        if (data.country && data.country.length > 0)
                            countryMovie(idMovie, type, data, i);
                        if (data.distribution && data.distribution.length > 0)
                            distributionMovie(idMovie, type, data, i);
                        if ((data.director && data.director.length > 0) || (data.actor && data.actor.length > 0))
                            creditsMovie(idMovie, type, data, i);
                    } else {
                        console.log("[" + printDate(type, data) + "] (" + i + ") Filme '" + data.title + "' foi salvo no banco anteriomente.");
                    }
                });
            }
        });
    });
}

function scoreMovie(idMovie, type, data, i) {
    let scoreIMDB = 0, scoreRT = 0, scoreMC = 0;
    if (data.score.length > 0) {
        data.score.forEach((sc) => {
            if (sc.type === "imdb") {
                scoreIMDB = sc.rating;
            }
            if (sc.type === "rt") {
                scoreRT = sc.rating;
            }
            if (sc.type === "mc") {
                scoreMC = sc.rating;
            }
        });
    }

    db.query("SELECT id FROM score WHERE movie_id=" + idMovie, (err, result) => {
        if (err) throw err;
        if (result && result.length > 0) {
            let idScore = result[0].id;
            console.log("[" + printDate(type, data) + "] (" + i + ") Filme '" + data.title + "' já possui pontuação no banco. ID: " + idScore);

            if (scoreIMDB && scoreIMDB !== result[0].imdb) {
                db.query("UPDATE score SET imdb=" + scoreIMDB + " WHERE movie_id=" + idMovie, (err, result) => {
                    if (err) throw err;
                    console.log("[" + printDate(type, data) + "] (" + i + ") Pontuação IMDB atualizada para filme '" + data.title + "'");
                });
            }
            if (scoreRT && scoreRT !== result[0].rt) {
                db.query("UPDATE score SET rt=" + scoreRT + " WHERE movie_id=" + idMovie, (err, result) => {
                    if (err) throw err;
                    console.log("[" + printDate(type, data) + "] (" + i + ") Pontuação Rotten Tomatoes atualizada para filme '" + data.title + "'");
                });
            }
            if (scoreMC && scoreMC !== result[0].mc) {
                db.query("UPDATE score SET mc=" + scoreMC + " WHERE movie_id=" + idMovie, (err, result) => {
                    if (err) throw err;
                    console.log("[" + printDate(type, data) + "] (" + i + ") Pontuação Metacritic atualizada para filme '" + data.title + "'");
                });
            }
        }
        else {
            let sql = "INSERT INTO score(movie_id, imdb, rt, mc) VALUES ('" + idMovie + "', '" + scoreIMDB + "', '" + scoreRT +
                "', '" + scoreMC + "') ON DUPLICATE KEY UPDATE imdb=VALUES(imdb), rt=VALUES(rt), mc=VALUES(mc)";

            db.query(sql, (err, result) => {
                if (err) throw err;
                console.log("[" + printDate(type, data) + "] (" + i + ") Pontuação IMDb - '" + scoreIMDB + "' vinculada ao filme '" + data.title + "' no banco");
                console.log("[" + printDate(type, data) + "] (" + i + ") Pontuação Rotten Tomatoes - '" + scoreRT + "' vinculada ao filme '" + data.title + "' no banco");
                console.log("[" + printDate(type, data) + "] (" + i + ") Pontuação Metacritic - '" + scoreMC + "' vinculada ao filme '" + data.title + "' no banco");
            });
        }
    });
}

function genreMovie(idMovie, type, data, i) {

    data.genre.forEach((idGenre) => {
        db.query("SELECT id FROM movies_genre WHERE movie_id=" + idMovie, (err, result) => {
            if (err) throw err;
            if (result && result.length > 0) {
                let idMovie = result[0].id;
                console.log("[" + printDate(type, data) + "] (" + i + ") Filme '" + data.title + "' já está associado ao gênero '" + idGenre + "' . ID: " + idMovie);
            }
            else {
                let sql = "INSERT INTO movies_genre (movie_id, genre_just_watch_id) VALUES ('" + idMovie + "', '" + idGenre +
                    "')";
                db.query(sql, (err, result) => {
                    if (err) throw err;
                    console.log("[" + printDate(type, data) + "] (" + i + ") Gênero '" + idGenre + "' vinculado ao filme '" + data.title + "' no banco");
                });
            }
        });
    });
}

function countryMovie(idMovie, type, data, i) {

    data.country.forEach((country) => {
        db.query("SELECT id FROM country WHERE name='" + country + "'", (err, result) => {
            if (err) throw err;
            if (result && result.length > 0) {
                let idCountry = result[0].id;
                console.log("[" + printDate(type, data) + "] (" + i + ") País '" + country + "' já adicionado. ID: " + idCountry);

                relationCountryMovie(idMovie, idCountry, type, data, country, i);
            } else {
                db.query("INSERT INTO country (name) VALUES ('" + country + "') ON DUPLICATE KEY UPDATE name=VALUES(name)", (err, result) => {
                    if (err) throw err;
                    console.log("[" + printDate(type, data) + "] (" + i + ") País '" + country + "' salvo no banco");

                    let idCountry = result.insertId;
                    if (idCountry !== 0) {
                        relationCountryMovie(idMovie, idCountry, type, data, country, i);
                    } else {
                        console.log("[" + printDate(type, data) + "] (" + i + ") País '" + country + "' já adicionado anteriormente");
                    }
                });
            }
        });
    });
}

function relationCountryMovie(idMovie, idCountry, type, data, country, i) {
    db.query("SELECT id FROM movies_country WHERE movie_id=" + idMovie + " AND country_id=" + idCountry, (err, result) => {
        if (err) throw err;
        if (result && result.length > 0) {
            console.log("[" + printDate(type, data) + "] (" + i + ") Filme '" + data.title + "' já está associado ao país '" + country + "'. ID: " + idMovie);
        }
        else {
            let sql = "INSERT INTO movies_country (movie_id, country_id) VALUES ('" + idMovie + "', '" + idCountry +
                "') ON DUPLICATE KEY UPDATE id=id";
            db.query(sql, (err, result) => {
                if (err) throw err;
                console.log("[" + printDate(type, data) + "] (" + i + ") Relação entre '" + data.title + "' e '" + country + "' criada no banco");
            });
        }
    });
}

function distributionMovie(idMovie, type, data, i) {

    data.distribution.forEach((distribution) => {
        db.query("SELECT id FROM distribution WHERE name='" + distribution + "'", (err, result) => {
            if (err) throw err;
            if (result && result.length > 0) {
                let idDistribution = result[0].id;
                console.log("[" + printDate(type, data) + "] (" + i + ") Distribuidora '" + distribution + "' já adicionado. ID: " + idDistribution);

                relationDistributionMovie(idMovie, idDistribution, type, data, distribution, i);
            } else {
                db.query("INSERT INTO distribution (name) VALUES ('" + distribution + "') ON DUPLICATE KEY UPDATE name=VALUES(name)", (err, result) => {
                    if (err) throw err;
                    console.log("[" + printDate(type, data) + "] (" + i + ") Distribuidora '" + distribution + "' salvo no banco");

                    let idDistribution = result.insertId;
                    if (idDistribution !== 0) {
                        relationDistributionMovie(idMovie, idDistribution, type, data, distribution, i);
                    } else {
                        console.log("[" + printDate(type, data) + "] (" + i + ") Distribuidora '" + distribution + "' já adicionado anteriormente");
                    }
                });
            }
        });
    });
}

function relationDistributionMovie(idMovie, idDistribution, type, data, distribution, i) {
    db.query("SELECT id FROM movies_distribution WHERE movie_id=" + idMovie + " AND distribution_id=" + idDistribution, (err, result) => {
        if (err) throw err;
        if (result && result.length > 0) {
            console.log("[" + printDate(type, data) + "] (" + i + ") Filme '" + data.title + "' já está associado à distribuidora '" + distribution + "'. ID: " + idMovie);
        }
        else {
            let sql = "INSERT INTO movies_distribution (movie_id, distribution_id) VALUES ('" + idMovie + "', '" + idDistribution +
                "') ON DUPLICATE KEY UPDATE id=id";
            db.query(sql, (err, result) => {
                if (err) throw err;
                console.log("[" + printDate(type, data) + "] (" + i + ") Relação entre '" + data.title + "' e '" + distribution + "' criada no banco");
            });
        }
    });
}

function creditsMovie(idMovie, type, data, i) {

    data.director.forEach((credit) => {
        db.query("SELECT id FROM credits WHERE name='" + credit + "'", (err, result) => {
            if (err) throw err;
            if (result && result.length > 0) {
                let idDirector = result[0].id;
                console.log("[" + printDate(type, data) + "] (" + i + ") Diretor '" + credit + "' já adicionado no banco. ID: " + idDirector);

                relationCreditMovie(idMovie, idDirector, type, data, credit, 0, i);
            } else {
                db.query("INSERT INTO credits (name) VALUES ('" + credit + "') ON DUPLICATE KEY UPDATE name=VALUES(name)", (err, result) => {
                    if (err) throw err;
                    console.log("[" + printDate(type, data) + "] (" + i + ") Diretor '" + credit + "' salvo no banco");

                    let idDirector = result.insertId;
                    if (idDirector !== 0) {
                        relationCreditMovie(idMovie, idDirector, type, data, credit, 0, i);
                    } else {
                        console.log("[" + printDate(type, data) + "] (" + i + ") Diretor '" + credit + "' já adicionado anteriorment");
                    }
                });
            }
        });
    });

    data.cast.forEach((credit) => {
        db.query("SELECT id FROM credits WHERE name='" + credit + "'", (err, result) => {
            if (err) throw err;
            if (result && result.length > 0) {
                let idActor = result[0].id;
                console.log("[" + printDate(type, data) + "] (" + i + ") Ator '" + credit + "' já adicionado no banco. ID: " + idActor);

                relationCreditMovie(idMovie, idActor, type, data, credit, 1, i);
            } else {
                db.query("INSERT INTO credits (name) VALUES ('" + credit + "') ON DUPLICATE KEY UPDATE name=VALUES(name)", (err, result) => {
                    if (err) throw err;
                    console.log("[" + printDate(type, data) + "] (" + i + ") Ator '" + credit + "' salvo no banco");

                    let idActor = result.insertId;
                    if (idActor !== 0) {
                        relationCreditMovie(idMovie, idActor, type, data, credit, 1, i);
                    } else {
                        console.log("[" + printDate(type, data) + "] (" + i + ") Ator '" + credit + "' já adicionado anteriormente");
                    }
                });
            }
        });
    });
}

function relationCreditMovie(idMovie, idCredit, type, data, credit, role, i) {
    db.query("SELECT id FROM movies_credits WHERE movie_id=" + idMovie + " AND credit_id=" + idCredit, (err, result) => {
        if (err) throw err;
        if (result && result.length > 0) {
            console.log("[" + printDate(type, data) + "] (" + i + ") Filme '" + data.title + "' já está associado ao ator/diretor '" + credit + "'. ID: " + idMovie);
        }
        else {
            let sql = "INSERT INTO movies_credits (movie_id, credit_id, role) VALUES ('" + idMovie + "', '" + idCredit +
                "', " + role + ") ON DUPLICATE KEY UPDATE id=id";
            db.query(sql, (err, result) => {
                if (err) throw err;
                console.log("[" + printDate(type, data) + "] (" + i + ") Relação entre '" + data.title + "' e '" + credit + "' criada no banco");
            });
        }
    });
}

module.exports = {
    getMovie: getMovie
};
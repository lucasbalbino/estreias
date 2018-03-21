const mv = require('./just-watch');

const db = require('../db');

function getMovie() {
    mv.getMovie("nfx", 80, insertOnDataBase);
}

const fs = require('fs');
function saveOnFile(type, result) {

    if (!result) {
        return;
    }

    result.forEach((data) => {
        fs.appendFile('workspace/result.json', JSON.stringify(data) + ",\n", function (err) {
            if (err) throw err;
            console.log(data.netflixDate + ": Filme '" + data.title + "' salvo");
            index++;
        });
    });
}

function printDate(type, data) {
    return (type === "nfx") ?
        data.netflixDate : (type === "hbg") ?
            data.hbogoDate : data.releaseDate
}

function insertOnDataBase(type, result) {

    if (!result) {
        return;
    }

    console.log("[" + printDate(type, result[0]) + "] FILMES PROCESSADOS: " + result.length);
    result.forEach((data, i) => {
        db.query("SELECT id FROM movies WHERE just_watch_id=" + data.idJustWatch, (err, result) => {
            if (err) throw err;
            if (result && result.length > 0) {
                let idMovie = result[0].id;
                console.log("[" + printDate(type, data) + "] (" + i + ") Filme '" + data.title + "' já está presente banco. ID: " + idMovie);

                scoreMovie(idMovie, type, data, i);
                // otherInfoMovie(idMovie, type, data, i);
            } else {
                let insertMovie = "INSERT INTO movies (tmdb_id, imdb_id, just_watch_id," +
                    "release_date, netflix_date, hbo_go_date, title, subtitle, year," +
                    "runtime, movie_age, poster_image, popularity, synopsis, trailer_url," +
                    "netflix_url, hbo_go_url) VALUES (" +
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
                    "'" + data.hbogoURL + "'" +
                    ") ON DUPLICATE KEY UPDATE tmdb_id=VALUES(tmdb_id), imdb_id=VALUES(imdb_id), just_watch_id=VALUES(just_watch_id)," +
                    "release_date=VALUES(release_date), netflix_date=VALUES(netflix_date), hbo_go_date=VALUES(hbo_go_date)," +
                    "title=VALUES(title), subtitle=VALUES(subtitle), year=VALUES(year), runtime=VALUES(runtime), movie_age=VALUES(movie_age)," +
                    "poster_image=VALUES(poster_image), popularity=VALUES(popularity), synopsis=VALUES(synopsis), trailer_url=VALUES(trailer_url)," +
                    "netflix_url=VALUES(netflix_url), hbo_go_url=VALUES(hbo_go_url)";

                db.query(insertMovie, (err, result) => {
                    if (err) throw err;

                    let idMovie = result.insertId;
                    if (idMovie !== 0) {
                        console.log("[" + printDate(type, data) + "] (" + i + ") Filme '" + data.title + "' salvo no banco. ID: " + idMovie);
                        scoreMovie(idMovie, type, data, i);
                        otherInfoMovie(idMovie, type, data, i);
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
            let idMovie = result[0].id;
            console.log("[" + printDate(type, data) + "] (" + i + ") Filme '" + data.title + "' já possui pontuação no banco. ID: " + idMovie);
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

function otherInfoMovie(idMovie, type, data, i) {

    data.director.forEach((credit) => {
        db.query("SELECT id FROM credits WHERE name='" + credit + "'", (err, result) => {
            if (err) throw err;
            if (result && result.length > 0) {
                let idDirector = result[0].id;

                relationCreditMovie(idMovie, idDirector, type, data, credit, 0, i);
            } else {
                db.query("INSERT INTO credits (name) VALUES ('" + credit + "') ON DUPLICATE KEY UPDATE name=VALUES(name)", (err, result) => {
                    if (err) throw err;
                    console.log("[" + printDate(type, data) + "] (" + i + ") Diretor '" + credit + "' salvo no banco");

                    let idDirector = result.insertId;
                    if (idDirector !== 0) {
                        relationCreditMovie(idMovie, idDirector, type, data, credit, 0, i);
                    } else {
                        console.log("[" + printDate(type, data) + "] (" + i + ") Diretor '" + credit + "' já adicionado");
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

                relationCreditMovie(idMovie, idActor, type, data, credit, 1, i);
            } else {
                db.query("INSERT INTO credits (name) VALUES ('" + credit + "') ON DUPLICATE KEY UPDATE name=VALUES(name)", (err, result) => {
                    if (err) throw err;
                    console.log("[" + printDate(type, data) + "] (" + i + ") Ator '" + credit + "' salvo no banco");

                    let idActor = result.insertId;
                    if (idActor !== 0) {
                        relationCreditMovie(idMovie, idActor, type, data, credit, 1, i);
                    } else {
                        console.log("[" + printDate(type, data) + "] (" + i + ") Ator '" + credit + "' já adicionado");
                    }
                });
            }
        });
    });

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

function relationCreditMovie(idMovie, idCredit, type, data, credit, role, i) {
    let sql = "INSERT INTO movies_credits (movie_id, credit_id, role) VALUES ('" + idMovie + "', '" + idCredit +
        "', " + role + ") ON DUPLICATE KEY UPDATE id=id";
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log("[" + printDate(type, data) + "] (" + i + ") Relação entre '" + data.title + "' e '" + credit + "' criada no banco");
    });
}

module.exports = {
    getMovie: getMovie
};
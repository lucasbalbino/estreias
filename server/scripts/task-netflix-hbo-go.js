const mv = require('./server/scripts/just-watch');

const db = require('./server/db');
mv.getMovie("hbo", (result) => {

    if(!result) {
        return;
    }

    result.forEach((data) => {
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
            ") ON DUPLICATE KEY UPDATE id=id";

        db.query(insertMovie, (err, result) => {
            if (err) throw err;
            console.log("Filme '" + data.title + "' salvo no banco");

            let idMovie = result.insertId;
            if (idMovie === 0) {
                db.query("SELECT id FROM movies WHERE just_watch_id=" + data.idJustWatch, (err, result) => {
                    if (err) throw err;
                    idMovie = result[0].id;

                    otherInfoMovie(idMovie, data);
                });
            } else {
                otherInfoMovie(idMovie, data);
            }


        });
    });
});

function otherInfoMovie(idMovie, data) {

    data.director.forEach((credit) => {
        let sql = "INSERT INTO credits (name) VALUES ('" + credit + "') ON DUPLICATE KEY UPDATE id=id";
        db.query(sql, (err, result) => {
            if (err) throw err;
            console.log("Diretor '" + credit + "' salvo no banco");

            let idDirector = result.insertId;
            if (idDirector === 0) {
                db.query("SELECT id FROM credits WHERE name='" + credit + "'", (err, result) => {
                    if (err) throw err;
                    idDirector = result[0].id;

                    sql = "INSERT INTO movies_credits (movie_id, credit_id, role) VALUES ('" + idMovie + "', '" + idDirector +
                        "', 0) ON DUPLICATE KEY UPDATE id=id";
                    console.log(sql);
                    db.query(sql, (err, result) => {
                        if (err) throw err;
                        console.log("Relação entre '" + data.title + "' e '" + credit + "' criada no banco");
                    });
                });
            }
        });
    });

    data.cast.forEach((credit) => {
        let sql = "INSERT INTO credits (name) VALUES ('" + credit + "') ON DUPLICATE KEY UPDATE id=id";
        db.query(sql, (err, result) => {
            if (err) throw err;
            console.log("Ator '" + credit + "' salvo no banco");

            let idActor = result.insertId;
            if (idActor === 0) {
                db.query("SELECT id FROM credits WHERE name='" + credit + "'", (err, result) => {
                    if (err) throw err;
                    idActor = result[0].id;

                    sql = "INSERT INTO movies_credits (movie_id, credit_id, role) VALUES ('" + idMovie + "', '" + idActor +
                        "', 1) ON DUPLICATE KEY UPDATE id=id";
                    db.query(sql, (err, result) => {
                        if (err) throw err;
                        console.log("Relação entre '" + data.title + "' e '" + credit + "' criada no banco");
                    });
                });
            }
        });
    });

    data.genre.forEach((idGenre) => {
        let sql = "INSERT INTO movies_genre (movie_id, genre_just_watch_id) VALUES ('" + idMovie + "', '" + idGenre +
            "') ON DUPLICATE KEY UPDATE id=id";
        db.query(sql, (err, result) => {
            if (err) throw err;
            console.log("Gênero '" + idGenre + "' vinculado ao filme '" + data.title + "' no banco");
        });
    });

    let scoreIMDB = 0, scoreRT = 0, scoreMC = 0;
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

    let sql = "INSERT INTO score(movie_id, imdb, rt, mc) VALUES ('" + idMovie + "', '" + scoreIMDB + "', '" + scoreRT +
        "', '" + scoreMC + "') ON DUPLICATE KEY UPDATE id=id";

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Pontuação IMDb - '" + scoreIMDB + "' vinculada ao filme '" + data.title + "' no banco");
        console.log("Pontuação Rotten Tomatoes - '" + scoreRT + "' vinculada ao filme '" + data.title + "' no banco");
        console.log("Pontuação Metacritic - '" + scoreMC + "' vinculada ao filme '" + data.title + "' no banco");
    });
}
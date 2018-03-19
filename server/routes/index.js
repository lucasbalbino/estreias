const express = require('express');
const fs = require('fs');
const moment = require('moment');
const db = require('../db');
const router = express.Router();

router.get('/api/dashboard', (req, res) => {
    fs.readFile('dashboard.json', 'utf8', (err, data) => {
        if (err) throw err;
        obj = JSON.parse(data);
        // setTimeout((function() {res.send(JSON.stringify(obj))}), 1000);
        res.send(JSON.stringify(obj));
    });
});

router.get('/api/estreias/:type/:date', (req, res) => {
    let type = req.params.type;
    let date = req.params.date;
    console.log(type, date);

    if (type !== "netflix") {
        fs.readFile(type + '.json', 'utf8', (err, data) => {
            if (err) throw err;
            obj = JSON.parse(data);
            // setTimeout((function() {res.send(JSON.stringify(obj))}), 5000);
            res.send(JSON.stringify(obj));
        });
    } else {
        let movies = {
            "date": date,
            "nextDate": "2018-02-26",
            "previousDate": "2018-02-12",
            "count": 0,
            "content": []
        };

        let sql = `SELECT
        id, tmdb_id AS "idTMDB", imdb_id AS "idIMDB", just_watch_id AS "idJustWatch", DATE_FORMAT(release_date, "%d/%m/%Y") AS "releaseDate",
        DATE_FORMAT(netflix_date, "%d/%m/%Y") AS "netflixDate", DATE_FORMAT(hbo_go_date, "%d/%m/%Y") AS "hbogoDate", title, subtitle, year,
        runtime, movie_age AS "movieAge", poster_image AS "posterImage", synopsis, trailer_url AS "trailerURL", netflix_url AS "netflixURL",
        hbo_go_url AS "hbogoURL"
        FROM movies
        WHERE netflix_date BETWEEN '2018-03-17' AND '2018-03-17'
        ORDER BY popularity DESC`;

        db.query(sql, (err, result) => {
            if (err) throw err;

            movies.count = result.length;

            result.forEach((data, index) => {
                let idMovie = data.id;

                if (data.releaseDate === "00/00/0000") delete data.releaseDate;
                if (data.netflixDate === "00/00/0000") delete data.netflixDate;
                if (data.hbogoDate === "00/00/0000") delete data.hbogoDate;


                db.query("SELECT imdb, rt, mc FROM score WHERE movie_id = " + idMovie, (err, result) => {
                    if (err) throw err;

                    let score = [];
                    Object.keys(result[0]).forEach((k) => {
                        score.push({
                            "type": k,
                            "rating": result[0][k]
                        })
                    });

                    data.score = score;

                    db.query("SELECT DISTINCT(genre_just_watch_id) FROM movies_genre where movie_id = " + idMovie, (err, result) => {
                        if (err) throw err;

                        data.genre = [];
                        result.map((g) => {
                            data.genre.push(g.genre_just_watch_id);
                        });

                        db.query("SELECT DISTINCT(country_id) FROM movies_country where movie_id = " + idMovie, (err, result) => {
                            if (err) throw err;

                            data.country = [];
                            result.map((c) => {
                                data.country.push(c.country_id);
                            });

                            db.query("SELECT DISTINCT(distribution_id) FROM movies_distribution where movie_id = " + idMovie, (err, result) => {
                                if (err) throw err;

                                data.distribution = [];
                                result.map((d) => {
                                    data.distribution.push(d.distribution_id);
                                });

                                db.query(`SELECT DISTINCT(name), role FROM movies_credits
                                    INNER JOIN credits ON credits.id = movies_credits.credit_id
                                    WHERE movie_id = ` + idMovie, (err, result) => {
                                    if (err) throw err;

                                    data.director = [];
                                    data.cast = [];
                                    result.forEach((credit) => {
                                        (credit.role === 0) ?
                                            data.director.push(credit.name) :
                                            data.cast.push(credit.name);
                                    });

                                    movies.content.push(data);

                                    if (index + 1 === movies.count) {
                                        res.send(movies);
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
    }
});


router.get('/api/genres', (req, res) => {
    db.query('SELECT * FROM genre', (err, result) => {
        if (err) throw err;

        res.send(result);
    });
});

router.get('/api/country', (req, res) => {
    db.query('SELECT * FROM country', (err, result) => {
        if (err) throw err;

        res.send(result);
    });
});

router.get('/api/distribution', (req, res) => {
    db.query('SELECT * FROM distribution', (err, result) => {
        if (err) throw err;

        res.send(result);
    });
});

module.exports = router;
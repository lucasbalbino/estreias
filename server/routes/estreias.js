const db = require('../db');
const moment = require('moment');

const THURSDAY = 4;

function isTV(type) {
    return (type === "netflix" || type === "hbo-go");
}

let estreias = {

        getEstreias: (req, res) => {
            let type = req.params.type;
            let date = moment(req.params.date, "YYYY-MM-DD");

            if (!isTV(type)) {
                date = (date.isoWeekday() < THURSDAY) ?
                    date.isoWeekday(THURSDAY - 1) :
                    date.add(1, 'weeks').isoWeekday(THURSDAY - 1);
            }
            console.log("BUSCANDO Estreias '" + type + "' com a seguinte data: " + date.format("YYYY-MM-DD"));

            let nextDate = moment(date).add(7, "days");
            let previousDate = moment(date).subtract(7, "days");

            let dateType = "";
            if (type === "netflix") {
                dateType = "netflix_date";
            } else if (type === "hbo-go") {
                dateType = "hbo_go_date";
            } else {
                dateType = '(netflix_url = "" AND hbo_go_url = "") AND release_date';
            }

            let movies = {
                "date": date.format("YYYY-MM-DD"),
                "nextDate": isTV(type) ?
                    (
                        (moment().isSameOrAfter(nextDate)) ? nextDate.format("YYYY-MM-DD") : ""
                    ) : nextDate.format("YYYY-MM-DD"),
                "previousDate": previousDate.format("YYYY-MM-DD"),
                "count": 0,
                "content": []
            };

            let sql = `SELECT
        id, popularity, tmdb_id AS "idTMDB", imdb_id AS "idIMDB", just_watch_id AS "idJustWatch", DATE_FORMAT(release_date, "%d/%m/%Y") AS "releaseDate",
        DATE_FORMAT(netflix_date, "%d/%m/%Y") AS "netflixDate", DATE_FORMAT(hbo_go_date, "%d/%m/%Y") AS "hbogoDate", title, subtitle, year,
        runtime, movie_age AS "movieAge", poster_image AS "posterImage", synopsis, trailer_url AS "trailerURL", netflix_url AS "netflixURL",
        hbo_go_url AS "hbogoURL", is_3d AS "is3D", is_imax AS "isIMAX"
        FROM movies
        WHERE ` + dateType + " BETWEEN '" + previousDate.add(1, "days").format("YYYY-MM-DD") + "' AND '" + date.format("YYYY-MM-DD") + "'" +
                " ORDER BY popularity DESC";

            db.query(sql, (err, result) => {
                if (err) throw err;

                movies.count = result.length;
                console.log("FILMES ENCONTRADOS: " + movies.count);

                if (movies.count === 0) {
                    res.send(movies);
                } else {
                    let itemsProcessed = 0;
                    result.forEach((data, index) => {
                        let idMovie = data.id;

                        if (data.releaseDate === "00/00/0000") delete data.releaseDate;
                        if (data.netflixDate === "00/00/0000") delete data.netflixDate;
                        if (data.hbogoDate === "00/00/0000") delete data.hbogoDate;


                        db.query("SELECT imdb, rt, mc FROM score WHERE movie_id = " + idMovie, (err, result) => {
                            if (err) throw err;

                            if (result.length > 0) {
                                let score = [];
                                Object.keys(result[0]).forEach((k) => {
                                    score.push({
                                        "type": k,
                                        "rating": result[0][k]
                                    })
                                });

                                data.score = score;
                            }

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

                                            itemsProcessed++;
                                            if (itemsProcessed === movies.count) {
                                                movies.content.sort((a, b) => b.popularity - a.popularity);
                                                res.send(movies);
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
            });
        }
    }
;

module.exports = estreias;
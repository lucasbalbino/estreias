const db = require('../db');
const moment = require('moment');

const THURSDAY = 4;
const QTD_ESTREIAS = 5;
const TOTAL_SQL = 6;

function getSQL(append, isCount) {
    if (isCount) {
        return 'SELECT COUNT(*) as "count" FROM movies WHERE ' + append;
    } else {
        return 'SELECT id, title, subtitle, poster_image AS "posterImage" FROM movies WHERE ' +
            append + " ORDER BY popularity DESC LIMIT " + QTD_ESTREIAS;
    }
}

let dashboard = {

        getResumo: (req, res) => {
            let sqlProcessed = 0;
            console.log("BUSCANDO Dashboards");

            let dash = {
                "cinema": {
                    "date": (moment().isoWeekday() < THURSDAY) ?
                        moment().isoWeekday(THURSDAY - 1).format("YYYY-MM-DD") :
                        moment().add(1, 'weeks').isoWeekday(THURSDAY - 1).format("YYYY-MM-DD")
                },
                "netflix": {
                    "date": moment().format("YYYY-MM-DD")
                },
                "hbo-go": {
                    "date": moment().format("YYYY-MM-DD")
                }
            };

            let appendCinema = "(netflix_url = '' AND hbo_go_url = '') AND release_date BETWEEN '" +
                moment(dash.cinema.date, "YYYY-MM-DD").subtract(6, "days").format("YYYY-MM-DD") + "' AND '" +
                dash.cinema.date + "'";

            let appendNetflix = "netflix_date BETWEEN '" +
                moment(dash.netflix.date, "YYYY-MM-DD").subtract(6, "days").format("YYYY-MM-DD") +
                "' AND '" + dash.netflix.date + "'";

            let appendHBOGo = "hbo_go_date BETWEEN '" +
                moment(dash["hbo-go"].date, "YYYY-MM-DD").subtract(6, "days").format("YYYY-MM-DD") +
                "' AND '" + dash["hbo-go"].date + "'";


            db.query(getSQL(appendCinema, true), (err, result) => {
                if (err) throw err;
                dash.cinema.count = result[0].count;

                sqlProcessed++;
                if (sqlProcessed === TOTAL_SQL) {
                    res.send(dash);
                }
            });

            db.query(getSQL(appendNetflix, true), (err, result) => {
                if (err) throw err;
                dash.netflix.count = result[0].count;

                sqlProcessed++;
                if (sqlProcessed === TOTAL_SQL) {
                    res.send(dash);
                }
            });

            db.query(getSQL(appendHBOGo, true), (err, result) => {
                if (err) throw err;
                dash["hbo-go"].count = result[0].count;

                sqlProcessed++;
                if (sqlProcessed === TOTAL_SQL) {
                    res.send(dash);
                }
            });


            db.query(getSQL(appendCinema, false), (err, result) => {
                if (err) throw err;
                dash.cinema.content = result;

                sqlProcessed++;
                if (sqlProcessed === TOTAL_SQL) {
                    res.send(dash);
                }
            });

            db.query(getSQL(appendNetflix, false), (err, result) => {
                if (err) throw err;
                dash.netflix.content = result;

                sqlProcessed++;
                if (sqlProcessed === TOTAL_SQL) {
                    res.send(dash);
                }
            });

            db.query(getSQL(appendHBOGo, false), (err, result) => {
                if (err) throw err;
                dash["hbo-go"].content = result;

                sqlProcessed++;
                if (sqlProcessed === TOTAL_SQL) {
                    res.send(dash);
                }
            });
        }
    }
;

module.exports = dashboard;
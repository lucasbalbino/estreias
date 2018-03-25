const cron = require('node-cron');

let task = require('./task-movies');

let taskCinema = cron.schedule('00 01,07,13,19 * * *', function() {
    task.getMovie("cinema");
});

let taskNetflix = cron.schedule('05 01,07,13,19 * * *', function() {
    task.getMovie("netflix");
});

let taskHBOGo = cron.schedule('10 01,07,13,19 * * *', function() {
    task.getMovie("hbo-go");
});

function startTasks() {
    taskCinema.start();
    taskNetflix.start();
    taskHBOGo.start();
}

function stopTasks() {
    taskCinema.stop();
    taskNetflix.stop();
    taskHBOGo.stop();
}

module.exports = {
    startScheduledTask: startTasks,
    stopScheduledTask: stopTasks
};
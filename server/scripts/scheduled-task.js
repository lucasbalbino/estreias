const cron = require('node-cron');

let task = require('./task-movies');

let scheduledTask = cron.schedule('10 01,07,13,19 * * *', function() {
    console.log("INICIANDO TAREFA AGENDADA");
    task.getMovie("cinema");
    task.getMovie("netflix");
    task.getMovie("hbo-go");
});

function startTasks() {
    console.log("Tarefa agendada configurada");
    scheduledTask.start();
}

function stopTasks() {
    scheduledTask.stop();
}

module.exports = {
    startScheduledTask: startTasks,
    stopScheduledTask: stopTasks
};
const mysql = require('mysql');

const db_config = {
    host: 'mysql472.umbler.com',
    user: 'user-api',
    password: 'g2eB#H2TOQ-',
    port: 3306,
    database: 'estreias_db'
};

//-
//- Create the connection variable
//-
let connection = mysql.createPool(db_config);


//-
//- Establish a new connection
//-
connection.getConnection(function(err){
    if(err) {
        // mysqlErrorHandling(connection, err);
        console.log("*** Cannot establish a connection with the database. ***");

        connection = reconnect(connection);
    }else {
        console.log("*** New connection established with the database. ***")
    }
});


//-
//- Reconnection function
//-
function reconnect(connection){
    console.log("New connection tentative...");

    //- Create a new one
    connection = mysql.createPool(db_config);

    //- Try to reconnect
    connection.getConnection(function(err){
        if(err) {
            //- Try to connect every 2 seconds.
            setTimeout(reconnect(connection), 2000);
        }else {
            console.log("*** New connection established with the database. ***")
            return connection;
        }
    });
}


//-
//- Error listener
//-
connection.on('error', function(err) {

    //-
    //- The server close the connection.
    //-
    if(err.code === "PROTOCOL_CONNECTION_LOST"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        return reconnect(connection);
    }

    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        return reconnect(connection);
    }

    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        return reconnect(connection);
    }

    else if(err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
    }

    else{
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        return reconnect(connection);
    }

});


//-
//- Export
//-
module.exports = connection;
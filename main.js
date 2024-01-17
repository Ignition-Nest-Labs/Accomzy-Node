const mysql = require('mysql');
const { dbLocalConfig } = require('./src/database/config');


// Replace these values with your database configuration
const dbconfig = dbLocalConfig
const dbConfig = {
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.dbPassword,
    database: dbconfig.dbName,
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Function to empty all tables in the database
 async function emptyAllTables() {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            return;
        }

        // Get a list of all tables in the database
        connection.query('SHOW TABLES', (error, results) => {
            if (error) {
                console.error('Error getting tables:', error);
                connection.release();
                return;
            }

            // Iterate through each table and delete all rows
            results.forEach((table) => {
                const tableName = table[`Tables_in_${dbConfig.database}`];
                connection.query(`DELETE FROM ${tableName}`, (deleteError) => {
                    if (deleteError) {
                        console.error(`Error deleting rows from ${tableName}:`, deleteError);
                    } else {
                        console.log(`Emptied table: ${tableName}`);
                    }
                });
            });

            // Release the connection
            connection.release();
            return 0;
        });
    });
}

// Call the function to empty all tables
console.log('Emptying all tables...');
emptyAllTables();
console.log('Done!');
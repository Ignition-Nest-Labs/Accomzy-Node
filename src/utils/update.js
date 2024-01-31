const fs = require('fs');
const mysql = require('mysql');

// Load the JSON file
const jsonData = JSON.parse(fs.readFileSync('Colleges.json', 'utf8'));

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Accomzy',
};

// Create a connection to the database
const connection = mysql.createConnection(dbConfig);

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }

  console.log('Connected to the database');

  // Insert college names into the Institutes table
  jsonData.forEach((college) => {
    const collegeName = college.collegeName;
    const sql = 'INSERT INTO Institutes (InstituteName) VALUES (?)';

    connection.query(sql, [collegeName], (error, results, fields) => {
      if (error) {
        console.error('Error inserting data:', error);
      } else {
        console.log(`College name "${collegeName}" inserted successfully`);
      }
    });
  });

  // Close the connection
  connection.end((err) => {
    if (err) {
      console.error('Error closing the database connection:', err);
    } else {
      console.log('Connection closed');
    }
  });
});

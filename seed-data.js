const mysql = require('mysql2');
const DB_NAME = 'Equipment'

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'example',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }

  console.log('Connected to MySQL server');

  // Create the database if it doesn't exist
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;
  connection.query(createDatabaseQuery, (createDatabaseError, createDatabaseResults) => {
    if (createDatabaseError) {
      console.error('Error creating database:', createDatabaseError);
      connection.end();
      return;
    }

    console.log(`Database "${DB_NAME}" created or already exists`);

    // Switch to the created database
    connection.changeUser({ database: DB_NAME }, (changeUserError) => {
      if (changeUserError) {
        console.error('Error switching to database:', changeUserError);
        connection.end();
        return;
      }

      console.log(`Switched to database "${DB_NAME}"`);

      // Define the SQL query to create a table if not exists
      const createTableQuery = `
      CREATE TABLE IF NOT EXISTS equipments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        amount INT NOT NULL,
        quality VARCHAR(255) NOT NULL,
        photo VARCHAR(255) NOT NULL
      )
      
      
`;

  

      // Execute the query to create the table
      connection.query(createTableQuery, (createTableError, createTableResults) => {
        if (createTableError) {
          console.error('Error creating table:', createTableError);
          connection.end();
          return;
        }

        console.log('Table "equipments" created or already exists');

        // Define the SQL query to insert data into the table
        const insertDataQuery = `
        INSERT INTO equipments (name, amount, quality, photo) VALUES
          ('Printer', 3, 'new', 'https://www.rdveikals.lv/images/midi/35a714751b1c0002c396a177200fee27.jpg'),
          ('Camera', 2, 'new', 'https://rukminim2.flixcart.com/image/850/1000/kokdci80/dslr-camera/v/e/x/z-24-200mm-z5-nikon-original-imag2zuekuxgxsgg.jpeg?q=20'),
          ('Mouse', 1, 'new', 'https://m.media-amazon.com/images/I/61CNGisjWUL._AC_UF1000,1000_QL80_.jpg')
    `;
    

        // Execute the query to insert data
        connection.query(insertDataQuery, (insertDataError, insertDataResults) => {
          if (insertDataError) {
            console.error('Error inserting data:', insertDataError);
          } else {
            console.log('Data inserted or already exists');
          }

          // Close the connection
          connection.end();
        });
      });
    });
  });
});

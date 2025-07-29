import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: process.env.SINGLESTORE_CERT?.replace(/\\n/g, "\n"), // convert escaped newlines
  },
  waitForConnections: true,
  connectionLimit: 10,
});

export default connection;
// Import MongoClient from mongodb
import { MongoClient } from 'mongodb';

// Define the host, port, and database from environment variables or use default values
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}/`;

// Define the DBClient class
class DBClient {
  constructor() {
    this.db = null;
    // Connect to the MongoDB server
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
      if (error) console.log(error); // Log any connection errors
      this.db = client.db(database); // Set the database
      this.db.createCollection('users'); // Create a 'users' collection if it doesn't exist
      this.db.createCollection('files'); // Create a 'files' collection if it doesn't exist
    });
  }

  // Check if the database connection is alive
  isAlive() {
    return !!this.db;
  }

  // Get the number of users in the 'users' collection
  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  // Get a user from the 'users' collection based on a query
  async getUser(query) {
    console.log('QUERY IN DB.JS', query);
    const user = await this.db.collection('users').findOne(query);
    console.log('GET USER IN DB.JS', user);
    return user;
  }

  // Get the number of files in the 'files' collection
  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

// Create a new instance of DBClient
const dbClient = new DBClient();

// Export the dbClient instance
export default dbClient;

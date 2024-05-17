// Importing the sha1 hashing function
import sha1 from 'sha1';
// Importing the ObjectId function from the mongodb package to handle MongoDB's unique identifiers
import { ObjectId } from 'mongodb';
// Importing the database client from the utils directory
import dbClient from '../utils/db';
// Importing the redis client from the utils directory
import redisClient from '../utils/redis';

// Defining the UsersController class
class UsersController {
  // Method to create a new user
  static async postNew (request, response) {
    // Destructuring the email and password from the request body
    const { email, password } = request.body;
    // If there is no email in the request body, return a Missing email error
    if (!email) {
      response.status(400).json({ error: 'Missing email' });
    }
    // If there is no password in the request body, return a Missing password error
    if (!password) {
      response.status(400).json({ error: 'Missing password' });
    }

    // Hashing the password using sha1
    const hashPwd = sha1(password);

    try {
      // Getting the users collection from the database
      const collection = dbClient.db.collection('users');
      // Finding a user in the database with the same email
      const user1 = await collection.findOne({ email });

      // If there is a user with the same email, return an Already exist error
      if (user1) {
        response.status(400).json({ error: 'Already exist' });
      } else {
        // Inserting a new user into the database with the email and hashed password
        collection.insertOne({ email, password: hashPwd });
        // Finding the new user in the database
        const newUser = await collection.findOne(
          { email }, { projection: { email: 1 } }
        );
        // Sending the new user's id and email as a response
        response.status(201).json({ id: newUser._id, email: newUser.email });
      }
    } catch (error) {
      // Logging any error that occurs
      console.log(error);
      // Sending a Server error response
      response.status(500).json({ error: 'Server error' });
    }
  }

  // Method to get the current user
  static async getMe (request, response) {
    try {
      // Getting the user's token from the request header
      const userToken = request.header('X-Token');
      const authKey = `auth_${userToken}`;
      // Getting the user's id from the redis client using the token
      const userID = await redisClient.get(authKey);
      // If there is no user id, return an Unauthorized error
      if (!userID) {
        response.status(401).json({ error: 'Unauthorized' });
      }
      // Getting the user from the database using the id
      const user = await dbClient.getUser({ _id: ObjectId(userID) });
      // Sending the user's id and email as a response
      response.json({ id: user._id, email: user.email });
    } catch (error) {
      // Logging any error that occurs
      console.log(error);
      // Sending a Server error response
      response.status(500).json({ error: 'Server error' });
    }
  }
}

// Exporting the UsersController class as a module
export default UsersController;

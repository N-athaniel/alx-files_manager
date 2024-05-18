import sha1 from 'sha1';
// Importing the ObjectId function from the mongodb package to handle MongoDB's unique identifiers
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const UsersController = {
  // Method to create a new user
  async postNew (request, response) {
    const { email, password } = request.body;
    if (!email) {
      response.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      response.status(400).json({ error: 'Missing password' });
    }
    const hashPwd = sha1(password);

    try {
      // Getting the users collection from the database
      const userCollection = dbClient.db.collection('users');
      // Finding a user in the database with the same email
      const user1 = await userCollection.findOne({ email });

      if (user1) {
        response.status(400).json({ error: 'Already exist' });
      } else {
        userCollection.insertOne({ email, password: hashPwd });
        // Finding the new user in the database
        const newUser = await userCollection.findOne(
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
  },

  // Method to get the current user
  async getMe (request, response) {
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

module.exports = UsersController;

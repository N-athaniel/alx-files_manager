// Importing the sha1 hashing function
import sha1 from 'sha1';
// Importing the v4 function from the uuid package to generate unique identifiers
import { v4 as uuidv4 } from 'uuid';
// Importing the redis client from the utils directory
import redisClient from '../utils/redis';
// Importing the database client from the utils directory
import dbClient from '../utils/db';

// Defining the AuthController class
class AuthController {
  // Method to connect a user
  static async getConnect (request, response) {
    // Getting the authorization header from the request
    const authHeader = request.headers.authorization;
    // If there is no authorization header, return an Unauthorized error
    if (!authHeader) {
      response.status(401).json({ error: 'Unauthorized' });
    }
    try {
      // Decoding the authorization header and splitting it into email and password
      const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      const email = auth[0];
      // Hashing the password using sha1
      const pass = sha1(auth[1]);

      // Getting the user from the database using the email
      const user = await dbClient.getUser({ email });

      // If there is no user, return an Unauthorized error
      if (!user) {
        response.status(401).json({ error: 'Unauthorized' });
      }

      // If the hashed password does not match the user's password, return an Unauthorized error
      if (pass !== user.password) {
        response.status(401).json({ error: 'Unauthorized' });
      }

      // Generating a unique token for the user
      const token = uuidv4();
      const key = `auth_${token}`;
      const duration = (60 * 60 * 24);
      // Setting the token in the redis client with a duration of 24 hours
      await redisClient.set(key, user._id.toString(), duration);

      // Sending the token as a response
      response.status(200).json({ token });
    } catch (err) {
      // Logging any error that occurs
      console.log(err);
      // Sending a Server error response
      response.status(500).json({ error: 'Server error' });
    }
  }

  // Method to disconnect a user
  static async getDisconnect (request, response) {
    try {
      // Getting the user's token from the request header
      const userToken = request.header('X-Token');
      // Getting the user's key from the redis client using the token
      const userKey = await redisClient.get(`auth_${userToken}`);
      // If there is no user key, return an Unauthorized error
      if (!userKey) {
        response.status(401).json({ error: 'Unauthorized' });
      }
      // Deleting the user's token from the redis client
      await redisClient.del(`auth_${userToken}`);
      // Sending a Disconnected response
      response.status(204).send('Disconnected');
    } catch (err) {
      // Logging any error that occurs
      console.log(err);
      // Sending a Server error response
      response.status(500).json({ error: 'Server error' });
    }
  }
}

// Exporting the AuthController class as a module
export default AuthController;

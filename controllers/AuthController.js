// Importing the sha1 hashing function
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

// Defining the AuthController class
const AuthController = {
  // Method to connect a user
  async getConnect (request, response) {
    // Getting the authorization header from the request
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    try {

      // Decoding the authorization header and splitting it into email and password
      if (authHeader && authHeader.startsWith('Basic ')) {
        const credentials = authHeader.slice(6);
	const buffer = Buffer.from(credentials, 'base64');
	const decodedCredentials = buffer.toString('utf-8');
	const credentialList = decodedCredentials.split(':');
	const email = credentialList[0];
	const password = credentialList[1]
	const hashpw = sha1(password);
	const user = await dbClient.getUser({ "email": email, "password": hashpw });
	if (!user) {
          response.json({"error": "Unauthorized"});
	};
        if (hashpw !== user.password) {
        response.status(401).json({ error: 'Unauthorized' });
	}

        const token = uuidv4();
	const key = `auth_${token}`;
	const userId = user._id.toString();
	const expire = (60 * 60 * 24);
	await redisClient.set(key, userId, expire);
	response.status(200).json({ "token": token });
      }
    } catch (err) {
      // Logging any error that occurs
      console.log(err);
      response.status(500).json({ error: 'Server error' });
    }
  },

  // Method to disconnect a user
  async getDisconnect (request, response) {
    try {
      // Getting the user's token from the request header
      const userToken = request.header['X-Token'];
      const userKey = await redisClient.get(`auth_${userToken}`);
      if (!userKey) {
        response.status(401).json({ error: 'Unauthorized' });
      }
      // Deleting the user's token from the redis client
      await redisClient.del(`auth_${userToken}`);
      // Sending a Disconnected response
      response.status(204).send();
    } catch (err) {
      // Logging any error that occurs
      console.log(err);
      // Sending a Server error response
      response.status(500).json({ error: 'Server error' });
    }
  }
}

export default AuthController;

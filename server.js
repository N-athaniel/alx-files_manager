// Import the express module
import express from 'express';
// Import the routing controller
import controllerRouting from './routes/index';

// Create an instance of an Express application
const app = express();
// Set the port to the environment variable PORT if it's defined, otherwise default to 5000
const port = process.env.PORT || 5000;

// Add middleware to the application to automatically parse JSON in the request body
app.use(express.json());
// Set up all the routes for the application
controllerRouting(app);

// Start the server on the specified port and log a message to the console once the server is ready
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Export the app instance as a module, allowing it to be imported in other files
export default app;

// MongoClient is a class that allows us to connect to a MongoDB database
// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from "mongodb";

// GOAL: Connect to MongoDB database

// MONGODB_URI is an "environment variable" that contains the "connection string" to the MongoDB database
// if process.env.MONGODB_URI is not defined, throw an error.
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

// we store the connection string in a variable called uri
const uri = process.env.MONGODB_URI;

// options is an object that contains configuration options for the MongoClient
const options = {};

// client variable is an instance of the MongoClient class. It mean that we will use to to connect to the database.
let client;

// clientPromise is a promise that resolves to the client. This is used to connect to the database.
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

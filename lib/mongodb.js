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

// clientPromise is a promise that will be resolved (resolved mean that the promise is fulfilled) when the client connects to the database.
// A promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
// An asynchronous operation is one that allows the computer to “move on” to other tasks while waiting for the asynchronous operation to complete.
let clientPromise;

// In "development mode", use a global variable so that the value is preserved across module reloads caused by HMR (Hot Module Replacement).
// "In production mode", it's best to not use a global variable. Why? Because each instance of the app will create its own connection to the database..it means that we will have multiple connections to the database.
if (process.env.NODE_ENV === "development") {
  // If the client doesn't exist, create it
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// clientPromise here will contain the connection to the database
export default clientPromise;

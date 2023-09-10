// mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
// mongoose is great for modeling and mapping MongoDB data to JavaScript objects. It mean that we can use JavaScript to interact with MongoDB.
import mongoose from "mongoose";

// The "mongooseConnect" function is used to connect to the MongoDB database.
export function mongooseConnect() {
  // If the connection is already open, return a resolved promise. The resolved promise will contain the connection to the database.
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();

    // If the connection is not open, connect to the database and return a promise.
  } else {
    const uri = process.env.MONGODB_URI;

    return mongoose.connect(uri);
  }
}

// mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
import mongoose from "mongoose";

// The mongooseConnect function is used to connect to the MongoDB database.
export function mongooseConnect() {
  // If the connection is already open, return a resolved promise.
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    // If the connection is not open, connect to the database and return a promise.
    const uri = process.env.MONGODB_URI;

    return mongoose.connect(uri);
  }
}

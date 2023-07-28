import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Only allow logins if the user is in this list
const adminEmails = ["comptedunet@gmail.com"];

// This is the configuration for NextAuth that tells it to use MongoDB for storing sessions and users and to use Google for authentication. You can add other providers here too.
export default NextAuth({
  // providers is for configuring the authentication providers that NextAuth uses
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  //adapter is for customizing the database that NextAuth uses to store sessions and users
  adapter: MongoDBAdapter(clientPromise),

  // callbacks is for customizing the session object that is returned to the client
  callbacks: {
    session: ({ session, token, user }) => {
      // Only allow logins if the user is in this list
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
});

import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Only allow logins if the user is in this list
const adminEmails = ["comptedunet@gmail.com"];

export const authOptions = {
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
};

export default NextAuth(authOptions);

// isAdminRequest is a helper function that you can use in your API routes to check if the user is an admin
export async function isAdminRequest(req, res) {
  //getServerSession is a helper function that you can use in your API routes to get the session object for the current request. Here we use it to get the user's email address.
  const session = await getServerSession(req, res, authOptions);

  // Only allow logins if the user is in this list. adminEmails is a list of email addresses that are allowed to log in.
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw "not an admin";
  }
}

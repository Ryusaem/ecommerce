// clientPromise is for connecting to the MongoDB database. It mean that you can use it to connect to the MongoDB database.
import clientPromise from "@/lib/mongodb";

// MongoDBAdapter is for customizing the database that NextAuth uses to store sessions and users. For example, you can use it to store sessions and users in a MongoDB database.
import { MongoDBAdapter } from "@auth/mongodb-adapter";

// NextAuth goal is to make it easy to add authentication to your Next.js apps and sites.
// getServersession is a helper function that you can use in your API routes to get the session object for the current request. It mean that you can use it to get the user's email address.
import NextAuth, { getServerSession } from "next-auth";

// GoogleProvider is for configuring the Google OAuth provider. It mean that users can log in with their Google account.
import GoogleProvider from "next-auth/providers/google";

//GOAL: Only allow logins if the user is in this list (adminEmails)

// Algorithm:
// 1. Get the session object for the current request (using getServerSession).
// 2. Get the user's email address from the session object (using session.user.email).
// 3. Only allow logins if the user is in this list (adminEmails).
// 4. If the user is in the list (adminEmails), return the session object. Otherwise, return false.

// Only allow logins if the user is in this list
const adminEmails = ["comptedunet@gmail.com"];

export const authOptions = {
  // providers is for configuring the authentication providers that NextAuth uses. Here we configure the Google OAuth provider so that users can log in with their Google account.
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  // secret is for configuring the secret that NextAuth uses to encrypt cookies and tokens. Example: You can use it to set the secret from an environment variable.
  secret: process.env.NEXTAUTH_SECRET,

  //adapter is for customizing the database that NextAuth uses to store sessions and users. Example: You can use it to store sessions and users in a MongoDB database.
  adapter: MongoDBAdapter(clientPromise),

  // callbacks is for customizing the session object that is returned to the client. Example
  callbacks: {
    // session is for customizing the session object that is returned to the client. Example: You can use it to add the user's email address to the session object. Here we add the user's email address to the session object if they are in the adminEmails list.
    // if the user is in the list (adminEmails), return the session object. Otherwise, return false. If it false the user can't login.
    // to get "session", you need to use "getServerSession" in your API routes.
    session: ({ session, token, user }) => {
      // Only allow logins if the user is in this list.
      // If the user is in the list, return the session object. Otherwise, return false.
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};

// NextAuth(authOption) goal is to make it easy to add authentication to your Next.js apps and sites.
export default NextAuth(authOptions);

// isAdminRequest is a helper function that you can use in your API routes to check if the user is an admin. Is this code responsible for login? No, it is not. It is responsible for checking if the user is an admin.
export async function isAdminRequest(req, res) {
  //getServerSession is a helper function that you can use in your API routes to get the session object for the current request. Here we use it to get the user's email address.
  const session = await getServerSession(req, res, authOptions);

  // Only allow logins if the user is in this list. adminEmails is a list of email addresses that are allowed to log in.
  // If the user is not in the list (adminEmails), return an error.
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw "not an admin";
  }
}

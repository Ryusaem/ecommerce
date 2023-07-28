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

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw "not an admin";
  }
}

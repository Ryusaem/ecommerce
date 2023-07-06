import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  // useSession() returns a session object when signed in
  const { data: session } = useSession();
  return (
    <Layout>
      {/* justify-between: space between the two elements */}
      <div className="text-blue-900 flex justify-between">
        <h2>
          {/* the "?"" is optional chaining, it prevents an error if session is null */}
          Hello, <b>{session?.user?.name}</b>
        </h2>
        <div className="flex bg-gray-300 gap-1 text-black">
          <img
            src={session?.user?.image}
            alt=""
            className="w-6 h-6 rounded-full"
          />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}

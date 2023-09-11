// Image is a component from next.js, it will optimize the image for us
import Image from "next/image";

import { useSession } from "next-auth/react";

// Layout contain the Logo component and the Nav component (to display dashboard, product, category, order, and logout)
import Layout from "@/components/Layout";

// GOAL: Create a layout component that will show a login button if the user is not logged in, and show the nav and children (children contain the dashboard, product, category, order, and logout) if the user is logged in.

// Layout → Logo + Nav + children (dashboard, product, etc) →

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

        {/* it will display the user's image  and the user's name*/}
        <div className="flex bg-gray-300 gap-1 text-black">
          <Image
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

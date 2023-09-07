// useSession is a hook from next-auth/react that returns a session object when signed in, or null if not signed in.
// signInt is a function from next-auth/react that will sign the user in with Google
// signOut is a function from next-auth/react that will sign the user out
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

import Logo from "./Logo";
import Nav from "@/components/Nav";

// GOAL: Create a layout component that will show a login button if the user is not logged in, and show the nav and children if the user is logged in.

// - We use it in products.js: contain the list of products
// - We use it in categories.js: contain the list of categories
// - We use it in orders.js: contain the list of orders
// - We use it in index.js: contain the dashboard
// - We use it in products/delete/[...id].js: contain the form to delete a product
// - We use it in products/edit/[...id].js: contain the form to edit a product
// - We use it in new.js: contain the form to create a new product

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();

  // if the user is not logged in, show a login button
  if (!session) {
    return (
      <div className="bg-bgGray w-screen h-screen flex items-center">
        <div className="text-center w-full">
          {/* onClick={() => signIn("google")} is a function (from nextAuth) that will sign the
          user in with Google */}
          <button
            onClick={() => signIn("google")}
            className="bg-white p-2 px-4 rounded-lg"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }
  // If the user is logged in, show the nav and children
  return (
    // min-h-screen: minimum height of the screen. it means that the div will always be at least the height of the screen.
    <div className="bg-bgGray min-h-screen">
      {/* responsive: for desktop view*/}

      {/* This block of code is mainly for mobile view */}
      {/* block md:hidden: This means the element will be displayed as a block (taking up the full width) on small screens and will be HIDEN on medium and large screens. */}
      <div className="md:hidden flex items-center p-4">
        {/* This button is displayed on mobile view to toggle the navigation */}
        <button onClick={() => setShowNav(true)}>
          {/* Hamburger menu icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {/* Displaying the Logo */}
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>

      {/* This block of code is mainly for desktop view */}
      <div className="flex">
        {/* Nav is the navigation bar */}
        <Nav show={showNav} />
        {/* It will show the content of the page when a user click on an element of the Nav bar */}
        <div className="flex-grow p-4">{children}</div>
      </div>
    </div>
  );
}

// On mobile: The hamburger menu button and logo are visible. The main navigation (Nav) is hidden by default and can be shown when the hamburger menu button is clicked.
// On desktop: The hamburger menu button and logo are hidden, and the main navigation is always visible alongside the main content.
// To understand this better, imagine viewing the website on your phone: you'd see the logo and a hamburger menu icon. If you click the hamburger menu, the navigation (Nav) would slide in or appear. On a desktop, however, you'd always see the navigation without needing to click anything.

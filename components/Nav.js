import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "./Logo";

// GOAL: create a sidebar with links to the dashboard, products, categories, orders, and settings

// Algorithm:
// 1. Create a Nav component
// 2. Create a Link component for each page
// 3. Create a logout button
// 4. Create a function that will sign the user out
// 5. Create a function that will hide and show the sidebar (for mobile view)
// 6. Create a function that will highlight the current page
// 7. Create a function that will redirect the user to the home page

export default function Nav({ show }) {
  // inactiveLink and activeLink are classes for the links
  // when we are on the current page, we want to highlight the link
  const inactiveLink = "flex gap-1 p-1";
  const activeLink = inactiveLink + " bg-highlight text-black rounded-sm";

  // inactiveIcon and activeIcon are classes for the icons
  // when we are on the current page, we want to highlight the icon
  const inactiveIcon = "w-6 h-6";
  const activeIcon = inactiveIcon + " text-primary";

  // using router will allow us to get the current path
  const router = useRouter();
  // pathname is a specific property of the router object that contains the path of the current URL (destructuring)
  const { pathname } = router;

  // logout is a function that will sign the user out
  async function logout() {
    // router.push("/") mean that we are redirecting the user to the home page
    await router.push("/");
    // signOut is a function from next-auth/react that will sign the user out
    await signOut();
  }

  return (
    // aside is a tag for sidebars
    <aside
      className={
        // if show is true, we want to show the sidebar, otherwise we want to hide it.
        // left-0: we want to align the sidebar to the left
        // -left-full: we want to hide the sidebar
        (show ? "left-0" : "-left-full") +
        // top-0: Aligns the top of the <aside> with the top of its containing element.
        // fixed: Fixes the position of the <aside> relative to the browser window.
        // w-full: Makes the <aside> take the full width of its containing element.
        // h-full: Makes the <aside> take the full height of its containing element.
        // md:static: On medium-sized screens and larger (md:), this makes the <aside> have a static position (i.e., it scrolls with the rest of the content and it will always visible).
        // md:w-auto: On medium-sized screens and larger, this makes the <aside> take an automatic width based on its content rather than filling its containing element.
        // transition-all: Smoothens any transitions that might affect the <aside>, for instance, when changing its position.
        " top-0 text-gray-500 p-4 fixed w-full bg-bgGray h-full md:static md:w-auto transition-all"
      }
    >
      {/* we are using flex to align the icon and text */}
      <div className="mb-4 mr-4">
        <Logo />
      </div>
      {/* we are using flex-col to align the links vertically */}
      <nav className="flex flex-col gap-2">
        <Link
          href={"/"}
          className={pathname === "/" ? activeLink : inactiveLink}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={pathname === "/" ? activeIcon : inactiveIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          Dashboard
        </Link>
        <Link
          href={"/products"}
          className={pathname.includes("/products") ? activeLink : inactiveLink}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={
              pathname.includes("/products") ? activeIcon : inactiveIcon
            }
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
          Products
        </Link>
        <Link
          href={"/categories"}
          className={
            pathname.includes("/categories") ? activeLink : inactiveLink
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={
              pathname.includes("/categories") ? activeIcon : inactiveIcon
            }
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          Categories
        </Link>
        <Link
          href={"/orders"}
          className={pathname.includes("/orders") ? activeLink : inactiveLink}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={pathname.includes("/orders") ? activeIcon : inactiveIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
            />
          </svg>
          Orders
        </Link>
        <Link
          href={"/settings"}
          className={pathname.includes("/settings") ? activeLink : inactiveLink}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={
              pathname.includes("/settings") ? activeIcon : inactiveIcon
            }
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Settings
        </Link>

        <button
          className={inactiveLink}
          onClick={logout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          Logout
        </button>
      </nav>
    </aside>
  );
}

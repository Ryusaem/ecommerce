// BounceLoader is a loading spinner from react-spinners
// source: https://www.npmjs.com/package/react-spinners
import { BounceLoader } from "react-spinners";

// GOAL: Create a loading spinner (for when the user is waiting for the page to load)

// We use it in:
// - ProductForm.js

export default function Spinner() {
  return (
    <BounceLoader
      color={"#1E3A8A"}
      speedMultiplier={2}
    />
  );
}

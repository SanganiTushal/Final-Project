import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import Error from "./components/Error";
import Home, { loader as homeLoader } from "./Pages/Home";
import About from "./Pages/About";
import Profile from "./Pages/Profile";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import CreateListing from "./Pages/CreateList";
import EditListing from "./Pages/EditListing";
import PerticularListing from "./Pages/PerticularListing";
import PrivateRoute from "./components/PrivateRoute";
import SearchResults, {
  loader as searchListingLoader,
} from "./Pages/SearchResults";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: homeLoader,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "/profile",
            element: <Profile />,
          },
        ],
      },
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/edit-listing",
        element: <EditListing />,
      },
      {
        path: "/create-listing",
        element: <CreateListing />,
      },
      {
        path: "/listing/:listingId",
        element: <PerticularListing />,
      },
      {
        path: "/search-result",
        element: <SearchResults />,
        loader: searchListingLoader,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

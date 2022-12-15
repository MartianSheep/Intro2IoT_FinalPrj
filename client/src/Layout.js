import { Button } from "antd";
import "antd/dist/reset.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/map",
    element: <div>map</div>,
  },
]);

function Layout() {
  return (
    <div className="Layout">
      <RouterProvider router={router} />
    </div>
  );
}

export default Layout;

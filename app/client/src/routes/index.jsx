import { createBrowserRouter } from "react-router-dom";
import ClientLayout from "../layouts/ClientLayout";
import Home from "../pages/client/Home";
import OurBrandsPage from "../pages/client/OurBrandsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "our-brand", element: <OurBrandsPage /> },
      // { path: "about", element: <About /> },
      // { path: "collections", element: <Collections /> },
      // ...add the rest of your client/ pages here as you build them
    ],
  },
  // Admin and Auth routers get their own top-level entries here later,
  // each pointing at AdminLayout / AuthLayout the same way.
]);

export default router;

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout";
import Home from "./pages/home";
import Categories from "./pages/categories";
import CategoryPage from "./pages/categoryPage";
import Products from "./pages/products";
import ProductPage from "./pages/productPage";
import Sales from "./pages/sales";
import Cart from "./pages/cart";
import NotFound from "./pages/notFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "categories", element: <Categories /> },
      { path: "categories/:id", element: <CategoryPage /> },
      { path: "products", element: <Products /> },
      { path: "products/:id", element: <ProductPage /> },
      { path: "sales", element: <Sales /> },
      { path: "cart", element: <Cart /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

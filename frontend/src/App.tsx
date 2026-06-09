import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoutes } from "./context/ProtectedRoutes";
import OnlineStatus from "./components/OnlineStatus";

import Access from "./pages/Access";
import NotFound from "./pages/NotFound";
import UnAuthorized from "./pages/UnAuthorized";

import Landing from "./pages/Landing";
import HelpDesk from "./pages/Help Desk";
import Products from "./pages/Products";
import Services from "./pages/Services";
import AboutUs from "./pages/About Us";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import StockHub from "./pages/StockHub";
import Contribute from "./pages/Contribute";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing/>
  },
  {
    path: '/marketplace',
    element: <Marketplace/>
  },
  {
    path: '/login',
    element: <Access accessType="login"/>
  },
  {
    path: '/sign-up',
    element: <Access accessType="signup"/>
  },
  {
    path: '/unauthorized',
    element: <UnAuthorized/>
  },
  {
    path: '/help-desk',
    element: <HelpDesk/>
  },
  {
    path: '/products',
    element: <Products/>
  },
  {
    path: '/services',
    element: <Services/>
  },
  {
    path: '/about-us',
    element: <AboutUs/>
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: '/my-dashboard',
        element: <Dashboard/>
      },
      {
        path: '/stocks',
        element: <StockHub/>
      },
      {
        path: '/contribute',
        element: <Contribute/>
      }
    ]
  },
  {
    path: '*',
    element: <NotFound/>
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router}/>
      <OnlineStatus />
    </AuthProvider>
  );
}

export default App;

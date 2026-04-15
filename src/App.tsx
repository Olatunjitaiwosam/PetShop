import { Route, Routes } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { OrdersPage } from "./pages/OrdersPage";
import ExhibitionPage from "./components/ExhibitionPage";
import Footers from "./components/Footers";
import { useWalletAuth } from './hooks/useWalletAuth';

export const App = () => {
  useWalletAuth();
  return (
    <>
      <Navigation />
      <Routes>
        <Route path='/' element={<ExhibitionPage/>} />
        <Route path='/orders' element={<OrdersPage/>} />
      </Routes>
      <Footers/>
    </>
  );
}

export default App;

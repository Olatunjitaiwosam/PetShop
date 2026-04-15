import { Route, Routes } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { AboutPage } from "./pages/AboutPage";
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
        <Route path='/about' element={<AboutPage/>} />
      </Routes>
      <Footers/>
    </>
  );
}

export default App;

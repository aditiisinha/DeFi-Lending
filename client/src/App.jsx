import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Home from "./pages/Home";
import Deposit from "./pages/Deposit"; 
import BorrowLoan from "./pages/BorrowLoan";
import PayLoan from "./pages/PayLoan";
import InvestNow from "./pages/InvestNow";
import MyInvestments from "./pages/MyInvestments";
import MyNft from "./pages/MyNft";
import BuyNft from "./pages/BuyNft";
import MintNft from "./pages/MintNft";
import Dashboard from "./pages/Dashboard";
import ChatbotEmbed from "./CHATBOTEMBED.JS";

const AppContent = () => {
  const location = useLocation();
  const hideHeaderFooter =
    location.pathname === "/signup" ||
    location.pathname === "/" ||
    location.pathname === "/signin";

  return (
    <>
      {!hideHeaderFooter && <Navbar />}
      <div className="toast-wrapper">
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          style={{ zIndex: 99999 }}
          className="toast-container"
        />
      </div>

      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/borrow" element={<BorrowLoan />} />
          <Route path="/payloan" element={<PayLoan />} />
          <Route path="/invest" element={<InvestNow />} />
          <Route path="/my-investments" element={<MyInvestments />} />
          <Route path="/my-nft" element={<MyNft />} />
          <Route path="/buy-nft" element={<BuyNft />} />
          <Route path="/mint-nft" element={<MintNft />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
      
      {!hideHeaderFooter && <Footer />}
      {!hideHeaderFooter && <ChatbotEmbed />}

    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

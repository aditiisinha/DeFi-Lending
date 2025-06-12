import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NFTContext } from "../contexts/NFTcontext";
import "../styles/navbar.css";

const Dropdown = ({ label, name, activeDropdown, setActiveDropdown, navigate, children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown === name) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown, name, setActiveDropdown]);

  return (
    <div className="navbar-link dropdown" ref={ref}>
      <span
        onClick={() => setActiveDropdown(activeDropdown === name ? null : name)}
        aria-haspopup="true"
        aria-expanded={activeDropdown === name}
        tabIndex={0}
        style={{ cursor: "pointer", userSelect: "none" }}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            setActiveDropdown(activeDropdown === name ? null : name);
          }
        }}
      >
        {label} ▾
      </span>

      {activeDropdown === name && (
        <div className="dropdown-menu" role="menu">
          {React.Children.map(children, (child) => {
            const to = child.props.to;
            return (
              <div
                className="dropdown-item"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveDropdown(null);
                  if (to && navigate) {
                    navigate(to);
                  }
                }}
              >
                {child.props.children}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const { connectWallet, connectedAccount, disconnectWallet } = React.useContext(NFTContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    disconnectWallet();
    setIsAuthenticated(false);
    navigate("/signin");
  };

  const hideNavbarRoutes = ["/signup", "/signin"];
  if (hideNavbarRoutes.includes(location.pathname)) return null;

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        <Link to="/home" className="navbar-brand">FINCRYPT</Link>

        <button
          className="navbar-mobile-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <XMarkIcon className="navbar-icon" /> : <Bars3Icon className="navbar-icon" />}
        </button>

        <div className={`navbar-links${isOpen ? " navbar-links-mobile" : ""}`}>
          {isAuthenticated && (
            <>
              <Link to="/home" className="navbar-link" onClick={() => setActiveDropdown(null)}>Home</Link>
              <Link to="/deposit" className="navbar-link" onClick={() => setActiveDropdown(null)}>Deposit</Link>

              <Dropdown
                label="Loan"
                name="loan"
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                navigate={navigate}
              >
                <span to="/borrow">Borrow Loan</span>
                <span to="/payloan">Pay Loan</span>
              </Dropdown>

              <Dropdown
                label="Invest"
                name="invest"
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                navigate={navigate}
              >
                <span to="/invest">Invest Now</span>
                <span to="/my-investments">My Investments</span>
              </Dropdown>

              <Dropdown
                label="NFT's"
                name="nft"
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                navigate={navigate}
              >
                <span to="/my-nft">My NFTs</span>
                <span to="/buy-nft">Buy NFT</span>
                <span to="/mint-nft">Mint NFT</span>
              </Dropdown>

              <Link to="/dashboard" className="navbar-link" onClick={() => setActiveDropdown(null)}>Dashboard</Link>

              {!connectedAccount ? (
                <button onClick={connectWallet} className="navbar-link">
                  Connect Wallet
                </button>
              ) : (
                <span className="navbar-link" style={{ cursor: "default" }}>
                  {connectedAccount.substring(0, 6)}...{connectedAccount.slice(-4)}
                </span>
              )}

              <button onClick={handleLogout} className="navbar-link">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import '../styles/home.css';

import {
  FaWallet, FaPiggyBank, FaArrowDown, FaCoins, FaChartLine,
  FaShoppingCart, FaPaintBrush, FaImage, FaTachometerAlt, FaPlug
} from 'react-icons/fa';

const cardData = [
  { title: 'Deposit', icon: <FaPiggyBank />, route: '/deposit' },
  { title: 'Borrow', icon: <FaArrowDown />, route: '/borrow' },
  { title: 'Pay Loan', icon: <FaCoins />, route: '/payloan' },
  { title: 'Invest Now', icon: <FaChartLine />, route: '/invest' },
  { title: 'My Investment', icon: <FaWallet />, route: '/my-investments' },
  { title: 'BUY NFTs', icon: <FaShoppingCart />, route: '/buy-nft' },
  { title: 'MINT NFTs', icon: <FaPaintBrush />, route: '/mint-nft' },
  { title: 'MY NFTs', icon: <FaImage />, route: '/my-nft' },
  { title: 'Dashboard', icon: <FaTachometerAlt />, route: '/dashboard' }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="card-grid">
        {cardData.map((card, index) => (
          <AnimatedCard
            key={index}
            icon={card.icon}
            title={card.title}
            onClick={() => navigate(card.route)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

const AnimatedCard = ({ icon, title, onClick, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const initialX = index % 2 === 0 ? -100 : 100;

  React.useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: 'easeOut', delay: index * 0.1 }
      });
    }
  }, [controls, inView, index]);

  return (
    <motion.div
      ref={ref}
      className="card"
      onClick={onClick}
      initial={{ opacity: 0, x: initialX }}
      animate={controls}
      whileHover={{ scale: 1.05 }}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-icon">{icon}</div>
      <span className="card-title">{title}</span>
    </motion.div>
  );
};

export default Home;

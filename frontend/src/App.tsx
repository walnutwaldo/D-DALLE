import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Bounties from './components/Bounties';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Header />
      <Bounties />
      <Footer />
    </div>
  );
}

export default App;

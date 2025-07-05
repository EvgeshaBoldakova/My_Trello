import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { JSX } from 'react';
import './App.css';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';

export function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </Router>
  );
}

export default App;

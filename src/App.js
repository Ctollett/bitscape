import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';



function App() {
  return (
    <Router>
      <div className="App">
        <Routes> {/* Wrap your Route components with Routes */}
          <Route exact path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}
 
export default App;



import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home/Home';
import Error404 from './Error/Error404';

function App() {
  return (
        <Router>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="*" element={<Error404/>} />
          </Routes>
        </Router>
  );
}

export default App;

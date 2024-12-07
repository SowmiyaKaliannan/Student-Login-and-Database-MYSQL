import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage'; // Adjust path as needed
import NavigationPage from './NavigationPage'; // Adjust path as needed
import Signup from './Signup'; // Import Signup component
import StudentInfo from './StudentInfo'; // Adjust path as needed
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <NavigationPage isLoggedIn={isLoggedIn} />
      <div className="container mt-5">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/information" /> : <LoginPage onLogin={() => setIsLoggedIn(true)} />
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/information"
            element={isLoggedIn ? <StudentInfo /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

// // components/routes/PrivateRoute.jsx
// import React from "react";
// import { Navigate } from "react-router-dom";
// import jwtDecode from "jwt-decode"; // ✅ Install this via `npm install jwt-decode`

// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   try {
//     const decoded = jwtDecode(token);
//     const currentTime = Date.now() / 1000;

//     if (decoded.exp < currentTime) {
//       localStorage.removeItem("token");
//       return <Navigate to="/login" />;
//     }

//     return children;
//   } catch (err) {
//     console.error("Token decode error:", err);
//     localStorage.removeItem("token");
//     return <Navigate to="/login" />;
//   }
// };

// export default PrivateRoute;

// components/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

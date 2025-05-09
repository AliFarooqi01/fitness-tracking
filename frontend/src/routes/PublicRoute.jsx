// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import jwtDecode from 'jwt-decode';

// const PublicRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   console.log("PublicRoute rendered");
//   console.log("Token:", token);

//   if (token) {
//     try {
//       const decoded = jwtDecode(token);
//       console.log("Decoded Token:", decoded);

//       const now = Date.now() / 1000;
//       if (decoded.exp > now) {
//         console.log("Token valid — redirecting to /dashboard");
//         return <Navigate to="/dashboard" />;
//       } else {
//         console.log("Token expired — removing token");
//         localStorage.removeItem("token");
//       }
//     } catch (err) {
//       console.error("JWT Decode error:", err.message);
//       localStorage.removeItem("token");
//     }
//   }

//   console.log("No valid token — rendering children");
//   return children;
// };

// export default PublicRoute;

// components/routes/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;

import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// import { Navigate, Outlet } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import api, { BASE_URL } from '../assets/js/axiosConfig';

// export default function ProtectedRoute() {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     try {

//       await api.get(`${BASE_URL}/verify-auth/`);
//       setIsAuthenticated(true);
//     } catch (err) {
//       console.error('Auth check failed:', err);
//       localStorage.removeItem('user');
//       setIsAuthenticated(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '100vh' 
//       }}>
//         Loading...
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return <Outlet />;
// }
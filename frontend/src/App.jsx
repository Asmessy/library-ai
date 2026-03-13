import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import BookReader from './pages/BookReader';

import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import GhostCursor from './components/GhostCursor';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 relative overflow-hidden">
        <GhostCursor
          color="#B19EEF"
          brightness={1.2}
          edgeIntensity={0}
          trailLength={20}
          inertia={0.4}
          grainIntensity={0.05}
          bloomStrength={0.5}
          bloomRadius={0.7}
          bloomThreshold={0}
          fadeDelayMs={200}
          fadeDurationMs={1000}
          style={{ position: 'fixed' }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-purple-900/10 to-blue-900/10 pointer-events-none" />
        <div className="relative z-10 flex flex-col flex-grow">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8 relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/book-reader/:bookId" element={<BookReader />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<Admin />} />
            </Route>

          </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

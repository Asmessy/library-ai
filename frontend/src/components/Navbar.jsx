import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-indigo-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
              <BookOpen className="w-6 h-6" />
              <span>AI Library</span>
            </Link>
          </div>

          {/* Nav Links */}
          <div className="flex items-center space-x-4">
            <Link to="/catalog" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">Catalog</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">Dashboard</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">Admin</Link>
                )}
                <div className="h-6 w-px bg-slate-200 mx-2"></div>
                <div className="flex items-center gap-4">
                  <span className="text-indigo-600 text-sm font-semibold flex items-center gap-1">
                    <UserIcon className="w-4 h-4" />
                    {user.name}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-slate-500 hover:text-red-500 transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="h-6 w-px bg-slate-200 mx-2"></div>
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">Log in</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

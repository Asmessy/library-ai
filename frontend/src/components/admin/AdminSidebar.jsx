import React from 'react';
import { Home, Users, BookOpen, Settings, BarChart } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" /> },
    { id: 'borrowed', label: 'Borrowed Books', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'books', label: 'Book Management', icon: <Settings className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 min-h-screen p-4 flex flex-col hidden md:flex shrink-0">
      <div className="text-2xl font-bold text-indigo-600 mb-8 px-4 flex items-center gap-2 mt-4">
        <Settings className="w-6 h-6" />
        Admin Panel
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto border-t border-slate-200 pt-4">
        <a href="/" className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium">
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
        </a>
      </div>
    </div>
  );
};

export default AdminSidebar;

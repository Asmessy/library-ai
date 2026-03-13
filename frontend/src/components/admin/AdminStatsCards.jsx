import React from 'react';
import { Users, Library, BookOpen, CheckCircle } from 'lucide-react';

const AdminStatsCards = ({ analytics }) => {
  if (!analytics) return null;

  const stats = [
    {
      title: 'Total Users',
      value: analytics.totalUsers || 0,
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Total Books',
      value: analytics.totalBooks || 0,
      icon: <Library className="w-8 h-8 text-blue-500" />,
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Books Borrowed Today',
      value: analytics.booksBorrowedToday || 0,
      icon: <BookOpen className="w-8 h-8 text-amber-500" />,
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Available Books',
      value: analytics.availableBooks || 0,
      icon: <CheckCircle className="w-8 h-8 text-emerald-500" />,
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
            <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
          </div>
          <div className={`${stat.bgColor} p-3 rounded-xl`}>
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStatsCards;

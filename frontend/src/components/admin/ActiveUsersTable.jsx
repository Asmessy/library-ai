import React from 'react';

const ActiveUsersTable = ({ users }) => {
  if (!users) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] overflow-hidden h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 p-6 pb-2">Active Users</h3>
      <div className="overflow-x-auto flex-1 p-2">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="px-6 py-4">User Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4 text-center">Books Borrowed</th>
              <th className="px-6 py-4 text-right">Last Borrow Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                  No active users found yet.
                </td>
              </tr>
            ) : (
              users.slice(0, 5).map((user, idx) => {
                const date = new Date(user.last_borrow_date);
                const formattedDate = !isNaN(date) ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A';
                
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{user.email || 'N/A'}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-700">{user.books_borrowed}</td>
                    <td className="px-6 py-4 text-right text-slate-500 text-sm whitespace-nowrap">{formattedDate}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveUsersTable;

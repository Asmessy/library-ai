import React from 'react';

const BorrowedBooksTable = ({ borrowings }) => {
  if (!borrowings) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] overflow-hidden h-full flex flex-col mt-8">
      <h3 className="text-lg font-bold text-slate-900 p-6 pb-2">Currently Borrowed Books</h3>
      <div className="overflow-x-auto flex-1 p-2">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="px-6 py-4">User Name</th>
              <th className="px-6 py-4">Book Title</th>
              <th className="px-6 py-4">Borrow Date</th>
              <th className="px-6 py-4 text-right">Return Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {borrowings.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                  No currently borrowed books.
                </td>
              </tr>
            ) : (
              borrowings.slice(0, 10).map((borrowing, idx) => {
                const date = new Date(borrowing.borrow_date);
                const formattedDate = !isNaN(date) ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A';
                
                const isReturned = borrowing.status === 'Returned';

                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{borrowing.user_name}</td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{borrowing.book_title}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm whitespace-nowrap">{formattedDate}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isReturned ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {borrowing.status || 'Pending'}
                      </span>
                    </td>
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

export default BorrowedBooksTable;

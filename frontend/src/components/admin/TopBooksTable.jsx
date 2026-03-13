import React from 'react';

const TopBooksTable = ({ books }) => {
  if (!books) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] overflow-hidden h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 p-6 pb-2">Most Borrowed Books</h3>
      <div className="overflow-x-auto flex-1 p-2">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="px-6 py-4">Book Title</th>
              <th className="px-6 py-4">Author</th>
              <th className="px-6 py-4 text-right">Borrow Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {books.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                  No books have been borrowed yet.
                </td>
              </tr>
            ) : (
              books.slice(0, 5).map((book, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{book.title}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm whitespace-nowrap">{book.author}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm">
                      {book.borrow_count}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopBooksTable;

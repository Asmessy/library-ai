import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { PlusCircle, Users, FileText } from 'lucide-react';

import AdminSidebar from '../components/admin/AdminSidebar';
import AdminStatsCards from '../components/admin/AdminStatsCards';
import BorrowChart from '../components/admin/BorrowChart';
import CategoryPieChart from '../components/admin/CategoryPieChart';
import TopBooksTable from '../components/admin/TopBooksTable';
import ActiveUsersTable from '../components/admin/ActiveUsersTable';
import BorrowedBooksTable from '../components/admin/BorrowedBooksTable';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [books, setBooks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [pdfFile, setPdfFile] = useState(null);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics');
      setAnalytics(res.data);
    } catch(err) {
      console.error('Error fetching analytics', err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchAnalytics();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('category', category);
      formData.append('image_url', imageUrl);
      if (pdfFile) {
        formData.append('pdf', pdfFile);
      }

      await api.post('/books', formData);
      alert('Book added successfully');
      setTitle('');
      setAuthor('');
      setCategory('');
      setImageUrl('');
      setPdfFile(null);
      fetchBooks();
      fetchAnalytics(); // refresh analytics
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding book');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${id}`);
        fetchBooks();
        fetchAnalytics(); // refresh analytics
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting book');
      }
    }
  };

  const renderContent = () => {
    if (activeTab === 'dashboard' || activeTab === 'analytics') {
      return (
        <div className="animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Library Overview</h1>
              <p className="text-slate-500 mt-1">Monitor your library's performance and activity.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setActiveTab('books')}
                className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Add New Book</span>
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className="bg-white text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">View All Users</span>
              </button>
              <button 
                className="bg-white text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors hidden lg:flex"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Library Report</span>
              </button>
            </div>
          </div>
          
          {loading ? (
             <div className="flex items-center justify-center p-20 text-indigo-600 font-medium">Loading Admin Data...</div>
          ) : (
            <>
              <AdminStatsCards analytics={analytics} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <BorrowChart data={analytics?.borrowActivity} />
                <CategoryPieChart data={analytics?.categoryDistribution} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TopBooksTable books={analytics?.topBooks} />
                <ActiveUsersTable users={analytics?.activeUsersTable} />
              </div>

              {activeTab === 'dashboard' && <BorrowedBooksTable borrowings={analytics?.recentBorrowings} />}
            </>
          )}
        </div>
      );
    }

    if (activeTab === 'books') {
      return (
        <div className="animate-in fade-in duration-500 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Book Management</h1>
            <p className="text-slate-500 mt-1">Add new books or remove existing ones from the catalog.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Add New Book</h2>
            <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-slate-900 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Optional" className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-slate-900 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                <input required type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-slate-900 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-slate-900 transition-colors">
                  <option value="">Select Category</option>
                  <option value="Technology">Technology</option>
                  <option value="Self Help">Self Help</option>
                  <option value="Finance">Finance</option>
                  <option value="Fiction">Fiction</option>
                  <option value="History">History</option>
                  <option value="Science">Science</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload PDF</label>
                <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} className="w-full px-2 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white text-slate-900 transition-colors text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              </div>
              <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-indigo-700 transition-colors h-[42px] mb-[2px]">
                Add Book
              </button>
            </form>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Library Catalog Database</h2>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{books.length} Total</span>
            </div>
            
            {loading ? (
              <div className="p-10 text-center text-slate-500">Loading catalog...</div>
            ) : (
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Author</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {books.map(book => (
                      <tr key={book.book_id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 text-sm font-medium text-slate-400">#{book.book_id}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">
                          <div className="flex items-center gap-3">
                            {book.image_url ? 
                              <img src={book.image_url} alt={book.title} className="w-8 h-10 object-cover rounded shadow-sm" /> 
                              : 
                              <div className="w-8 h-10 bg-indigo-50 rounded flex items-center justify-center text-indigo-200">
                                <FileText className="w-4 h-4" />
                              </div>
                            }
                            {book.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{book.author}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200">
                            {book.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            book.availability_status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {book.availability_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDelete(book.book_id)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors opacity-0 group-hover:opacity-100"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'users') {
        return (
            <div className="animate-in fade-in duration-500">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Registered Users</h1>
                    <p className="text-slate-500 mt-1">Manage and view all registered users.</p>
                </div>
                {/* Fallback to ActiveUsersTable showing all or something if we had it, else placeholder */}
                <ActiveUsersTable users={analytics?.activeUsersTable} />
                <p className="text-center text-slate-500 mt-6 text-sm">Showing top active users. Full user management coming soon.</p>
            </div>
        )
    }

    if (activeTab === 'borrowed') {
        return (
            <div className="animate-in fade-in duration-500">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Borrowed Books</h1>
                    <p className="text-slate-500 mt-1">Track all current and past borrowings.</p>
                </div>
                <BorrowedBooksTable borrowings={analytics?.recentBorrowings} />
            </div>
        )
    }

    return (
      <div className="flex items-center justify-center p-20">
         <div className="text-center">
             <h2 className="text-2xl font-bold text-slate-400">Coming Soon</h2>
             <p className="text-slate-500 mt-2">This section is under construction.</p>
             <button onClick={() => setActiveTab('dashboard')} className="mt-6 text-indigo-600 font-medium hover:underline">Back to Dashboard</button>
         </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Admin;

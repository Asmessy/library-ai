import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { BookMarked, Sparkles, Compass } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [personality, setPersonality] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [discoveryBooks, setDiscoveryBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDiscovery, setLoadingDiscovery] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, recsRes, profileRes] = await Promise.all([
        api.get('/dashboard'),
        api.get(`/recommendations/${user.id}`),
        api.get('/profile')
      ]);
      setBorrowedBooks(dashboardRes.data.borrowedBooks);
      setRecommendedBooks(recsRes.data.recommendedBooks);
      setPersonality(profileRes.data.personality);
      setTimeline(profileRes.data.timeline);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDiscoverNew = async () => {
    try {
      setLoadingDiscovery(true);
      const res = await api.get('/recommendations/smart-discovery');
      setDiscoveryBooks(res.data.books);
    } catch(err) {
      console.error(err);
    } finally {
      setLoadingDiscovery(false);
    }
  };

  const handleReturn = async (borrowId) => {
    try {
      await api.post('/borrow/return', { borrowId });
      alert('Book returned successfully!');
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error returning book');
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await api.post('/borrow', { bookId });
      alert("Book borrowed successfully!");
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || "Error borrowing book");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      
      {/* Header section */}
      <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-lg shadow-indigo-500/20">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-indigo-100 text-lg">Manage your currently borrowed books and discover new titles.</p>
      </div>

      {/* Reading Personality & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
          <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Your Reading Personality</h3>
          <div className="text-5xl mb-3">{personality?.emoji || '📚'}</div>
          <div className="text-2xl font-extrabold text-slate-800 mb-2">{personality?.title || 'Loading'}</div>
          <p className="text-slate-500 text-sm leading-relaxed">{personality?.description}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm col-span-1 md:col-span-2 overflow-y-auto max-h-[300px]">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Your Reading Journey</h3>
          {timeline?.length > 0 ? (
            <div className="space-y-0">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="w-16 whitespace-nowrap text-sm text-slate-400 font-medium pt-0.5">
                    {new Date(item.date).toLocaleString('default', { month: 'short' })}
                  </div>
                  <div className="flex-grow border-l-2 border-slate-100 pl-6 pb-6 relative">
                    <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                    <p className="font-bold text-slate-900 leading-tight mb-1">{item.title}</p>
                    <p className="text-sm text-slate-500">by {item.author}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Borrow books to start your reading timeline journey.</p>
          )}
        </div>
      </div>

      {/* Borrowed Books Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <BookMarked className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-slate-900">Your Borrowed Books</h2>
        </div>
        
        {borrowedBooks.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm text-slate-500">
            You haven't borrowed any books yet. Go to the catalog to find your next read!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {borrowedBooks.map((record) => (
              <div key={record.borrow_id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col h-full">
                <img src={record.image_url || 'https://via.placeholder.com/300x450/e2e8f0/475569?text=Cover'} alt={record.title} className="w-full h-56 object-cover rounded-xl mb-4 shadow-sm" />
                <div className="flex-grow mb-4">
                  <div className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 mb-3">
                    {record.category}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{record.title}</h3>
                  <p className="text-slate-500 text-sm">by {record.author}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 mb-4 text-sm">
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Borrowed on:</span>
                    <span className="font-medium text-slate-900">{new Date(record.borrow_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleReturn(record.borrow_id)}
                  className="w-full mt-auto bg-slate-900 text-white font-semibold py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Return Book
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* AI Recommendations Section */}
      <section className="bg-slate-50 rounded-3xl p-8 border border-slate-200/60">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <h2 className="text-2xl font-bold text-slate-900">AI Recommended for You</h2>
        </div>
        
        <p className="text-slate-600 mb-6 max-w-2xl">
          Based on your borrowing history, our AI suggests these titles. 
          {borrowedBooks.length === 0 && ' (Showing popular picks since you have no history yet)'}
        </p>

        {recommendedBooks.length === 0 ? (
          <div className="text-center py-10 text-slate-500">No recommendations available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {recommendedBooks.map((book) => (
              <div key={book.book_id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <img src={book.image_url || 'https://via.placeholder.com/300x450/e2e8f0/475569?text=Cover'} alt={book.title} className="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" />
                <div className="flex-grow">
                  {book.score !== undefined && (
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                        ⭐ {Math.round(book.score * 100)}% Match
                      </span>
                    </div>
                  )}
                  <h3 className="font-bold text-slate-900 text-sm leading-tight mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-slate-500 text-xs mb-3">{book.author}</p>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {book.category}
                  </span>
                </div>
                <button 
                  onClick={() => handleBorrow(book.book_id)}
                  className="w-full mt-4 bg-indigo-50 text-indigo-700 text-xs font-semibold py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  Borrow
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Smart Discovery Section */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Compass className="w-6 h-6 text-teal-500" />
              Smart Discovery
            </h2>
            <p className="text-slate-500 text-sm">Want to try something new? Let AI recommend books from categories you've never explored before.</p>
          </div>
          <button 
            onClick={handleDiscoverNew} 
            disabled={loadingDiscovery}
            className="shrink-0 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 shadow-sm disabled:opacity-50"
          >
            {loadingDiscovery ? 'Discovering...' : 'Discover Something New'}
          </button>
        </div>
        
        {discoveryBooks && discoveryBooks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {discoveryBooks.map((book) => (
              <div key={book.book_id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full bg-slate-50">
                <img src={book.image_url || 'https://via.placeholder.com/300x450/e2e8f0/475569?text=Cover'} alt={book.title} className="w-full h-40 object-cover rounded-lg mb-3 shadow-sm grayscale hover:grayscale-0 transition-all" />
                <div className="flex-grow">
                  <h3 className="font-bold text-slate-900 text-sm leading-tight mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-slate-500 text-xs mb-3">{book.author}</p>
                  <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                    {book.category}
                  </span>
                </div>
                <button 
                  onClick={() => handleBorrow(book.book_id)}
                  className="w-full mt-4 bg-teal-50 text-teal-700 border border-teal-100 text-xs font-bold py-2 rounded-lg hover:bg-teal-600 hover:text-white transition-colors"
                >
                  Borrow
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Dashboard;

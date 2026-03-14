import React, { useState, useEffect, useContext } from 'react';
import api, { BASE_URL } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Search, Book, CheckCircle, Clock, X, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const Catalog = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [alsoBorrowed, setAlsoBorrowed] = useState([]);
  const [loadingAlsoBorrowed, setLoadingAlsoBorrowed] = useState(false);
  
  const { user } = useContext(AuthContext);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/books', {
        params: { search, category }
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search, category]);

  const handleBorrow = async (bookId) => {
    if (!user) {
      alert("Please log in to borrow books.");
      return;
    }
    try {
      await api.post('/borrow', { bookId });
      alert("Book borrowed successfully!");
      fetchBooks(); // Refresh list
    } catch (error) {
      alert(error.response?.data?.message || "Error borrowing book");
    }
  };

  const openBookDetails = async (book) => {
    setSelectedBook(book);
    setLoadingAlsoBorrowed(true);
    try {
      const res = await api.get(`/recommendations/also-borrowed/${book.book_id}`);
      setAlsoBorrowed(res.data.books);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAlsoBorrowed(false);
    }
  };

  const closeBookDetails = () => {
    setSelectedBook(null);
    setAlsoBorrowed([]);
  };

  const categories = ["Technology", "Self Help", "Finance", "Fiction", "History"];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Book Catalog</h1>
          <p className="text-slate-200 mt-1">Browse and discover new books</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search books or authors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
            />
          </div>
          
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.length === 0 ? (
            <div className="col-span-full text-center py-20 text-slate-500">
              No books found matching your criteria.
            </div>
          ) : (
            books.map((book) => (
              <div key={book.book_id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col h-full group">
                <div onClick={() => openBookDetails(book)} className="cursor-pointer">
                  <img src={book.image_url || 'https://via.placeholder.com/300x450/e2e8f0/475569?text=No+Cover'} alt={book.title} className="w-full h-64 object-cover rounded-xl mb-4 shadow-sm group-hover:opacity-90 transition-opacity" />
                  <div className="flex-grow">
                    <div className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 mb-3">
                      {book.category}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4">by {book.author}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium flex items-center gap-1 ${
                      book.availability_status === 'Available' ? 'text-green-600' : 'text-orange-500'
                    }`}>
                      {book.availability_status === 'Available' ? (
                        <><CheckCircle className="w-4 h-4" /> Available</>
                      ) : (
                        <><Clock className="w-4 h-4" /> Borrowed</>
                      )}
                    </span>
                    
                    <div className="flex gap-2">
                      {book.pdf_url && (
                        <>
                          <Link 
                            to={`/book-reader/${book.book_id}`}
                            className="px-3 py-2 rounded-lg text-sm font-semibold transition-all bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center"
                            title="Read PDF"
                          >
                            <FileText className="w-4 h-4" />
                          </Link>
                          <a 
                            href={`${BASE_URL}${book.pdf_url}`}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-2 rounded-lg text-sm font-semibold transition-all bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white flex items-center"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </>
                      )}
                      <button 
                        onClick={() => handleBorrow(book.book_id)}
                        disabled={book.availability_status !== 'Available'}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          book.availability_status === 'Available' 
                            ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Borrow
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8 flex items-start justify-between border-b border-slate-100">
              <div className="flex gap-6">
                <img src={selectedBook.image_url || 'https://via.placeholder.com/300x450/e2e8f0/475569?text=No+Cover'} alt={selectedBook.title} className="w-32 h-48 object-cover rounded-xl shadow-md shrink-0" />
                <div>
                  <div className="inline-flex px-3 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 mb-3 uppercase tracking-wider">
                    {selectedBook.category}
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2 leading-tight">{selectedBook.title}</h2>
                  <p className="text-lg text-slate-600 mb-4">by <span className="font-semibold">{selectedBook.author}</span></p>
                  
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => {
                        handleBorrow(selectedBook.book_id);
                        closeBookDetails();
                      }}
                      disabled={selectedBook.availability_status !== 'Available'}
                      className={`px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                        selectedBook.availability_status === 'Available' 
                          ? 'bg-slate-900 text-white hover:bg-slate-800' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {selectedBook.availability_status === 'Available' ? 'Borrow Book' : 'Currently Unavailable'}
                    </button>
                    {selectedBook.pdf_url && (
                      <>
                        <Link 
                          to={`/book-reader/${selectedBook.book_id}`}
                          className="px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm bg-emerald-100 text-emerald-800 hover:bg-emerald-200 flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" /> Read
                        </Link>
                        <a 
                          href={`${BASE_URL}${selectedBook.pdf_url}`}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" /> Download
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={closeBookDetails} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 md:p-8 bg-slate-50">
              <h3 className="font-bold text-slate-900 mb-4">Readers who borrowed this also read:</h3>
              {loadingAlsoBorrowed ? (
                <div className="text-sm text-slate-500">Loading recommendations...</div>
              ) : alsoBorrowed.length > 0 ? (
                <div className="space-y-3">
                  {alsoBorrowed.map(b => (
                    <div key={b.book_id} className="flex gap-3 bg-white p-3 border border-slate-200 rounded-xl items-center shadow-sm">
                      <img src={b.image_url} className="w-10 h-14 object-cover rounded shrink-0" alt=""/>
                      <div>
                        <p className="font-bold text-sm text-slate-800 leading-tight">{b.title}</p>
                        <p className="text-xs text-slate-500">{b.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-500 italic">No collaborative data available yet.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;

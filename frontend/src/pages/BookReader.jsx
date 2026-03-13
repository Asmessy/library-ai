import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';

const BookReader = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get('/books');
        const found = response.data.find(b => b.book_id === parseInt(bookId, 10));
        if (found) {
          setBook(found);
        } else {
          setError('Book not found');
        }
      } catch (err) {
        setError('Failed to fetch book details');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <h2 className="text-2xl font-bold text-slate-200 mb-4">{error || 'Book Not Found'}</h2>
        <Link to="/catalog" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[85vh] flex flex-col pt-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{book.title}</h1>
          <p className="text-slate-300">by {book.author}</p>
        </div>
        <Link to="/catalog" className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </div>
      
      <div className="flex-grow bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
        {book.pdf_url ? (
          <iframe 
            src={`http://localhost:5000${book.pdf_url}`} 
            title={book.title}
            className="w-full h-full border-0"
          ></iframe>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            No PDF available for this book.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookReader;

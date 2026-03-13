import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { BookOpen } from 'lucide-react';

const Home = () => {
  const [bookOfTheDay, setBookOfTheDay] = useState(null);

  useEffect(() => {
    api.get('/recommendations/book-of-the-day').then(res => {
      setBookOfTheDay(res.data.book);
    }).catch(err => console.error(err));
  }, []);

  return (
    <>
      
      <div className="relative flex flex-col items-center justify-center min-h-[85vh] text-center px-4">
        <div className="z-10 p-4 md:p-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-semibold text-sm mb-6 tracking-wide uppercase">
            AI LIBRARY MANAGEMENT SYSTEM
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Smart Library Management with <br className="hidden md:block"/> AI-Powered Book Recommendations
          </h1>
          
          <p className="text-lg md:text-xl text-slate-200 mb-4 max-w-3xl mx-auto leading-relaxed font-medium">
            A modern digital platform to manage books, track borrowing and returns, and discover personalized book recommendations using AI and automation.
          </p>

          <p className="text-md md:text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Browse the library catalog, check book availability, borrow or return books easily, and receive intelligent recommendations based on your reading interests.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/catalog" 
              className="flex items-center justify-center bg-white text-slate-900 px-8 py-4 rounded-full font-semibold hover:bg-slate-200 transition-all hover:scale-105 active:scale-100 shadow-xl"
            >
              Explore Catalog
            </Link>
            <Link 
              to="/login" 
              className="flex items-center justify-center bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all hover:scale-105 active:scale-100 shadow-sm"
            >
              Open Dashboard
            </Link>
          </div>

          {bookOfTheDay && (
            <div className="mt-14 max-w-xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-left flex flex-col sm:flex-row gap-6 items-center shadow-lg transition-transform hover:scale-105">
              <img src={bookOfTheDay.image_url || 'https://via.placeholder.com/150'} className="w-24 h-36 object-cover rounded-xl shadow-md shrink-0" alt="Book of the day" />
              <div>
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-2">
                  <BookOpen className="w-4 h-4" /> Book of the Day
                </div>
                <h3 className="text-2xl font-bold text-white leading-tight mb-2">{bookOfTheDay.title}</h3>
                <p className="text-slate-300 text-sm mb-4 line-clamp-2">A highly recommended read in the {bookOfTheDay.category} category. Expand your knowledge and explore this title today.</p>
                <Link to="/catalog" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  View Book &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error('Auth check error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-6 flex items-center justify-between py-5">
        <Link to="/" className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-2xl mr-3">
            🚗
          </div>
          <span className="text-lg font-semibold brand-name">HuruDrive</span>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm">
          <Link 
            to="/" 
            className="hover:text-teal-600 transition-colors"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Home
          </Link>
          <Link 
            to="/" 
            className="hover:text-teal-600 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: document.querySelector('main').offsetTop - 100, behavior: 'smooth' });
            }}
          >
            Cars
          </Link>
          <a 
            className="hover:text-teal-600 transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              const footer = document.querySelector('footer');
              if (footer) {
                footer.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            About
          </a>
          <a 
            className="hover:text-teal-600 transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              const footer = document.querySelector('footer');
              if (footer) {
                footer.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="text-sm hover:text-teal-600 transition-colors px-3 py-2 bg-teal-50 rounded-lg"
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                to="/dashboard"
                className="text-sm hover:text-teal-600 transition-colors px-3 py-2 bg-gray-50 rounded-lg"
              >
                My Dashboard
              </Link>
              <span className="text-sm text-gray-600">{user.name || user.email}</span>
              <button 
                onClick={handleLogout}
                className="text-sm hover:text-teal-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')}
                className="text-sm hover:text-teal-600 transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-dark text-white px-4 py-2 rounded-xlcard text-sm hover:bg-gray-800 transition-colors"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
} from 'react-icons/fa';
import { logout, selectUserAuth, selectUser } from '../store/authSlice.js';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userAuth = useSelector(selectUserAuth);
  const user = useSelector(selectUser);

  const menuRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const toggleProfile = () => setIsProfileOpen((v) => !v);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const menuItems = [
    { to: '/', icon: <FaHome />, label: 'Home' },
    ...(userAuth ? [{ to: '/dashboard', icon: <FaUser />, label: 'Dashboard' }] : []),
  ];

  return (
    <header className="fixed w-full z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-pink-50 flex items-center justify-center text-2xl">
            <span className="text-pink-600">🍭</span>
          </div>
          <span className="text-xl font-semibold text-gray-800">SweetShop</span>
        </Link>

        <div className="hidden md:flex md:items-center md:gap-4 flex-1">
          <nav className="ml-4 flex items-center gap-2">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm flex items-center gap-2"
              >
                {item.icon}
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            {!userAuth ? (
              <>
                <Link to="/login" className="text-sm px-4 py-2 rounded-md bg-pink-600 text-white">
                  Login
                </Link>
                <Link to="/signup" className="text-sm px-4 py-2 rounded-md border border-pink-600 text-pink-600">
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={isProfileOpen}
                >
                  <div className="h-9 w-9 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 font-semibold">
                    {initials}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-800">{user?.name || 'User'}</div>
                    <div className="text-xs text-gray-500">{user?.email || ''}</div>
                  </div>
                </button>

                <div
                  className={`origin-top-right absolute right-0 mt-2 w-44 rounded-lg bg-white border shadow-md transition transform ${
                    isProfileOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                  }`}
                >
                  <Link
                    to="/dashboard"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="md:hidden" ref={menuRef}>
            <button onClick={toggleMenu} className="p-2 rounded-md text-gray-700 focus:outline-none">
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 z-40 transition-transform duration-300 md:hidden ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-hidden={!isMenuOpen}
        >
          {/* Blurred overlay */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Sidebar panel with blur */}
          <aside className="absolute right-0 top-0 h-full w-72 bg-white/90 backdrop-blur-md shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">🍭</div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{user?.name || 'Welcome'}</div>
                  <div className="text-xs text-gray-500">{user?.email || ''}</div>
                </div>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-600">
                <FaTimes />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {menuItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="mt-4">
                {!userAuth ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-center w-full py-2 rounded-md bg-pink-600 text-white mb-2"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-center w-full py-2 rounded-md border border-pink-600 text-pink-600"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 rounded-md bg-red-500 text-white flex items-center justify-center gap-2"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                )}
              </div>
            </nav>
          </aside>
        </div>
      </div>
    </header>
  );
};

export default Header;

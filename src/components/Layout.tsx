import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Classes & Events', path: '/events' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-stone-800 font-sans selection:bg-rose-200 flex flex-col">
      {/* Global Navigation */}
      <nav className="bg-stone-900 text-stone-50 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <Link to="/" className="font-serif text-2xl tracking-tight text-rose-300 hover:text-rose-200 transition-colors">
              Little Button Craft
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-rose-300 ${
                    isActive(link.path) ? 'text-rose-300 border-b-2 border-rose-300 pb-1' : 'text-stone-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-stone-300 hover:text-white focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-stone-800 border-t border-stone-700">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-stone-900 text-rose-300'
                      : 'text-stone-300 hover:bg-stone-700 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>

      {/* Global Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 text-center mt-auto">
        <div className="max-w-5xl mx-auto px-6">
          <p className="font-serif text-2xl text-stone-300 mb-4">Little Button Craft</p>
          <p className="mb-8 max-w-md mx-auto">A community space for makers, crafters, and artists of all skill levels.</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link to="/about" className="hover:text-rose-300 transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-rose-300 transition-colors">Contact</Link>
            <Link to="/events" className="hover:text-rose-300 transition-colors">Classes</Link>
            <Link to="/policies" className="hover:text-rose-300 transition-colors">Policies</Link>
            <Link to="/admin" className="hover:text-rose-300 transition-colors">Owner Login</Link>
          </div>
          <p className="text-xs mt-12 text-stone-600">
            &copy; {new Date().getFullYear()} Little Button Craft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

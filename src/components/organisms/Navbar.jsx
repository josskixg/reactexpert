import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  MessageSquare,
  Trophy,
  PlusCircle,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { asyncUnsetAuthUser } from '../../states/authUser/action';
import { showModalActionCreator } from '../../states/modal/action';

function Navbar() {
  const authUser = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(
      showModalActionCreator({
        title: 'Konfirmasi Keluar',
        message: 'Apakah Anda yakin ingin keluar dari akun Anda?',
        type: 'confirm',
        confirmText: 'Ya, Keluar',
        cancelText: 'Batal',
        onConfirm: () => {
          dispatch(asyncUnsetAuthUser());
          navigate('/');
        },
      })
    );
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-3 z-40 px-3 sm:px-6 mb-6 max-w-5xl mx-auto w-full">
      <nav aria-label="Navigasi Utama" className="clay-nav px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Emblem */}
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="Wacana Beranda">
          <div className="w-9 h-9 rounded-xl bg-[#D95338] text-white flex items-center justify-center clay-card-flat shadow-[#B83A22]/40 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="12" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-[#1C1917]">
              Wacana<span className="text-[#D95338]">.</span>
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/"
            aria-current={isActive('/') ? 'page' : undefined}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              isActive('/') ? 'clay-btn-primary' : 'clay-btn'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Diskusi</span>
          </Link>
          <Link
            to="/leaderboards"
            aria-current={isActive('/leaderboards') ? 'page' : undefined}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              isActive('/leaderboards') ? 'clay-btn-primary' : 'clay-btn'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Klasemen</span>
          </Link>
          {authUser && (
            <Link
              to="/new"
              aria-current={isActive('/new') ? 'page' : undefined}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                isActive('/new') ? 'clay-btn-primary' : 'clay-btn'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tulis Diskusi</span>
            </Link>
          )}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-2.5">
          {authUser ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 clay-card-flat px-3 py-1.5 bg-[#FAF8F5]">
                <img
                  src={authUser.avatar}
                  alt={`Avatar ${authUser.name}`}
                  className="w-7 h-7 rounded-full object-cover clay-avatar"
                />
                <span className="text-xs font-bold text-[#1C1917] max-w-[120px] truncate hidden sm:inline">
                  {authUser.name}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Keluar dari akun"
                className="clay-btn-danger px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="clay-btn px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-[#D95338]" />
                <span>Masuk</span>
              </Link>
              <Link
                to="/register"
                className="clay-btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Daftar</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

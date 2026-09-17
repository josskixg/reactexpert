import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MessageSquare, Trophy, PlusCircle, LogIn, User } from 'lucide-react';

function BottomNav() {
  const location = useLocation();
  const authUser = useSelector((state) => state.authUser);

  const isActive = (path) => location.pathname === path;

  return (
    <nav aria-label="Navigasi Seluler Bawah" className="md:hidden fixed bottom-3 left-3 right-3 z-40">
      <div className="clay-nav px-5 py-2.5 flex items-center justify-around">
        <Link
          to="/"
          aria-label="Daftar Diskusi"
          className={`flex flex-col items-center gap-1 transition-all ${
            isActive('/') ? 'text-[#D95338] font-extrabold scale-105' : 'text-[#78716C] font-semibold'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[11px]">Diskusi</span>
        </Link>

        <Link
          to="/leaderboards"
          aria-label="Klasemen Pengguna"
          className={`flex flex-col items-center gap-1 transition-all ${
            isActive('/leaderboards') ? 'text-[#D95338] font-extrabold scale-105' : 'text-[#78716C] font-semibold'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[11px]">Klasemen</span>
        </Link>

        {authUser ? (
          <Link
            to="/new"
            aria-label="Tulis Diskusi Baru"
            className={`flex flex-col items-center gap-1 transition-all ${
              isActive('/new') ? 'text-[#D95338] font-extrabold scale-105' : 'text-[#78716C] font-semibold'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-[11px]">Tulis</span>
          </Link>
        ) : (
          <Link
            to="/login"
            aria-label="Masuk Akun"
            className={`flex flex-col items-center gap-1 transition-all ${
              isActive('/login') ? 'text-[#D95338] font-extrabold scale-105' : 'text-[#78716C] font-semibold'
            }`}
          >
            <LogIn className="w-5 h-5" />
            <span className="text-[11px]">Masuk</span>
          </Link>
        )}

        {authUser && (
          <div className="flex flex-col items-center gap-1 text-[#57534E]">
            <User className="w-5 h-5 text-[#D95338]" />
            <span className="text-[11px] font-bold max-w-[60px] truncate">{authUser.name}</span>
          </div>
        )}
      </div>
    </nav>
  );
}

export default BottomNav;

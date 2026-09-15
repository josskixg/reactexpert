import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { asyncPreloadProcess } from './states/isPreload/action';
import LoadingIndicator from './components/LoadingIndicator';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Modal from './components/Modal';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import AddThreadPage from './pages/AddThreadPage';
import LeaderboardsPage from './pages/LeaderboardsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const isPreload = useSelector((state) => state.isPreload);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  if (isPreload) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#ECE7DF] p-4">
        <div className="clay-card p-8 flex flex-col items-center gap-4 animate-pulse">
          <div className="w-14 h-14 rounded-2xl bg-[#D95338] text-white flex items-center justify-center clay-card-flat shadow-[#B83A22]/40">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="12" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-black text-[#1C1917]">Wacana</h2>
            <p className="text-xs font-semibold text-[#78716C] mt-1">Memuat data diskusi...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between pb-24 md:pb-12">
      <LoadingIndicator />
      <Navbar />
      <Modal />

      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/threads/:id" element={<DetailPage />} />
          <Route path="/new" element={<AddThreadPage />} />
          <Route path="/leaderboards" element={<LeaderboardsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="mt-16 text-center text-xs text-[#78716C] font-medium border-t border-[#D6CEC2] pt-6 max-w-5xl mx-auto w-full px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="font-bold text-[#44403C]">
            Wacana &copy; {new Date().getFullYear()} &bull; Ruang Diskusi Terbuka
          </p>
          <p className="text-[#78716C]">
            Komunitas Pengembang &amp; Pembelajar
          </p>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}

export default App;

import { Link } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';

function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto my-12 text-center">
      <div className="clay-card p-8 sm:p-10 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center clay-card-flat">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-[#1C1917]">404</h1>
        <h2 className="text-base font-bold text-[#44403C]">Halaman Tidak Ditemukan</h2>
        <p className="text-xs text-[#78716C]">
          Halaman atau rute yang Anda tuju tidak tersedia atau telah dipindahkan.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="clay-btn-primary px-5 py-2.5 text-xs font-bold inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;

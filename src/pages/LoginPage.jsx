import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn, Mail, Lock } from 'lucide-react';
import { asyncSetAuthUser } from '../states/authUser/action';
import useInput from '../hooks/useInput';

function LoginPage() {
  const [email, handleEmailChange] = useInput('');
  const [password, handlePasswordChange] = useInput('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authUser = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // If already logged in, redirect
  if (authUser) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsSubmitting(true);
    const result = await dispatch(
      asyncSetAuthUser({
        email: email.trim(),
        password,
      })
    );
    setIsSubmitting(false);

    if (!result?.error) {
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 sm:my-10">
      <div className="clay-card p-6 sm:p-8 md:p-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-[#1C1917] tracking-tight">
            Masuk ke Akun
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Gunakan email dan kata sandi yang telah terdaftar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-extrabold text-[#1C1917] uppercase tracking-wider mb-1.5"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="nama@email.com"
                className="clay-input w-full pl-10 pr-3.5 py-2.5 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-extrabold text-[#1C1917] uppercase tracking-wider mb-1.5"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className="clay-input w-full pl-10 pr-3.5 py-2.5 text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="clay-btn-primary w-full py-3 text-xs font-black flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Memproses...' : 'Masuk'}</span>
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#D6CEC2] text-center">
          <p className="text-xs text-[#78716C] font-medium">
            Belum memiliki akun?{' '}
            <Link
              to="/register"
              className="font-black text-[#D95338] hover:underline"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

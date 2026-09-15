import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Send } from 'lucide-react';
import { asyncAddThread } from '../states/threads/action';
import useInput from '../hooks/useInput';

function AddThreadPage() {
  const [title, handleTitleChange] = useInput('');
  const [category, handleCategoryChange] = useInput('');
  const [body, handleBodyChange] = useInput('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authUser = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!authUser) {
    return (
      <div className="clay-card p-8 sm:p-10 text-center max-w-md mx-auto my-10">
        <h2 className="text-xl font-black text-[#1C1917] mb-2">
          Akses Masuk Diperlukan
        </h2>
        <p className="text-xs sm:text-sm text-[#78716C] mb-5">
          Anda perlu masuk dengan akun Anda untuk dapat menulis topik diskusi baru.
        </p>
        <Link to="/login" className="clay-btn-primary px-5 py-2.5 text-xs font-bold">
          Masuk ke Akun
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setIsSubmitting(true);
    const result = await dispatch(
      asyncAddThread({
        title: title.trim(),
        body: body.trim(),
        category: category.trim(),
      })
    );
    setIsSubmitting(false);

    if (!result?.error) {
      navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
      <Link
        to="/"
        className="clay-btn px-3.5 py-1.5 text-xs font-bold inline-flex items-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali</span>
      </Link>

      <div className="clay-card p-5 sm:p-7 md:p-8">
        <h1 className="text-xl sm:text-2xl font-black text-[#1C1917] mb-5">
          Mulai Topik Diskusi
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="thread-title"
              className="block text-xs font-extrabold text-[#1C1917] uppercase tracking-wider mb-1.5"
            >
              Judul Diskusi <span className="text-[#DC2626]">*</span>
            </label>
            <input
              id="thread-title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Apa yang ingin Anda tanyakan atau diskusikan?"
              className="clay-input w-full px-3.5 py-2.5 text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="thread-category"
              className="block text-xs font-extrabold text-[#1C1917] uppercase tracking-wider mb-1.5"
            >
              Kategori / Label
            </label>
            <input
              id="thread-category"
              type="text"
              value={category}
              onChange={handleCategoryChange}
              placeholder="Contoh: react, redux, state, umum (opsional)"
              className="clay-input w-full px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="thread-body"
              className="block text-xs font-extrabold text-[#1C1917] uppercase tracking-wider mb-1.5"
            >
              Uraian Diskusi <span className="text-[#DC2626]">*</span>
            </label>
            <textarea
              id="thread-body"
              value={body}
              onChange={handleBodyChange}
              placeholder="Tuliskan konteks lengkap, kode, atau pertanyaan Anda..."
              rows={7}
              className="clay-input w-full p-3.5 text-sm resize-y"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#D6CEC2]">
            <Link
              to="/"
              className="clay-btn px-4 py-2 text-xs font-bold"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !body.trim()}
              className="clay-btn-primary px-5 py-2 text-xs font-bold flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Menerbitkan...' : 'Terbitkan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddThreadPage;

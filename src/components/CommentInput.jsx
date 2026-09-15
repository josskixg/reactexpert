import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, LogIn } from 'lucide-react';

function CommentInput({ authUser = null, onSubmitComment }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authUser) {
    return (
      <div className="clay-card p-6 mb-6 text-center">
        <h3 className="font-black text-[#1C1917] text-base mb-2">
          Ingin bergabung dalam diskusi?
        </h3>
        <p className="text-sm text-[#78716C] mb-4">
          Silakan masuk terlebih dahulu untuk menulis tanggapan atau komentar.
        </p>
        <Link
          to="/login"
          className="clay-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold"
        >
          <LogIn className="w-4 h-4" />
          <span>Masuk untuk Menanggapi</span>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const result = await onSubmitComment(content);
    setIsSubmitting(false);

    if (!result?.error) {
      setContent('');
    }
  };

  return (
    <div className="clay-card p-5 sm:p-6 mb-6">
      <h3 className="font-black text-[#1C1917] text-base mb-3">
        Beri Tanggapan
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="comment-textarea" className="sr-only">
          Isi Tanggapan
        </label>
        <textarea
          id="comment-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tuliskan pandangan atau tanggapan Anda..."
          rows={4}
          className="clay-input w-full p-3.5 text-sm resize-y"
          required
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="clay-btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Mengirim...' : 'Kirim Tanggapan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommentInput;

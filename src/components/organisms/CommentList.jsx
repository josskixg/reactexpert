import CommentItem from '../molecules/CommentItem';
import { MessageCircle } from 'lucide-react';

function CommentList({
  comments = [],
  authUserId = null,
  onUpvote,
  onDownvote,
}) {
  return (
    <section aria-label="Daftar Komentar" className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-5 h-5 text-[#D95338]" />
        <h2 className="font-black text-base sm:text-lg text-[#1C1917]">
          Tanggapan ({comments.length})
        </h2>
      </div>

      {comments.length === 0 ? (
        <div className="clay-card p-6 text-center text-[#78716C]">
          <p className="text-xs sm:text-sm font-medium">
            Belum ada tanggapan untuk diskusi ini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              {...comment}
              authUserId={authUserId}
              onUpvote={onUpvote}
              onDownvote={onDownvote}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default CommentList;

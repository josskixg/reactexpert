import { useDispatch } from 'react-redux';
import parse from 'html-react-parser';
import { Clock, Share2 } from 'lucide-react';
import { postedAt } from '../../utils';
import VoteButton from '../atoms/VoteButton';
import { showModalActionCreator } from '../../states/modal/action';

function ThreadDetail({
  title,
  body = '',
  category,
  createdAt,
  owner = {},
  upVotesBy = [],
  downVotesBy = [],
  authUserId = null,
  onUpvote,
  onDownvote,
}) {
  const dispatch = useDispatch();
  const authorName = owner?.name || 'Anonim';
  const authorAvatar = owner?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`;

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    dispatch(
      showModalActionCreator({
        title: 'Tautan Disalin',
        message: 'Tautan diskusi telah berhasil disalin ke papan klip Anda.',
        type: 'success',
      })
    );
  };

  return (
    <article className="clay-card p-5 sm:p-7 md:p-8 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <img
            src={authorAvatar}
            alt={`Avatar dari ${authorName}`}
            className="w-12 h-12 rounded-full clay-avatar object-cover bg-[#E6E0D6]"
          />
          <div>
            <span className="font-extrabold text-[#1C1917] text-base block">{authorName}</span>
            <div className="flex items-center gap-1.5 text-xs text-[#78716C] font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <time dateTime={createdAt}>{postedAt(createdAt)}</time>
            </div>
          </div>
        </div>

        {category && (
          <span className="clay-badge bg-[#FAF6F0] text-[#D95338] font-black text-xs border border-[#E6E0D6]">
            #{category}
          </span>
        )}
      </div>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1C1917] mb-4 leading-tight">
        {title}
      </h1>

      <div className="text-[#332F2C] text-sm sm:text-base leading-relaxed mb-6 space-y-3 prose max-w-none break-words">
        {typeof body === 'string' ? parse(body) : body}
      </div>

      <div className="pt-4 border-t border-[#D6CEC2] flex items-center justify-between">
        <VoteButton
          upVotesBy={upVotesBy}
          downVotesBy={downVotesBy}
          authUserId={authUserId}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
        />

        <button
          type="button"
          onClick={handleShare}
          aria-label="Salin tautan diskusi"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs text-[#44403C] hover:text-[#D95338] hover:bg-white/60 transition-all"
        >
          <Share2 className="w-4 h-4 text-[#D95338]" />
          <span>Bagikan</span>
        </button>
      </div>
    </article>
  );
}

export default ThreadDetail;

import { Link } from 'react-router-dom';
import { MessageSquare, Clock } from 'lucide-react';
import { postedAt, truncateText } from '../utils';
import VoteButton from './VoteButton';

function ThreadItem({
  id,
  title,
  body,
  category,
  createdAt,
  upVotesBy = [],
  downVotesBy = [],
  totalComments = 0,
  user = {},
  authUserId = null,
  onUpvote,
  onDownvote,
}) {
  const authorName = user?.name || 'Anonim';
  const authorAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`;

  return (
    <article className="clay-card clay-card-interactive p-5 sm:p-6 mb-5 transition-all">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <img
            src={authorAvatar}
            alt={`Avatar dari ${authorName}`}
            className="w-10 h-10 rounded-full clay-avatar object-cover bg-[#E6E0D6]"
            loading="lazy"
          />
          <div>
            <span className="font-extrabold text-[#1C1917] text-sm block">{authorName}</span>
            <div className="flex items-center gap-1.5 text-xs text-[#78716C] font-medium">
              <Clock className="w-3.5 h-3.5" />
              <time dateTime={createdAt}>{postedAt(createdAt)}</time>
            </div>
          </div>
        </div>

        {category && (
          <span className="clay-badge bg-[#FAF6F0] text-[#D95338] font-black border border-[#E6E0D6]">
            #{category}
          </span>
        )}
      </div>

      <div className="mb-4">
        <Link
          to={`/threads/${id}`}
          className="block group"
        >
          <h2 className="text-lg sm:text-xl font-black text-[#1C1917] group-hover:text-[#D95338] transition-colors mb-2 line-clamp-2">
            {title}
          </h2>
          <p className="text-[#44403C] text-sm leading-relaxed line-clamp-3">
            {truncateText(body, 180)}
          </p>
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D6CEC2]">
        <VoteButton
          upVotesBy={upVotesBy}
          downVotesBy={downVotesBy}
          authUserId={authUserId}
          onUpvote={() => onUpvote(id)}
          onDownvote={() => onDownvote(id)}
        />

        <Link
          to={`/threads/${id}`}
          aria-label={`Lihat ${totalComments} komentar untuk thread ini`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-[#44403C] hover:text-[#D95338] hover:bg-white/60 transition-all"
        >
          <MessageSquare className="w-4 h-4 text-[#D95338]" />
          <span>{totalComments} Komentar</span>
        </Link>
      </div>
    </article>
  );
}

export default ThreadItem;

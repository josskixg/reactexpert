import parse from 'html-react-parser';
import { Clock } from 'lucide-react';
import { postedAt } from '../utils';
import VoteButton from './VoteButton';

function CommentItem({
  id,
  content,
  createdAt,
  owner = {},
  upVotesBy = [],
  downVotesBy = [],
  authUserId = null,
  onUpvote,
  onDownvote,
}) {
  const authorName = owner?.name || 'Anonim';
  const authorAvatar = owner?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`;

  return (
    <article className="clay-card p-4 sm:p-5 mb-3 transition-all">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          <img
            src={authorAvatar}
            alt={`Avatar dari ${authorName}`}
            className="w-8 h-8 rounded-full clay-avatar object-cover bg-[#E6E0D6]"
          />
          <div>
            <span className="font-bold text-[#1C1917] text-xs sm:text-sm block">{authorName}</span>
            <div className="flex items-center gap-1 text-[11px] text-[#78716C] font-medium">
              <Clock className="w-3 h-3" />
              <time dateTime={createdAt}>{postedAt(createdAt)}</time>
            </div>
          </div>
        </div>
      </div>

      <div className="text-[#332F2C] text-xs sm:text-sm leading-relaxed mb-3.5 sm:pl-10 break-words">
        {typeof content === 'string' ? parse(content) : content}
      </div>

      <div className="sm:pl-10">
        <VoteButton
          upVotesBy={upVotesBy}
          downVotesBy={downVotesBy}
          authUserId={authUserId}
          onUpvote={() => onUpvote(id)}
          onDownvote={() => onDownvote(id)}
          compact
        />
      </div>
    </article>
  );
}

export default CommentItem;

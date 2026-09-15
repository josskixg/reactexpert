import { ThumbsUp, ThumbsDown } from 'lucide-react';

function VoteButton({
  upVotesBy = [],
  downVotesBy = [],
  authUserId = null,
  onUpvote,
  onDownvote,
  compact = false,
}) {
  const isUpvoted = authUserId ? upVotesBy.includes(authUserId) : false;
  const isDownvoted = authUserId ? downVotesBy.includes(authUserId) : false;
  const voteScore = upVotesBy.length - downVotesBy.length;

  return (
    <div
      role="group"
      aria-label="Penilaian dukungan"
      className={`inline-flex items-center gap-1 p-1 bg-[#E8E2D8] rounded-2xl shadow-[inset_2px_2px_4px_rgba(182,172,158,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/80 ${
        compact ? 'text-xs' : 'text-sm'
      }`}
    >
      <button
        type="button"
        onClick={onUpvote}
        aria-label={`Dukung (Upvote), total ${upVotesBy.length}`}
        aria-pressed={isUpvoted}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition-all ${
          isUpvoted
            ? 'bg-[#D95338] text-white shadow-[inset_2px_2px_4px_rgba(140,30,10,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.4)]'
            : 'text-[#44403C] hover:text-[#D95338] hover:bg-white/70'
        }`}
      >
        <ThumbsUp className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${isUpvoted ? 'fill-current' : ''}`} />
        <span>{upVotesBy.length}</span>
      </button>

      <span
        aria-label={`Skor total vote ${voteScore}`}
        className={`px-1 font-black ${
          voteScore > 0 ? 'text-[#D95338]' : voteScore < 0 ? 'text-[#DC2626]' : 'text-[#78716C]'
        }`}
      >
        {voteScore > 0 ? `+${voteScore}` : voteScore}
      </span>

      <button
        type="button"
        onClick={onDownvote}
        aria-label={`Tidak setuju (Downvote), total ${downVotesBy.length}`}
        aria-pressed={isDownvoted}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition-all ${
          isDownvoted
            ? 'bg-[#44403C] text-white shadow-[inset_2px_2px_4px_rgba(28,25,23,0.7),inset_-2px_-2px_4px_rgba(255,255,255,0.3)]'
            : 'text-[#44403C] hover:text-[#1C1917] hover:bg-white/70'
        }`}
      >
        <ThumbsDown className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${isDownvoted ? 'fill-current' : ''}`} />
        <span>{downVotesBy.length}</span>
      </button>
    </div>
  );
}

export default VoteButton;

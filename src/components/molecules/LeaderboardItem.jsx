import { Trophy, Award, Medal } from 'lucide-react';

function LeaderboardItem({ rank, user = {}, score = 0 }) {
  const authorName = user?.name || 'Anonim';
  const authorAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`;

  const getRankBadge = (position) => {
    switch (position) {
    case 1:
      return (
        <div
          title="Peringkat 1"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black clay-card-flat shadow-amber-300/50 shrink-0"
        >
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      );
    case 2:
      return (
        <div
          title="Peringkat 2"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#D6CEC2] text-[#292524] flex items-center justify-center font-black clay-card-flat shrink-0"
        >
          <Award className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      );
    case 3:
      return (
        <div
          title="Peringkat 3"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#C27848] text-white flex items-center justify-center font-black clay-card-flat shrink-0"
        >
          <Medal className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      );
    default:
      return (
        <div
          title={`Peringkat ${position}`}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#E6E0D6] text-[#57534E] flex items-center justify-center font-extrabold text-xs sm:text-sm clay-card-flat shrink-0"
        >
            #{position}
        </div>
      );
    }
  };

  return (
    <div className="clay-card p-3.5 sm:p-4 md:p-5 flex items-center justify-between gap-3 transition-all">
      <div className="flex items-center gap-3 min-w-0">
        {getRankBadge(rank)}
        <img
          src={authorAvatar}
          alt={`Avatar dari ${authorName}`}
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full clay-avatar object-cover bg-[#E6E0D6] shrink-0"
        />
        <div className="min-w-0">
          <span className="font-extrabold text-[#1C1917] text-xs sm:text-sm md:text-base truncate block">
            {authorName}
          </span>
          <p className="text-[11px] sm:text-xs text-[#78716C] font-medium truncate max-w-[140px] sm:max-w-xs">
            {user?.email || ''}
          </p>
        </div>
      </div>

      <div className="shrink-0">
        <div className="clay-card-flat px-3 sm:px-4 py-1.5 sm:py-2 bg-[#FAF8F5] flex items-center gap-1.5">
          <span className="text-[11px] sm:text-xs font-bold text-[#78716C]">Skor:</span>
          <span className="font-black text-[#D95338] text-sm sm:text-base">{score}</span>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardItem;

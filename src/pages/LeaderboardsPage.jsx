import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trophy } from 'lucide-react';
import { asyncReceiveLeaderboards } from '../states/leaderboards/action';
import LeaderboardItem from '../components/LeaderboardItem';
import { LeaderboardItemSkeleton } from '../components/SkeletonLoader';

function LeaderboardsPage() {
  const leaderboards = useSelector((state) => state.leaderboards);
  const loading = useSelector((state) => state.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncReceiveLeaderboards());
  }, [dispatch]);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header card */}
      <div className="clay-card p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1C1917]">
            Klasemen Kontributor
          </h1>
          <p className="text-[#78716C] text-xs sm:text-sm mt-1">
            Pengguna teraktif dengan kontribusi pemecahan masalah dan diskusi tertinggi.
          </p>
        </div>

        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center clay-card-flat shrink-0">
          <Trophy className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="space-y-2.5">
        {loading > 0 && leaderboards.length === 0 ? (
          <>
            <LeaderboardItemSkeleton />
            <LeaderboardItemSkeleton />
            <LeaderboardItemSkeleton />
            <LeaderboardItemSkeleton />
          </>
        ) : (
          leaderboards.map((item, index) => (
            <LeaderboardItem
              key={item.user.id}
              rank={index + 1}
              user={item.user}
              score={item.score}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default LeaderboardsPage;

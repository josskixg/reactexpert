function ThreadItemSkeleton() {
  return (
    <div className="clay-card p-5 sm:p-6 mb-5 animate-pulse">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D6CEC2]" />
          <div className="space-y-1.5">
            <div className="w-24 h-3.5 bg-[#D6CEC2] rounded-full" />
            <div className="w-16 h-2.5 bg-[#D6CEC2] rounded-full" />
          </div>
        </div>
        <div className="w-16 h-5 bg-[#D6CEC2] rounded-full" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="w-3/4 h-5 bg-[#D6CEC2] rounded-full" />
        <div className="w-full h-3.5 bg-[#D6CEC2] rounded-full" />
        <div className="w-5/6 h-3.5 bg-[#D6CEC2] rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-[#D6CEC2]">
        <div className="w-24 h-7 bg-[#D6CEC2] rounded-xl" />
        <div className="w-20 h-5 bg-[#D6CEC2] rounded-xl" />
      </div>
    </div>
  );
}

function LeaderboardItemSkeleton() {
  return (
    <div className="clay-card p-4 sm:p-5 flex items-center justify-between gap-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#D6CEC2]" />
        <div className="w-10 h-10 rounded-full bg-[#D6CEC2]" />
        <div className="space-y-1.5">
          <div className="w-28 h-3.5 bg-[#D6CEC2] rounded-full" />
          <div className="w-36 h-2.5 bg-[#D6CEC2] rounded-full" />
        </div>
      </div>
      <div className="w-16 h-8 bg-[#D6CEC2] rounded-xl" />
    </div>
  );
}

export {
  ThreadItemSkeleton,
  LeaderboardItemSkeleton,
};

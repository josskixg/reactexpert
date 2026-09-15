import ThreadItem from './ThreadItem';
import { MessageSquareOff } from 'lucide-react';

function ThreadList({ threads = [], authUserId = null, onUpvote, onDownvote }) {
  if (threads.length === 0) {
    return (
      <div className="clay-card p-8 sm:p-12 text-center text-[#78716C] my-6">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#E6E0D6] text-[#78716C] flex items-center justify-center clay-card-flat">
          <MessageSquareOff className="w-7 h-7" />
        </div>
        <h3 className="font-black text-base sm:text-lg text-[#1C1917] mb-1">Tidak Ada Diskusi</h3>
        <p className="text-xs sm:text-sm text-[#78716C]">
          Belum ada topik diskusi yang sesuai dengan pilihan ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          {...thread}
          authUserId={authUserId}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
        />
      ))}
    </div>
  );
}

export default ThreadList;

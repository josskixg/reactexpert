import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, ArrowUpDown } from 'lucide-react';
import { asyncPopulateUsersAndThreads } from '../states/shared/action';
import {
  asyncToggleUpvoteThread,
  asyncToggleDownvoteThread,
} from '../states/threads/action';
import CategoryFilter from '../components/CategoryFilter';
import ThreadList from '../components/ThreadList';
import { ThreadItemSkeleton } from '../components/SkeletonLoader';
import useInput from '../hooks/useInput';

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, handleSearchChange] = useInput('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'popular' | 'comments'

  const threads = useSelector((state) => state.threads);
  const users = useSelector((state) => state.users);
  const authUser = useSelector((state) => state.authUser);
  const loading = useSelector((state) => state.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPopulateUsersAndThreads());
  }, [dispatch]);

  const onUpvoteThread = (id) => {
    dispatch(asyncToggleUpvoteThread(id));
  };

  const onDownvoteThread = (id) => {
    dispatch(asyncToggleDownvoteThread(id));
  };

  // Extract unique categories
  const categories = Array.from(
    new Set(threads.map((thread) => thread.category).filter(Boolean))
  );

  // Filter and sort threads
  const threadList = threads
    .filter((thread) => {
      const matchCategory = !selectedCategory || thread.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (thread.category && thread.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    })
    .map((thread) => ({
      ...thread,
      user: users.find((user) => user.id === thread.ownerId) || {},
    }))
    .sort((a, b) => {
      if (sortBy === 'popular') {
        const scoreA = (a.upVotesBy?.length || 0) - (a.downVotesBy?.length || 0);
        const scoreB = (b.upVotesBy?.length || 0) - (b.downVotesBy?.length || 0);
        return scoreB - scoreA;
      }
      if (sortBy === 'comments') {
        return (b.totalComments || 0) - (a.totalComments || 0);
      }
      // 'newest'
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Header Card */}
      <div className="clay-card p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1C1917] tracking-tight">
            Percakapan Terbuka
          </h1>
          <p className="text-[#78716C] text-xs sm:text-sm mt-1">
            Tempat berdiskusi, bertanya teknis, dan bertukar gagasan seputar rekayasa web.
          </p>
        </div>

        {authUser ? (
          <Link
            to="/new"
            className="clay-btn-primary px-4 sm:px-5 py-2.5 text-xs font-black flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-center"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Mulai Topik Baru</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className="clay-btn px-4 sm:px-5 py-2.5 text-xs font-black flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-center"
          >
            <span>Masuk untuk Menulis</span>
          </Link>
        )}
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Cari judul, kata kunci, atau kategori..."
            aria-label="Cari diskusi"
            className="clay-input w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm"
          />
        </div>

        <div className="relative flex items-center gap-2 clay-card-flat px-3 py-1.5 bg-[#FAF8F5] shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#78716C]" />
          <label htmlFor="sort-select" className="text-xs font-extrabold text-[#78716C]">
            Urutkan:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-xs font-black text-[#1C1917] outline-none cursor-pointer"
          >
            <option value="newest">Terkini</option>
            <option value="popular">Paling Populer</option>
            <option value="comments">Terbanyak Komentar</option>
          </select>
        </div>
      </div>

      {/* Categories Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Threads Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm sm:text-base font-black text-[#1C1917]">
            {selectedCategory ? `Topik #${selectedCategory}` : searchQuery ? `Hasil Pencarian "${searchQuery}"` : 'Semua Diskusi'}
          </h2>
          <span className="text-xs font-extrabold text-[#78716C]">
            {threadList.length} Percakapan
          </span>
        </div>

        {loading > 0 && threads.length === 0 ? (
          <div className="space-y-4">
            <ThreadItemSkeleton />
            <ThreadItemSkeleton />
            <ThreadItemSkeleton />
          </div>
        ) : (
          <ThreadList
            threads={threadList}
            authUserId={authUser ? authUser.id : null}
            onUpvote={onUpvoteThread}
            onDownvote={onDownvoteThread}
          />
        )}
      </div>
    </div>
  );
}

export default HomePage;

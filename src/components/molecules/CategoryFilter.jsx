import { Tag } from 'lucide-react';

function CategoryFilter({ categories = [], selectedCategory = '', onSelectCategory }) {
  return (
    <section aria-label="Filter Berdasarkan Kategori" className="clay-card p-4 sm:p-5 mb-6">
      <div className="flex items-center gap-2 mb-3 text-[#1C1917] font-extrabold text-xs sm:text-sm">
        <Tag className="w-4 h-4 text-[#D95338]" />
        <span>Kategori Populer:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelectCategory('')}
          aria-pressed={selectedCategory === ''}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedCategory === ''
              ? 'clay-btn-primary'
              : 'clay-btn'
          }`}
        >
          #Semua
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(selectedCategory === category ? '' : category)}
            aria-pressed={selectedCategory === category}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === category
                ? 'clay-btn-primary'
                : 'clay-btn'
            }`}
          >
            #{category}
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategoryFilter;

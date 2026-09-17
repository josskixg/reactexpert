import CategoryFilter from './CategoryFilter';

export default {
  title: 'Molecules/CategoryFilter',
  component: CategoryFilter,
  args: {
    categories: ['react', 'javascript', 'typescript'],
    selectedCategory: '',
    onSelectCategory: () => {},
  },
  argTypes: {
    categories: {
      control: 'object',
      description: 'Daftar nama kategori yang ditampilkan sebagai tombol filter.',
    },
    selectedCategory: {
      control: 'text',
      description: 'Kategori yang sedang dipilih, kosong berarti #Semua.',
    },
  },
};

export const Default = {
  args: {
    categories: ['react', 'javascript', 'typescript'],
    selectedCategory: '',
  },
};

export const WithSelectedCategory = {
  args: {
    categories: ['react', 'javascript', 'typescript'],
    selectedCategory: 'react',
  },
};

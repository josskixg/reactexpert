import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryFilter from './CategoryFilter';

/**
 * Skenario Pengujian: CategoryFilter
 *
 * Menguji komponen filter kategori yang menampilkan tombol "#Semua" beserta
 * satu tombol untuk setiap kategori, dan berkomunikasi lewat prop
 * onSelectCategory.
 *
 * 1. Komponen merender tombol "#Semua" dan satu tombol per kategori.
 * 2. Menekan "#Semua" memanggil onSelectCategory dengan string kosong ('').
 * 3. Menekan sebuah kategori memanggil onSelectCategory dengan kategori tersebut.
 * 4. Menekan kategori yang sedang aktif memanggil onSelectCategory('') untuk
 *    mematikan filter (toggle off).
 * 5. Atribut aria-pressed mencerminkan nilai selectedCategory.
 */
describe('CategoryFilter', () => {
  it('merender tombol #Semua dan satu tombol per kategori', () => {
    render(<CategoryFilter categories={['React', 'JavaScript']} onSelectCategory={vi.fn()} />);

    expect(screen.getByRole('button', { name: '#Semua' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '#React' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '#JavaScript' })).toBeInTheDocument();
  });

  it('memanggil onSelectCategory dengan string kosong saat #Semua diklik', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<CategoryFilter categories={['React']} selectedCategory="React" onSelectCategory={handleSelect} />);

    await user.click(screen.getByRole('button', { name: '#Semua' }));
    expect(handleSelect).toHaveBeenCalledWith('');
  });

  it('memanggil onSelectCategory dengan nama kategori saat kategori diklik', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<CategoryFilter categories={['React', 'JavaScript']} onSelectCategory={handleSelect} />);

    await user.click(screen.getByRole('button', { name: '#React' }));
    expect(handleSelect).toHaveBeenCalledWith('React');
  });

  it('memanggil onSelectCategory dengan string kosong saat kategori aktif diklik ulang', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<CategoryFilter categories={['React']} selectedCategory="React" onSelectCategory={handleSelect} />);

    await user.click(screen.getByRole('button', { name: '#React' }));
    expect(handleSelect).toHaveBeenCalledWith('');
  });

  it('mencerminkan selectedCategory pada atribut aria-pressed', () => {
    render(<CategoryFilter categories={['React', 'JavaScript']} selectedCategory="JavaScript" onSelectCategory={vi.fn()} />);

    expect(screen.getByRole('button', { name: '#Semua' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: '#React' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: '#JavaScript' })).toHaveAttribute('aria-pressed', 'true');
  });
});

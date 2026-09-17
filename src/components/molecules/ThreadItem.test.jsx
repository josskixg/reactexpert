import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ThreadItem from './ThreadItem';

/**
 * SKENARIO PENGUJIAN KOMPONEN MOLEKUL: ThreadItem
 *
 * Menguji rendering satu kartu diskusi dalam daftar thread:
 * 1. Merender judul, kategori, nama penulis, cuplikan isi, dan jumlah komentar.
 * 2. Menghubungkan tautan judul thread ke halaman detail yang sesuai.
 * 3. Memanggil callback onUpvote dan onDownvote dengan id thread saat tombol vote ditekan.
 */

describe('ThreadItem component', () => {
  const fakeThread = {
    id: 'thread-1',
    title: 'Belajar React Expert',
    body: 'Ini adalah pembahasan lengkap mengenai React Expert dan arsitektur pengujian otomatis.',
    category: 'react',
    createdAt: '2023-05-29T05:58:36.793Z',
    upVotesBy: ['user-2'],
    downVotesBy: [],
    totalComments: 5,
    user: {
      id: 'user-1',
      name: 'Dimas Saputra',
      avatar: 'https://avatar.jpg',
    },
  };

  it('seharusnya merender informasi judul, kategori, nama penulis, dan jumlah komentar', () => {
    // Arrange
    render(
      <MemoryRouter>
        <ThreadItem
          {...fakeThread}
          authUserId="user-2"
          onUpvote={vi.fn()}
          onDownvote={vi.fn()}
        />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Belajar React Expert')).toBeInTheDocument();
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('Dimas Saputra')).toBeInTheDocument();
    expect(screen.getByText('5 Komentar')).toBeInTheDocument();
  });

  it('seharusnya memanggil onUpvote dan onDownvote dengan id thread yang sesuai saat tombol vote diklik', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleUpvote = vi.fn();
    const handleDownvote = vi.fn();

    render(
      <MemoryRouter>
        <ThreadItem
          {...fakeThread}
          authUserId="user-2"
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
        />
      </MemoryRouter>
    );

    const upvoteBtn = screen.getByRole('button', { name: /Dukung \(Upvote\)/i });
    const downvoteBtn = screen.getByRole('button', { name: /Tidak setuju \(Downvote\)/i });

    // Action
    await user.click(upvoteBtn);
    await user.click(downvoteBtn);

    // Assert
    expect(handleUpvote).toHaveBeenCalledWith('thread-1');
    expect(handleDownvote).toHaveBeenCalledWith('thread-1');
  });
});

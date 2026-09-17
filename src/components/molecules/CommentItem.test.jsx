import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentItem from './CommentItem';

/**
 * SKENARIO PENGUJIAN KOMPONEN MOLEKUL: CommentItem
 *
 * Menguji rendering satu item komentar diskusi beserta aksi voting-nya:
 * 1. Merender nama pemilik komentar, avatar, dan isi konten komentar.
 * 2. Menjalankan callback onUpvote dan onDownvote dengan id komentar yang tepat ketika tombol ditekan.
 */

describe('CommentItem component', () => {
  const fakeComment = {
    id: 'comment-1',
    content: 'Komentar yang sangat bermanfaat',
    createdAt: '2023-05-29T05:58:36.793Z',
    owner: {
      id: 'user-1',
      name: 'Dimas Saputra',
      avatar: 'https://avatar.jpg',
    },
    upVotesBy: ['user-2'],
    downVotesBy: [],
  };

  it('seharusnya merender nama pemilik komentar dan konten teks dengan benar', () => {
    // Arrange
    render(
      <CommentItem
        {...fakeComment}
        authUserId="user-2"
        onUpvote={vi.fn()}
        onDownvote={vi.fn()}
      />
    );

    // Assert
    expect(screen.getByText('Dimas Saputra')).toBeInTheDocument();
    expect(screen.getByText('Komentar yang sangat bermanfaat')).toBeInTheDocument();
    expect(screen.getByAltText('Avatar dari Dimas Saputra')).toBeInTheDocument();
  });

  it('seharusnya memanggil onUpvote dan onDownvote dengan argumen id komentar yang sesuai saat tombol vote diklik', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleUpvote = vi.fn();
    const handleDownvote = vi.fn();

    render(
      <CommentItem
        {...fakeComment}
        authUserId="user-2"
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
      />
    );

    const upvoteButton = screen.getByRole('button', { name: /Dukung \(Upvote\)/i });
    const downvoteButton = screen.getByRole('button', { name: /Tidak setuju \(Downvote\)/i });

    // Action
    await user.click(upvoteButton);
    await user.click(downvoteButton);

    // Assert
    expect(handleUpvote).toHaveBeenCalledWith('comment-1');
    expect(handleDownvote).toHaveBeenCalledWith('comment-1');
  });
});

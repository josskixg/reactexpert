import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VoteButton from './VoteButton';

/**
 * Skenario Pengujian: VoteButton
 *
 * Menguji komponen presentasional tombol vote (upvote/downvote) yang hanya
 * menerima data lewat props dan tidak memakai state global.
 *
 * 1. Komponen menampilkan jumlah upvote, jumlah downvote, dan skor total vote.
 * 2. Menekan tombol upvote memanggil callback onUpvote.
 * 3. Menekan tombol downvote memanggil callback onDownvote.
 * 4. Atribut aria-pressed hanya bernilai true pada vote yang sudah diberikan
 *    oleh pengguna yang sedang login (authUserId).
 * 5. Saat authUserId bernilai null, tidak ada tombol yang ditekan dan tidak ada
 *    error yang muncul.
 * 6. Skor negatif dirender sebagai angka biasa, sedangkan skor positif
 *    dirender dengan awalan "+".
 */
describe('VoteButton', () => {
  it('menampilkan jumlah upvote, jumlah downvote, dan skor total vote', () => {
    render(<VoteButton upVotesBy={['user-1', 'user-2']} downVotesBy={['user-3']} authUserId="user-1" />);

    expect(screen.getByRole('button', { name: /dukung \(upvote\)/i })).toHaveTextContent('2');
    expect(screen.getByRole('button', { name: /tidak setuju \(downvote\)/i })).toHaveTextContent('1');
    expect(screen.getByLabelText('Skor total vote 1')).toHaveTextContent('+1');
  });

  it('memanggil onUpvote saat tombol upvote diklik dan onDownvote saat tombol downvote diklik', async () => {
    const user = userEvent.setup();
    const handleUpvote = vi.fn();
    const handleDownvote = vi.fn();

    render(<VoteButton authUserId="user-1" onUpvote={handleUpvote} onDownvote={handleDownvote} />);

    await user.click(screen.getByRole('button', { name: /dukung \(upvote\)/i }));
    expect(handleUpvote).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /tidak setuju \(downvote\)/i }));
    expect(handleDownvote).toHaveBeenCalledTimes(1);
  });

  it('menandai aria-pressed true hanya pada vote yang sudah diberikan pengguna', () => {
    render(<VoteButton upVotesBy={['user-1']} downVotesBy={['user-2']} authUserId="user-1" />);

    expect(screen.getByRole('button', { name: /dukung \(upvote\)/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /tidak setuju \(downvote\)/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('tidak menandai vote apa pun dan tidak error saat authUserId null', () => {
    render(<VoteButton upVotesBy={['user-1']} downVotesBy={['user-2']} authUserId={null} />);

    expect(screen.getByRole('button', { name: /dukung \(upvote\)/i })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: /tidak setuju \(downvote\)/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('merender skor negatif sebagai angka biasa dan skor positif dengan awalan +', () => {
    const { rerender } = render(<VoteButton upVotesBy={[]} downVotesBy={['user-1', 'user-2']} authUserId="user-1" />);
    expect(screen.getByLabelText('Skor total vote -2')).toHaveTextContent('-2');

    rerender(<VoteButton upVotesBy={['user-1', 'user-2', 'user-3']} downVotesBy={[]} authUserId="user-1" />);
    expect(screen.getByLabelText('Skor total vote 3')).toHaveTextContent('+3');
  });
});

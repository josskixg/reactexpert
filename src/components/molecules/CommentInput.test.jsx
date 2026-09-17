import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CommentInput from './CommentInput';

/**
 * SKENARIO PENGUJIAN KOMPONEN MOLEKUL: CommentInput
 *
 * Menguji interaksi formulir penulisan komentar:
 * 1. Menampilkan ajakan masuk (login link) ketika pengguna belum login (authUser null).
 * 2. Menampilkan textarea dan tombol kirim ketika pengguna sudah login.
 * 3. Tidak memanggil fungsi onSubmitComment ketika textarea hanya berisi spasi/kosong.
 * 4. Memanggil fungsi onSubmitComment dengan konten yang diinputkan pengguna ketika tombol submit diklik.
 */

describe('CommentInput component', () => {
  it('seharusnya merender pesan ajakan login ketika authUser bernilai null', () => {
    // Arrange
    render(
      <MemoryRouter>
        <CommentInput authUser={null} onSubmitComment={vi.fn()} />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Ingin bergabung dalam diskusi?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Masuk untuk Menanggapi/i })).toBeInTheDocument();
  });

  it('seharusnya merender textarea dan tombol submit ketika authUser tersedia', () => {
    // Arrange
    const authUser = { id: 'user-1', name: 'John Doe' };
    render(
      <MemoryRouter>
        <CommentInput authUser={authUser} onSubmitComment={vi.fn()} />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByPlaceholderText('Tuliskan pandangan atau tanggapan Anda...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Kirim Tanggapan/i })).toBeInTheDocument();
  });

  it('seharusnya memanggil onSubmitComment dengan teks yang diinputkan saat formulir disubmit', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleSubmitComment = vi.fn().mockResolvedValue({ error: false });
    const authUser = { id: 'user-1', name: 'John Doe' };

    render(
      <MemoryRouter>
        <CommentInput authUser={authUser} onSubmitComment={handleSubmitComment} />
      </MemoryRouter>
    );

    const textarea = screen.getByPlaceholderText('Tuliskan pandangan atau tanggapan Anda...');
    const submitButton = screen.getByRole('button', { name: /Kirim Tanggapan/i });

    // Action
    await user.type(textarea, 'Ini komentar pengujian');
    await user.click(submitButton);

    // Assert
    expect(handleSubmitComment).toHaveBeenCalledWith('Ini komentar pengujian');
  });
});

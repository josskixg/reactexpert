import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LeaderboardItem from './LeaderboardItem';

/**
 * SKENARIO PENGUJIAN KOMPONEN MOLEKUL: LeaderboardItem
 *
 * Menguji rendering baris peringkat pada halaman klasemen:
 * 1. Merender nama pengguna, email, avatar, dan perolehan skor dengan tepat.
 * 2. Menampilkan badge peringkat khusus (Peringkat 1, 2, 3) untuk posisi teratas.
 * 3. Menampilkan teks peringkat biasa (#4, #5, dst) untuk peringkat di atas 3.
 */

describe('LeaderboardItem component', () => {
  const fakeUser = {
    id: 'user-1',
    name: 'Dimas Saputra',
    email: 'dimas@dicoding.com',
    avatar: 'https://avatar.jpg',
  };

  it('seharusnya merender informasi pengguna dan perolehan skor dengan benar', () => {
    // Arrange
    render(<LeaderboardItem rank={1} user={fakeUser} score={150} />);

    // Assert
    expect(screen.getByText('Dimas Saputra')).toBeInTheDocument();
    expect(screen.getByText('dimas@dicoding.com')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByAltText('Avatar dari Dimas Saputra')).toBeInTheDocument();
  });

  it('seharusnya merender badge piala untuk peringkat 1, 2, dan 3', () => {
    // Arrange & Action (Rank 1)
    const { rerender } = render(<LeaderboardItem rank={1} user={fakeUser} score={100} />);
    expect(screen.getByTitle('Peringkat 1')).toBeInTheDocument();

    // Rerender (Rank 2)
    rerender(<LeaderboardItem rank={2} user={fakeUser} score={80} />);
    expect(screen.getByTitle('Peringkat 2')).toBeInTheDocument();

    // Rerender (Rank 3)
    rerender(<LeaderboardItem rank={3} user={fakeUser} score={60} />);
    expect(screen.getByTitle('Peringkat 3')).toBeInTheDocument();
  });

  it('seharusnya merender label angka biasa untuk peringkat 4 ke atas', () => {
    // Arrange & Action
    render(<LeaderboardItem rank={4} user={fakeUser} score={40} />);

    // Assert
    expect(screen.getByTitle('Peringkat 4')).toBeInTheDocument();
    expect(screen.getByText('#4')).toBeInTheDocument();
  });
});

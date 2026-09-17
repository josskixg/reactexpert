import { describe, it, expect } from 'vitest';
import leaderboardsReducer from './reducer';
import { ActionType } from './action';

/**
 * SKENARIO PENGUJIAN REDUCER LEADERBOARDS
 *
 * Menguji pure function dari leaderboardsReducer dalam mengelola daftar klasemen pengguna teraktif.
 *
 * Skenario yang diuji:
 * 1. RECEIVE_LEADERBOARDS : reducer mengembalikan daftar data klasemen dari payload.
 * 2. Aksi tidak dikenal   : reducer mengembalikan state saat ini tanpa perubahan ketika aksi tidak dikenal diterima.
 * 3. Inisialisasi awal    : reducer mengembalikan array kosong ([]) sebagai nilai default ketika state awal undefined.
 */

describe('leaderboardsReducer', () => {
  it('seharusnya mengembalikan daftar leaderboards dari payload ketika aksi RECEIVE_LEADERBOARDS diterima', () => {
    // Arrange
    const initialState = [];
    const action = {
      type: ActionType.RECEIVE_LEADERBOARDS,
      payload: {
        leaderboards: [
          {
            user: { id: 'user-1', name: 'Dimas Saputra', email: 'dimas@dicoding.com', avatar: 'https://avatar.jpg' },
            score: 100,
          },
          {
            user: { id: 'user-2', name: 'Dicoding', email: 'admin@dicoding.com', avatar: 'https://avatar2.jpg' },
            score: 80,
          },
        ],
      },
    };

    // Action
    const actualState = leaderboardsReducer(initialState, action);

    // Assert
    expect(actualState).toEqual(action.payload.leaderboards);
    expect(actualState).toHaveLength(2);
  });

  it('seharusnya mengembalikan state saat ini ketika aksi tidak dikenal diberikan', () => {
    // Arrange
    const initialState = [{ user: { id: 'user-1' }, score: 50 }];
    const action = {
      type: 'UNKNOWN_ACTION',
    };

    // Action
    const actualState = leaderboardsReducer(initialState, action);

    // Assert
    expect(actualState).toBe(initialState);
  });

  it('seharusnya mengembalikan array kosong sebagai nilai default ketika state awal bernilai undefined', () => {
    // Arrange
    const action = {
      type: 'UNKNOWN_ACTION',
    };

    // Action
    const actualState = leaderboardsReducer(undefined, action);

    // Assert
    expect(actualState).toEqual([]);
  });
});

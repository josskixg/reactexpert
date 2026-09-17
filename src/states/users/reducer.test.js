import { describe, it, expect } from 'vitest';
import usersReducer from './reducer';
import { ActionType } from './action';

/**
 * SKENARIO PENGUJIAN REDUCER USERS
 *
 * Menguji pure function dari usersReducer dalam mengelola daftar seluruh pengguna di forum.
 *
 * Skenario yang diuji:
 * 1. RECEIVE_USERS      : reducer mengembalikan daftar data users dari payload.
 * 2. Aksi tidak dikenal : reducer mengembalikan state saat ini tanpa perubahan ketika aksi tidak dikenal diterima.
 * 3. Inisialisasi awal  : reducer mengembalikan array kosong ([]) sebagai nilai default ketika state awal undefined.
 */

describe('usersReducer', () => {
  it('seharusnya mengembalikan daftar users dari payload ketika aksi RECEIVE_USERS diterima', () => {
    // Arrange
    const initialState = [];
    const action = {
      type: ActionType.RECEIVE_USERS,
      payload: {
        users: [
          { id: 'user-1', name: 'Dimas Saputra', email: 'dimas@dicoding.com', avatar: 'https://avatar1.jpg' },
          { id: 'user-2', name: 'Dicoding Academy', email: 'admin@dicoding.com', avatar: 'https://avatar2.jpg' },
        ],
      },
    };

    // Action
    const actualState = usersReducer(initialState, action);

    // Assert
    expect(actualState).toEqual(action.payload.users);
    expect(actualState).toHaveLength(2);
  });

  it('seharusnya mengembalikan state saat ini ketika aksi tidak dikenal diberikan', () => {
    // Arrange
    const initialState = [{ id: 'user-1', name: 'Dimas' }];
    const action = {
      type: 'UNKNOWN_ACTION',
    };

    // Action
    const actualState = usersReducer(initialState, action);

    // Assert
    expect(actualState).toBe(initialState);
  });

  it('seharusnya mengembalikan array kosong sebagai nilai default ketika state awal bernilai undefined', () => {
    // Arrange
    const action = {
      type: 'UNKNOWN_ACTION',
    };

    // Action
    const actualState = usersReducer(undefined, action);

    // Assert
    expect(actualState).toEqual([]);
  });
});

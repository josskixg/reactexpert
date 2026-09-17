import { describe, it, expect } from 'vitest';
import authUserReducer from './reducer';
import { ActionType } from './action';

/**
 * SKENARIO PENGUJIAN REDUCER AUTHUSER
 *
 * Menguji pure function dari authUserReducer dalam mengelola status autentikasi pengguna.
 *
 * Skenario yang diuji:
 * 1. SET_AUTH_USER   : reducer mengembalikan data authUser dari payload ketika aksi SET_AUTH_USER diterima.
 * 2. UNSET_AUTH_USER : reducer mengembalikan null ketika aksi logout (UNSET_AUTH_USER) diterima.
 * 3. Aksi tidak dikenal : reducer mengembalikan state saat ini tanpa perubahan ketika aksi tidak dikenal diterima.
 * 4. Inisialisasi awal  : reducer mengembalikan null sebagai nilai default ketika state awal undefined.
 */

describe('authUserReducer', () => {
  it('seharusnya mengembalikan data authUser dari payload ketika aksi SET_AUTH_USER diterima', () => {
    // Arrange
    const initialState = null;
    const action = {
      type: ActionType.SET_AUTH_USER,
      payload: {
        authUser: {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://generated-image-url.jpg',
        },
      },
    };

    // Action
    const actualState = authUserReducer(initialState, action);

    // Assert
    expect(actualState).toEqual(action.payload.authUser);
  });

  it('seharusnya mengembalikan null ketika aksi UNSET_AUTH_USER diterima', () => {
    // Arrange
    const initialState = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://generated-image-url.jpg',
    };
    const action = {
      type: ActionType.UNSET_AUTH_USER,
    };

    // Action
    const actualState = authUserReducer(initialState, action);

    // Assert
    expect(actualState).toBeNull();
  });

  it('seharusnya mengembalikan state saat ini ketika aksi tidak dikenal diberikan', () => {
    // Arrange
    const initialState = {
      id: 'user-1',
      name: 'John Doe',
    };
    const action = {
      type: 'UNKNOWN_ACTION',
    };

    // Action
    const actualState = authUserReducer(initialState, action);

    // Assert
    expect(actualState).toBe(initialState);
  });

  it('seharusnya mengembalikan nilai default (null) ketika state awal bernilai undefined', () => {
    // Arrange
    const action = {
      type: 'UNKNOWN_ACTION',
    };

    // Action
    const actualState = authUserReducer(undefined, action);

    // Assert
    expect(actualState).toBeNull();
  });
});

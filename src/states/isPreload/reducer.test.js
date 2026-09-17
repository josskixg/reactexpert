import { describe, it, expect } from 'vitest';
import isPreloadReducer from './reducer';
import { ActionType } from './action';

/**
 * SKENARIO PENGUJIAN REDUCER IS_PRELOAD
 *
 * Menguji pure function dari isPreloadReducer dalam mengelola status preloading aplikasi saat pertama kali dimuat.
 *
 * Skenario yang diuji:
 * 1. SET_IS_PRELOAD    : reducer mengembalikan nilai boolean isPreload sesuai dengan payload yang diberikan.
 * 2. Aksi tidak dikenal : reducer mengembalikan state saat ini tanpa perubahan ketika aksi tidak dikenal diterima.
 * 3. Inisialisasi awal  : reducer mengembalikan true sebagai nilai default ketika state awal undefined.
 */

describe('isPreloadReducer', () => {
  it('seharusnya mengembalikan nilai isPreload dari payload ketika aksi SET_IS_PRELOAD diterima', () => {
    // Arrange
    const initialState = true;
    const action = {
      type: ActionType.SET_IS_PRELOAD,
      payload: {
        isPreload: false,
      },
    };

    // Action
    const actualState = isPreloadReducer(initialState, action);

    // Assert
    expect(actualState).toBe(false);
  });

  it('seharusnya mengembalikan state saat ini ketika aksi tidak dikenal diberikan', () => {
    // Arrange
    const initialState = false;
    const action = {
      type: 'UNKNOWN_ACTION',
    };

    // Action
    const actualState = isPreloadReducer(initialState, action);

    // Assert
    expect(actualState).toBe(false);
  });

  it('seharusnya mengembalikan nilai default (true) ketika state awal bernilai undefined', () => {
    // Arrange
    const action = {
      type: 'UNKNOWN_ACTION',
    };

    // Action
    const actualState = isPreloadReducer(undefined, action);

    // Assert
    expect(actualState).toBe(true);
  });
});

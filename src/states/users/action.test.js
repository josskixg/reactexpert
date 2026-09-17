import { describe, it, expect, vi, beforeEach } from 'vitest';
import { asyncRegisterUser } from './action';
import { ActionType as LoadingActionType } from '../loading/action';
import { ActionType as ModalActionType } from '../modal/action';
import api from '../../api/api';

vi.mock('../../api/api', () => ({
  default: {
    register: vi.fn(),
  },
}));

/**
 * SKENARIO PENGUJIAN THUNK USERS ACTION
 *
 * Menguji fungsi thunk asyncRegisterUser dalam mendaftarkan akun baru ke API.
 *
 * Skenario yang diuji:
 * 1. asyncRegisterUser BERHASIL :
 *    - Memanggil api.register dengan name, email, password.
 *    - Melakukan dispatch showLoading, showModal (success), dan hideLoading.
 *    - Mengembalikan objek { error: false }.
 * 2. asyncRegisterUser GAGAL :
 *    - Ketika api.register gagal (reject), melakukan dispatch showModal bertipe error dan hideLoading.
 *    - Mengembalikan objek { error: true, message }.
 */

describe('asyncRegisterUser thunk', () => {
  const fakeRegisterPayload = {
    name: 'New User',
    email: 'newuser@example.com',
    password: 'secretpassword',
  };

  const fakeError = new Error('Email sudah terdaftar');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('seharusnya dispatch aksi secara berurutan dan mengembalikan error false ketika pendaftaran berhasil', async () => {
    // Arrange
    api.register.mockResolvedValue({});
    const dispatch = vi.fn();

    // Action
    const result = await asyncRegisterUser(fakeRegisterPayload)(dispatch);

    // Assert
    expect(dispatch).toHaveBeenCalledWith({ type: LoadingActionType.SHOW_LOADING });
    expect(api.register).toHaveBeenCalledWith(fakeRegisterPayload);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: ModalActionType.SHOW_MODAL,
        payload: expect.objectContaining({
          type: 'success',
          title: 'Pendaftaran Berhasil',
        }),
      })
    );
    expect(dispatch).toHaveBeenCalledWith({ type: LoadingActionType.HIDE_LOADING });
    expect(result).toEqual({ error: false });
  });

  it('seharusnya dispatch showModal error dan mengembalikan error true ketika pendaftaran gagal', async () => {
    // Arrange
    api.register.mockRejectedValue(fakeError);
    const dispatch = vi.fn();

    // Action
    const result = await asyncRegisterUser(fakeRegisterPayload)(dispatch);

    // Assert
    expect(dispatch).toHaveBeenCalledWith({ type: LoadingActionType.SHOW_LOADING });
    expect(api.register).toHaveBeenCalledWith(fakeRegisterPayload);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: ModalActionType.SHOW_MODAL,
        payload: expect.objectContaining({
          type: 'error',
          title: 'Pendaftaran Gagal',
        }),
      })
    );
    expect(dispatch).toHaveBeenCalledWith({ type: LoadingActionType.HIDE_LOADING });
    expect(result).toEqual({ error: true, message: fakeError.message });
  });
});

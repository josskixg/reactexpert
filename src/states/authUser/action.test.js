/**
 * SKENARIO PENGUJIAN — state authUser (src/states/authUser/action.js)
 *
 * Berkas ini menguji thunk action creator pada state authUser. Seluruh
 * pemanggilan jaringan ke `src/api/api.js` digantikan oleh mock, sehingga
 * tidak ada permintaan HTTP sungguhan yang terjadi selama pengujian.
 *
 * Skenario yang diuji:
 * 1. asyncSetAuthUser BERHASIL: `api.login` dipanggil dengan { email, password },
 *    token disimpan melalui `api.putAccessToken`, profil diambil lewat
 *    `api.getOwnProfile`, lalu dispatch urut: show loading, SET_AUTH_USER,
 *    hide loading, dan thunk mengembalikan { error: false }.
 * 2. asyncSetAuthUser GAGAL: `api.login` menolak (reject), thunk menampilkan
 *    modal bertipe 'error', mengembalikan { error: true }, dan TIDAK pernah
 *    dispatch SET_AUTH_USER maupun memanggil `api.getOwnProfile`.
 * 3. asyncSetAuthUser tetap menyembunyikan loading (hide loading) walau login
 *    gagal, karena blok finally selalu dieksekusi.
 * 4. asyncUnsetAuthUser: dispatch UNSET_AUTH_USER dan menghapus access token
 *    dengan memanggil `api.putAccessToken('')`.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../api/api', () => ({
  default: {
    login: vi.fn(),
    putAccessToken: vi.fn(),
    getOwnProfile: vi.fn(),
    createComment: vi.fn(),
    upVoteThread: vi.fn(),
    downVoteThread: vi.fn(),
    neutralizeVoteThread: vi.fn(),
  },
}));

import api from '../../api/api';
import { ActionType, asyncSetAuthUser, asyncUnsetAuthUser } from './action';
import { ActionType as LoadingActionType } from '../loading/action';
import { ActionType as ModalActionType } from '../modal/action';

describe('asyncSetAuthUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('harus menyimpan token, mengambil profil, dan dispatch SET_AUTH_USER ketika login berhasil', async () => {
    const token = 'token-rahasia';
    const profile = { id: 'user-1', name: 'Pengguna Uji' };
    api.login.mockResolvedValue(token);
    api.getOwnProfile.mockResolvedValue(profile);

    const dispatch = vi.fn();
    const getState = () => ({ authUser: null });

    const result = await asyncSetAuthUser({ email: 'user@example.com', password: 'rahasia' })(
      dispatch,
      getState
    );

    expect(api.login).toHaveBeenCalledWith({ email: 'user@example.com', password: 'rahasia' });
    expect(api.putAccessToken).toHaveBeenCalledWith(token);
    expect(api.getOwnProfile).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ error: false });

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: LoadingActionType.SHOW_LOADING })
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: ActionType.SET_AUTH_USER })
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: LoadingActionType.HIDE_LOADING })
    );
  });

  it('harus menampilkan modal error dan mengembalikan { error: true } ketika login gagal', async () => {
    api.login.mockRejectedValue(new Error('Email atau kata sandi tidak valid.'));

    const dispatch = vi.fn();
    const getState = () => ({ authUser: null });

    const result = await asyncSetAuthUser({ email: 'salah@example.com', password: 'salah' })(
      dispatch,
      getState
    );

    const actions = dispatch.mock.calls.map(([action]) => action);
    const modalAction = actions.find((action) => action.type === ModalActionType.SHOW_MODAL);

    expect(result).toEqual({ error: true, message: 'Email atau kata sandi tidak valid.' });
    expect(modalAction).toBeDefined();
    expect(modalAction.payload.type).toBe('error');
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: ActionType.SET_AUTH_USER })
    );
    expect(api.getOwnProfile).not.toHaveBeenCalled();
  });

  it('harus tetap dispatch hide loading walaupun login gagal', async () => {
    api.login.mockRejectedValue(new Error('Jaringan bermasalah.'));

    const dispatch = vi.fn();
    const getState = () => ({ authUser: null });

    await asyncSetAuthUser({ email: 'user@example.com', password: 'rahasia' })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: LoadingActionType.HIDE_LOADING })
    );
  });
});

describe('asyncUnsetAuthUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('harus dispatch UNSET_AUTH_USER dan mengosongkan access token', async () => {
    const dispatch = vi.fn();

    await asyncUnsetAuthUser()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: ActionType.UNSET_AUTH_USER })
    );
    expect(api.putAccessToken).toHaveBeenCalledWith('');
  });
});

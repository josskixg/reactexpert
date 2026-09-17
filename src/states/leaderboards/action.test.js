import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ActionType, asyncReceiveLeaderboards } from './action';
import { ActionType as LoadingActionType } from '../loading/action';
import { ActionType as ModalActionType } from '../modal/action';
import api from '../../api/api';

vi.mock('../../api/api', () => ({
  default: {
    getLeaderboards: vi.fn(),
  },
}));

/**
 * SKENARIO PENGUJIAN THUNK LEADERBOARDS ACTION
 *
 * Menguji fungsi thunk asyncReceiveLeaderboards dalam mengambil daftar klasemen pengguna.
 *
 * Skenario yang diuji:
 * 1. asyncReceiveLeaderboards BERHASIL :
 *    - Memanggil api.getLeaderboards
 *    - Melakukan dispatch showLoading, receiveLeaderboards, dan hideLoading.
 * 2. asyncReceiveLeaderboards GAGAL :
 *    - Ketika api gagal, melakukan dispatch showModal bertipe error dan tetap hideLoading.
 */

describe('asyncReceiveLeaderboards thunk', () => {
  const fakeLeaderboardsResponse = [
    {
      user: { id: 'user-1', name: 'Dimas Saputra', email: 'dimas@dicoding.com', avatar: 'https://avatar1.jpg' },
      score: 100,
    },
  ];

  const fakeError = new Error('Gagal mengambil data klasemen');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('seharusnya dispatch aksi secara berurutan ketika pengambilan leaderboards berhasil', async () => {
    // Arrange
    api.getLeaderboards.mockResolvedValue(fakeLeaderboardsResponse);
    const dispatch = vi.fn();

    // Action
    await asyncReceiveLeaderboards()(dispatch);

    // Assert
    expect(dispatch).toHaveBeenCalledWith({ type: LoadingActionType.SHOW_LOADING });
    expect(dispatch).toHaveBeenCalledWith({
      type: ActionType.RECEIVE_LEADERBOARDS,
      payload: { leaderboards: fakeLeaderboardsResponse },
    });
    expect(dispatch).toHaveBeenCalledWith({ type: LoadingActionType.HIDE_LOADING });
  });

  it('seharusnya dispatch showModal error ketika pengambilan leaderboards gagal', async () => {
    // Arrange
    api.getLeaderboards.mockRejectedValue(fakeError);
    const dispatch = vi.fn();

    // Action
    await asyncReceiveLeaderboards()(dispatch);

    // Assert
    expect(dispatch).toHaveBeenCalledWith({ type: LoadingActionType.SHOW_LOADING });
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: ModalActionType.SHOW_MODAL,
        payload: expect.objectContaining({
          type: 'error',
          title: 'Gagal Memuat Klasemen',
        }),
      })
    );
    expect(dispatch).toHaveBeenCalledWith({ type: LoadingActionType.HIDE_LOADING });
  });
});

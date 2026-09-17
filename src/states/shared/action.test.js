import { describe, it, expect, vi, beforeEach } from 'vitest';
import { asyncPopulateUsersAndThreads } from './action';
import { ActionType as UsersActionType } from '../users/action';
import { ActionType as ThreadsActionType } from '../threads/action';
import { ActionType as LoadingActionType } from '../loading/action';
import { ActionType as ModalActionType } from '../modal/action';
import api from '../../api/api';

vi.mock('../../api/api', () => ({
  default: {
    getAllUsers: vi.fn(),
    getAllThreads: vi.fn(),
  },
}));

/**
 * SKENARIO PENGUJIAN THUNK SHARED ACTION
 *
 * Menguji fungsi thunk asyncPopulateUsersAndThreads yang memuat data pengguna dan diskusi secara bersamaan.
 *
 * Skenario yang diuji:
 * 1. asyncPopulateUsersAndThreads BERHASIL :
 *    - Memanggil api.getAllUsers dan api.getAllThreads secara bersamaan.
 *    - Mengirimkan (dispatch) showLoading, receiveUsers, receiveThreads, dan hideLoading.
 * 2. asyncPopulateUsersAndThreads GAGAL :
 *    - Ketika salah satu API gagal (reject), mengirimkan showModal bertipe error.
 *    - Tetap mengeksekusi hideLoading di blok finally.
 */

describe('asyncPopulateUsersAndThreads thunk', () => {
  const fakeUsersResponse = [
    { id: 'user-1', name: 'John Doe', email: 'john@example.com', avatar: 'https://avatar1.jpg' },
  ];

  const fakeThreadsResponse = [
    {
      id: 'thread-1',
      title: 'Thread Test',
      body: 'Body Test',
      category: 'redux',
      createdAt: '2023-05-29T05:58:36.793Z',
      ownerId: 'user-1',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 0,
    },
  ];

  const fakeError = new Error('Terjadi kesalahan jaringan');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('seharusnya melakukan dispatch aksi secara berurutan ketika pemuatan data berhasil', async () => {
    // Arrange
    api.getAllUsers.mockResolvedValue(fakeUsersResponse);
    api.getAllThreads.mockResolvedValue(fakeThreadsResponse);
    const dispatch = vi.fn();

    // Action
    await asyncPopulateUsersAndThreads()(dispatch);

    // Assert
    expect(dispatch).toHaveBeenCalledWith({ type: LoadingActionType.SHOW_LOADING });
    expect(dispatch).toHaveBeenCalledWith({
      type: UsersActionType.RECEIVE_USERS,
      payload: { users: fakeUsersResponse },
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: ThreadsActionType.RECEIVE_THREADS,
      payload: { threads: fakeThreadsResponse },
    });
    expect(dispatch).toHaveBeenCalledWith({ type: LoadingActionType.HIDE_LOADING });
  });

  it('seharusnya melakukan dispatch aksi showModal error ketika pemuatan data gagal', async () => {
    // Arrange
    api.getAllUsers.mockRejectedValue(fakeError);
    api.getAllThreads.mockResolvedValue(fakeThreadsResponse);
    const dispatch = vi.fn();

    // Action
    await asyncPopulateUsersAndThreads()(dispatch);

    // Assert
    expect(dispatch).toHaveBeenCalledWith({ type: LoadingActionType.SHOW_LOADING });
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: ModalActionType.SHOW_MODAL,
        payload: expect.objectContaining({
          type: 'error',
          title: 'Gagal Memuat Data',
        }),
      })
    );
    expect(dispatch).toHaveBeenCalledWith({ type: LoadingActionType.HIDE_LOADING });
  });
});

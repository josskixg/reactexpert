import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ActionType,
  asyncAddThread,
  asyncToggleUpvoteThread,
  asyncToggleDownvoteThread,
} from './action';
import { ActionType as LoadingActionType } from '../loading/action';
import { ActionType as ModalActionType } from '../modal/action';
import api from '../../api/api';

vi.mock('../../api/api', () => ({
  default: {
    createThread: vi.fn(),
    upVoteThread: vi.fn(),
    downVoteThread: vi.fn(),
    neutralizeVoteThread: vi.fn(),
  },
}));

/**
 * SKENARIO PENGUJIAN THUNK THREADS ACTION
 *
 * Menguji fungsi-fungsi thunk pada module threads:
 * 1. asyncAddThread :
 *    - Berhasil: dispatch showLoading, addThread, showModal (success), hideLoading, return { error: false }
 *    - Gagal: dispatch showLoading, showModal (error), hideLoading, return { error: true }
 * 2. asyncToggleUpvoteThread :
 *    - Belum login: dispatch showModal info, tidak memanggil api
 *    - Sudah login & belum upvote: optimistic dispatch toggleUpvote, panggil api.upVoteThread
 *    - Sudah login & sudah upvote: optimistic dispatch neutralize, panggil api.neutralizeVoteThread
 *    - API gagal: rollback dispatch dan tampilkan showModal error
 * 3. asyncToggleDownvoteThread :
 *    - Belum login: dispatch showModal info, tidak memanggil api
 *    - Sudah login & belum downvote: optimistic dispatch toggleDownvote, panggil api.downVoteThread
 *    - API gagal: rollback dispatch dan tampilkan showModal error
 */

describe('threads thunk actions', () => {
  const fakeThread = {
    id: 'thread-1',
    title: 'Testing Thread',
    body: 'Testing Body',
    category: 'testing',
    createdAt: '2023-05-29T05:58:36.793Z',
    ownerId: 'user-1',
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 0,
  };

  const fakeError = new Error('Terjadi kesalahan server');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('asyncAddThread', () => {
    it('seharusnya dispatch aksi dengan benar dan mengembalikan error false ketika berhasil membuat thread', async () => {
      // Arrange
      api.createThread.mockResolvedValue(fakeThread);
      const dispatch = vi.fn();

      // Action
      const result = await asyncAddThread({
        title: 'Testing Thread',
        body: 'Testing Body',
        category: 'testing',
      })(dispatch);

      // Assert
      expect(dispatch).toHaveBeenCalledWith({ type: LoadingActionType.SHOW_LOADING });
      expect(dispatch).toHaveBeenCalledWith({
        type: ActionType.ADD_THREAD,
        payload: { thread: fakeThread },
      });
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ModalActionType.SHOW_MODAL,
          payload: expect.objectContaining({ type: 'success' }),
        })
      );
      expect(dispatch).toHaveBeenCalledWith({ type: LoadingActionType.HIDE_LOADING });
      expect(result).toEqual({ error: false });
    });

    it('seharusnya dispatch showModal error dan mengembalikan error true ketika gagal membuat thread', async () => {
      // Arrange
      api.createThread.mockRejectedValue(fakeError);
      const dispatch = vi.fn();

      // Action
      const result = await asyncAddThread({
        title: 'Testing Thread',
        body: 'Testing Body',
      })(dispatch);

      // Assert
      expect(dispatch).toHaveBeenCalledWith({ type: LoadingActionType.SHOW_LOADING });
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ModalActionType.SHOW_MODAL,
          payload: expect.objectContaining({ type: 'error' }),
        })
      );
      expect(dispatch).toHaveBeenCalledWith({ type: LoadingActionType.HIDE_LOADING });
      expect(result).toEqual({ error: true, message: fakeError.message });
    });
  });

  describe('asyncToggleUpvoteThread', () => {
    it('seharusnya dispatch modal info dan tidak memanggil API ketika pengguna belum masuk (authUser null)', async () => {
      // Arrange
      const dispatch = vi.fn();
      const getState = () => ({ authUser: null, threads: [fakeThread] });

      // Action
      await asyncToggleUpvoteThread('thread-1')(dispatch, getState);

      // Assert
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ModalActionType.SHOW_MODAL,
          payload: expect.objectContaining({ type: 'info' }),
        })
      );
      expect(api.upVoteThread).not.toHaveBeenCalled();
    });

    it('seharusnya melakukan dispatch toggleUpvote dan memanggil api.upVoteThread ketika pengguna belum upvote', async () => {
      // Arrange
      api.upVoteThread.mockResolvedValue({});
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threads: [{ ...fakeThread, upVotesBy: [] }],
      });

      // Action
      await asyncToggleUpvoteThread('thread-1')(dispatch, getState);

      // Assert
      expect(dispatch).toHaveBeenCalledWith({
        type: ActionType.TOGGLE_UPVOTE_THREAD,
        payload: { threadId: 'thread-1', userId: 'user-1' },
      });
      expect(api.upVoteThread).toHaveBeenCalledWith('thread-1');
    });

    it('seharusnya melakukan dispatch neutralize dan memanggil api.neutralizeVoteThread ketika pengguna sudah upvote', async () => {
      // Arrange
      api.neutralizeVoteThread.mockResolvedValue({});
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threads: [{ ...fakeThread, upVotesBy: ['user-1'] }],
      });

      // Action
      await asyncToggleUpvoteThread('thread-1')(dispatch, getState);

      // Assert
      expect(dispatch).toHaveBeenCalledWith({
        type: ActionType.NEUTRALIZE_VOTE_THREAD,
        payload: { threadId: 'thread-1', userId: 'user-1' },
      });
      expect(api.neutralizeVoteThread).toHaveBeenCalledWith('thread-1');
    });

    it('seharusnya rollback vote dan dispatch modal error ketika API upVoteThread gagal', async () => {
      // Arrange
      api.upVoteThread.mockRejectedValue(fakeError);
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threads: [{ ...fakeThread, upVotesBy: [] }],
      });

      // Action
      await asyncToggleUpvoteThread('thread-1')(dispatch, getState);

      // Assert
      // Optimistic
      expect(dispatch).toHaveBeenCalledWith({
        type: ActionType.TOGGLE_UPVOTE_THREAD,
        payload: { threadId: 'thread-1', userId: 'user-1' },
      });
      // Error modal
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ModalActionType.SHOW_MODAL,
          payload: expect.objectContaining({ type: 'error' }),
        })
      );
      // Rollback
      expect(dispatch).toHaveBeenCalledWith({
        type: ActionType.NEUTRALIZE_VOTE_THREAD,
        payload: { threadId: 'thread-1', userId: 'user-1' },
      });
    });
  });

  describe('asyncToggleDownvoteThread', () => {
    it('seharusnya dispatch modal info dan tidak memanggil API ketika pengguna belum masuk (authUser null)', async () => {
      // Arrange
      const dispatch = vi.fn();
      const getState = () => ({ authUser: null, threads: [fakeThread] });

      // Action
      await asyncToggleDownvoteThread('thread-1')(dispatch, getState);

      // Assert
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ModalActionType.SHOW_MODAL,
          payload: expect.objectContaining({ type: 'info' }),
        })
      );
      expect(api.downVoteThread).not.toHaveBeenCalled();
    });

    it('seharusnya melakukan dispatch toggleDownvote dan memanggil api.downVoteThread ketika pengguna belum downvote', async () => {
      // Arrange
      api.downVoteThread.mockResolvedValue({});
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threads: [{ ...fakeThread, downVotesBy: [] }],
      });

      // Action
      await asyncToggleDownvoteThread('thread-1')(dispatch, getState);

      // Assert
      expect(dispatch).toHaveBeenCalledWith({
        type: ActionType.TOGGLE_DOWNVOTE_THREAD,
        payload: { threadId: 'thread-1', userId: 'user-1' },
      });
      expect(api.downVoteThread).toHaveBeenCalledWith('thread-1');
    });

    it('seharusnya rollback vote dan dispatch modal error ketika API downVoteThread gagal', async () => {
      // Arrange
      api.downVoteThread.mockRejectedValue(fakeError);
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { id: 'user-1' },
        threads: [{ ...fakeThread, downVotesBy: [] }],
      });

      // Action
      await asyncToggleDownvoteThread('thread-1')(dispatch, getState);

      // Assert
      expect(dispatch).toHaveBeenCalledWith({
        type: ActionType.TOGGLE_DOWNVOTE_THREAD,
        payload: { threadId: 'thread-1', userId: 'user-1' },
      });
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ModalActionType.SHOW_MODAL,
          payload: expect.objectContaining({ type: 'error' }),
        })
      );
      expect(dispatch).toHaveBeenCalledWith({
        type: ActionType.NEUTRALIZE_VOTE_THREAD,
        payload: { threadId: 'thread-1', userId: 'user-1' },
      });
    });
  });
});

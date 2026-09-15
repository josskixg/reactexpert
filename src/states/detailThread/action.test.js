/**
 * SKENARIO PENGUJIAN — state detailThread (src/states/detailThread/action.js)
 *
 * Berkas ini menguji thunk action creator pada state detailThread. Seluruh
 * pemanggilan jaringan ke `src/api/api.js` digantikan oleh mock, sehingga
 * tidak ada permintaan HTTP sungguhan yang terjadi selama pengujian.
 *
 * Skenario yang diuji:
 * 1. asyncAddComment BERHASIL: `api.createComment` dipanggil dengan
 *    { threadId, content }, dispatch ADD_COMMENT dan modal sukses, lalu
 *    mengembalikan { error: false }.
 * 2. asyncAddComment GAGAL: `api.createComment` menolak (reject), thunk
 *    menampilkan modal bertipe 'error' dan mengembalikan { error: true }.
 * 3. asyncToggleUpvoteDetailThread saat BELUM login: menampilkan modal
 *    bertipe 'info' dan TIDAK memanggil `api.upVoteThread`.
 * 4. asyncToggleUpvoteDetailThread saat login dan belum upvote: dispatch
 *    TOGGLE_UPVOTE_DETAIL_THREAD lebih dulu (optimistic), baru memanggil
 *    `api.upVoteThread`.
 * 5. asyncToggleUpvoteDetailThread saat API menolak: memastikan dispatch
 *    rollback NEUTRALIZE_VOTE_DETAIL_THREAD dikirim SETELAH dispatch
 *    optimistic TOGGLE_UPVOTE_DETAIL_THREAD.
 * 6. asyncToggleDownvoteDetailThread saat login dan belum downvote: dispatch
 *    TOGGLE_DOWNVOTE_DETAIL_THREAD lebih dulu, baru memanggil
 *    `api.downVoteThread`.
 * 7. asyncToggleDownvoteDetailThread saat API menolak: memastikan dispatch
 *    rollback NEUTRALIZE_VOTE_DETAIL_THREAD dikirim SETELAH dispatch
 *    optimistic TOGGLE_DOWNVOTE_DETAIL_THREAD.
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
import {
  ActionType,
  asyncAddComment,
  asyncToggleUpvoteDetailThread,
  asyncToggleDownvoteDetailThread,
} from './action';
import { ActionType as ModalActionType } from '../modal/action';

const threadId = 'thread-1';
const userId = 'user-1';

const createDetailThread = (overrides = {}) => ({
  id: threadId,
  upVotesBy: [],
  downVotesBy: [],
  comments: [],
  ...overrides,
});

const getStateWith = (authUser, detailThread) => () => ({ authUser, detailThread });

const actionTypes = (dispatch) => dispatch.mock.calls.map(([action]) => action.type);

describe('asyncAddComment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('harus dispatch ADD_COMMENT dan modal sukses ketika berhasil', async () => {
    const comment = { id: 'comment-1', content: 'Tanggapan saya' };
    api.createComment.mockResolvedValue(comment);

    const dispatch = vi.fn();
    const getState = getStateWith(null, createDetailThread());

    const result = await asyncAddComment({ threadId, content: 'Tanggapan saya' })(
      dispatch,
      getState
    );

    expect(api.createComment).toHaveBeenCalledWith({ threadId, content: 'Tanggapan saya' });
    expect(result).toEqual({ error: false });
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: ActionType.ADD_COMMENT })
    );

    const modalAction = dispatch.mock.calls
      .map(([action]) => action)
      .find((action) => action.type === ModalActionType.SHOW_MODAL);
    expect(modalAction.payload.type).toBe('success');
  });

  it('harus menampilkan modal error dan mengembalikan { error: true } ketika gagal', async () => {
    api.createComment.mockRejectedValue(new Error('Gagal mengirim komentar.'));

    const dispatch = vi.fn();
    const getState = getStateWith(null, createDetailThread());

    const result = await asyncAddComment({ threadId, content: 'Tanggapan saya' })(
      dispatch,
      getState
    );

    expect(result).toEqual({ error: true, message: 'Gagal mengirim komentar.' });
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: ActionType.ADD_COMMENT })
    );

    const modalAction = dispatch.mock.calls
      .map(([action]) => action)
      .find((action) => action.type === ModalActionType.SHOW_MODAL);
    expect(modalAction.payload.type).toBe('error');
  });
});

describe('asyncToggleUpvoteDetailThread', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('harus menampilkan modal info dan tidak memanggil API ketika belum login', async () => {
    const dispatch = vi.fn();
    const getState = getStateWith(null, createDetailThread());

    await asyncToggleUpvoteDetailThread()(dispatch, getState);

    const modalAction = dispatch.mock.calls
      .map(([action]) => action)
      .find((action) => action.type === ModalActionType.SHOW_MODAL);
    expect(modalAction.payload.type).toBe('info');
    expect(api.upVoteThread).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: ActionType.TOGGLE_UPVOTE_DETAIL_THREAD })
    );
  });

  it('harus dispatch optimistic lalu memanggil api.upVoteThread ketika login dan belum upvote', async () => {
    api.upVoteThread.mockResolvedValue({});

    const dispatch = vi.fn();
    const getState = getStateWith({ id: userId }, createDetailThread({ upVotesBy: [] }));

    await asyncToggleUpvoteDetailThread()(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: ActionType.TOGGLE_UPVOTE_DETAIL_THREAD })
    );
    expect(api.upVoteThread).toHaveBeenCalledWith(threadId);
  });

  it('harus dispatch rollback NEUTRALIZE_VOTE_DETAIL_THREAD setelah optimistic ketika API menolak', async () => {
    api.upVoteThread.mockRejectedValue(new Error('Terjadi kesalahan pada server.'));

    const dispatch = vi.fn();
    const getState = getStateWith({ id: userId }, createDetailThread({ upVotesBy: [] }));

    await asyncToggleUpvoteDetailThread()(dispatch, getState);

    const types = actionTypes(dispatch);
    expect(types).toContain(ActionType.TOGGLE_UPVOTE_DETAIL_THREAD);
    expect(types).toContain(ActionType.NEUTRALIZE_VOTE_DETAIL_THREAD);
    expect(types.indexOf(ActionType.TOGGLE_UPVOTE_DETAIL_THREAD)).toBeLessThan(
      types.indexOf(ActionType.NEUTRALIZE_VOTE_DETAIL_THREAD)
    );
  });
});

describe('asyncToggleDownvoteDetailThread', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('harus dispatch optimistic lalu memanggil api.downVoteThread ketika login dan belum downvote', async () => {
    api.downVoteThread.mockResolvedValue({});

    const dispatch = vi.fn();
    const getState = getStateWith({ id: userId }, createDetailThread({ downVotesBy: [] }));

    await asyncToggleDownvoteDetailThread()(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: ActionType.TOGGLE_DOWNVOTE_DETAIL_THREAD })
    );
    expect(api.downVoteThread).toHaveBeenCalledWith(threadId);
  });

  it('harus dispatch rollback NEUTRALIZE_VOTE_DETAIL_THREAD setelah optimistic ketika API menolak', async () => {
    api.downVoteThread.mockRejectedValue(new Error('Terjadi kesalahan pada server.'));

    const dispatch = vi.fn();
    const getState = getStateWith({ id: userId }, createDetailThread({ downVotesBy: [] }));

    await asyncToggleDownvoteDetailThread()(dispatch, getState);

    const types = actionTypes(dispatch);
    expect(types).toContain(ActionType.TOGGLE_DOWNVOTE_DETAIL_THREAD);
    expect(types).toContain(ActionType.NEUTRALIZE_VOTE_DETAIL_THREAD);
    expect(types.indexOf(ActionType.TOGGLE_DOWNVOTE_DETAIL_THREAD)).toBeLessThan(
      types.indexOf(ActionType.NEUTRALIZE_VOTE_DETAIL_THREAD)
    );
  });
});
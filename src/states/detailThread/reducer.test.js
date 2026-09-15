import { describe, it, expect } from 'vitest';
import detailThreadReducer from './reducer';
import { ActionType } from './action';

/**
 * SKENARIO PENGUJIAN REDUCER DETAIL THREAD
 *
 * Menguji perilaku murni (pure function) dari detailThreadReducer dengan satu
 * detail thread berisi dua komentar sebagai data uji, sehingga dapat dipastikan
 * komentar lain tidak ikut berubah.
 *
 * Skenario yang diuji:
 * 1. RECEIVE_DETAIL_THREAD        : reducer mengembalikan detail thread dari
 *                                   payload dan tidak memutasi state lama.
 * 2. CLEAR_DETAIL_THREAD          : reducer mengembalikan null.
 * 3. ADD_COMMENT                  : komentar baru ditambahkan di urutan paling
 *                                   depan tanpa memutasi state lama.
 * 4. TOGGLE_UPVOTE_DETAIL_THREAD  : userId ditambahkan ke upVotesBy dan dihapus
 *                                   dari downVotesBy thread, komentar tidak
 *                                   tersentuh, state lama tidak dimutasi.
 * 5. TOGGLE_UPVOTE_DETAIL_THREAD (idempoten) : tidak menambah id duplikat bila
 *                                   userId sudah ada di upVotesBy.
 * 6. TOGGLE_DOWNVOTE_DETAIL_THREAD: userId ditambahkan ke downVotesBy dan
 *                                   dihapus dari upVotesBy thread.
 * 7. NEUTRALIZE_VOTE_DETAIL_THREAD: userId dihapus dari upVotesBy maupun
 *                                   downVotesBy thread.
 * 8. TOGGLE_UPVOTE_COMMENT        : userId ditambahkan ke upVotesBy komentar dan
 *                                   dihapus dari downVotesBy komentar tersebut,
 *                                   komentar lain serta thread tidak tersentuh.
 * 9. TOGGLE_DOWNVOTE_COMMENT      : userId ditambahkan ke downVotesBy komentar
 *                                   dan dihapus dari upVotesBy komentar tersebut.
 * 10. NEUTRALIZE_VOTE_COMMENT     : userId dihapus dari upVotesBy maupun
 *                                   downVotesBy komentar tersebut.
 * 11. State null (guard)          : setiap action mengembalikan null ketika
 *                                   state bernilai null.
 * 12. Action tidak dikenal        : reducer mengembalikan state apa adanya
 *                                   (hasil === state).
 */

const stateDetail = {
  id: 'thread-1',
  title: 'Thread Pertama',
  body: 'Isi thread pertama',
  category: 'umum',
  createdAt: '2024-01-01T00:00:00.000Z',
  owner: { id: 'user-1', name: 'User Satu', avatar: 'avatar-1.png' },
  upVotesBy: ['user-1'],
  downVotesBy: ['user-2'],
  comments: [
    {
      id: 'comment-1',
      content: 'Komentar pertama',
      createdAt: '2024-01-01T01:00:00.000Z',
      owner: { id: 'user-2', name: 'User Dua', avatar: 'avatar-2.png' },
      upVotesBy: ['user-1'],
      downVotesBy: ['user-2'],
    },
    {
      id: 'comment-2',
      content: 'Komentar kedua',
      createdAt: '2024-01-01T02:00:00.000Z',
      owner: { id: 'user-3', name: 'User Tiga', avatar: 'avatar-3.png' },
      upVotesBy: ['user-2'],
      downVotesBy: [],
    },
  ],
};

const komentarBaru = {
  id: 'comment-3',
  content: 'Komentar baru',
  createdAt: '2024-01-01T03:00:00.000Z',
  owner: { id: 'user-1', name: 'User Satu', avatar: 'avatar-1.png' },
  upVotesBy: [],
  downVotesBy: [],
};

describe('detailThreadReducer', () => {
  it('harus mengembalikan detail thread dan tidak memutasi state saat RECEIVE_DETAIL_THREAD', () => {
    const state = null;
    const action = {
      type: ActionType.RECEIVE_DETAIL_THREAD,
      payload: { detailThread: stateDetail },
    };

    const hasil = detailThreadReducer(state, action);

    expect(hasil).toEqual(stateDetail);
    expect(hasil).not.toBe(state);
  });

  it('harus mengembalikan null saat CLEAR_DETAIL_THREAD', () => {
    const state = stateDetail;
    const action = { type: ActionType.CLEAR_DETAIL_THREAD };

    const hasil = detailThreadReducer(state, action);

    expect(hasil).toBeNull();
    expect(state).toEqual(stateDetail);
  });

  it('harus menambahkan komentar baru di urutan paling depan saat ADD_COMMENT', () => {
    const state = stateDetail;
    const action = {
      type: ActionType.ADD_COMMENT,
      payload: { comment: komentarBaru },
    };

    const hasil = detailThreadReducer(state, action);

    expect(hasil.comments).toEqual([komentarBaru, ...stateDetail.comments]);
    expect(hasil).not.toBe(state);
    expect(state.comments).toEqual(stateDetail.comments);
    expect(hasil.comments[1]).toBe(stateDetail.comments[0]);
    expect(hasil.comments[2]).toBe(stateDetail.comments[1]);
  });

  it('harus menambahkan id ke upVotesBy dan menghapusnya dari downVotesBy saat TOGGLE_UPVOTE_DETAIL_THREAD', () => {
    const state = stateDetail;
    const action = {
      type: ActionType.TOGGLE_UPVOTE_DETAIL_THREAD,
      payload: { userId: 'user-2' },
    };

    const hasil = detailThreadReducer(state, action);

    expect(hasil.upVotesBy).toEqual(['user-1', 'user-2']);
    expect(hasil.downVotesBy).toEqual([]);
    expect(hasil.comments).toBe(stateDetail.comments);
    expect(hasil).not.toBe(state);
    expect(state).toEqual(stateDetail);
    expect(stateDetail.upVotesBy).toEqual(['user-1']);
    expect(stateDetail.downVotesBy).toEqual(['user-2']);
  });

  it('tidak boleh menambahkan id duplikat bila userId sudah ada di upVotesBy saat TOGGLE_UPVOTE_DETAIL_THREAD', () => {
    const state = stateDetail;
    const action = {
      type: ActionType.TOGGLE_UPVOTE_DETAIL_THREAD,
      payload: { userId: 'user-1' },
    };

    const hasil = detailThreadReducer(state, action);

    expect(hasil.upVotesBy).toEqual(['user-1']);
    expect(hasil.upVotesBy.filter((id) => id === 'user-1')).toHaveLength(1);
  });

  it('harus menambahkan id ke downVotesBy dan menghapusnya dari upVotesBy saat TOGGLE_DOWNVOTE_DETAIL_THREAD', () => {
    const state = stateDetail;
    const action = {
      type: ActionType.TOGGLE_DOWNVOTE_DETAIL_THREAD,
      payload: { userId: 'user-1' },
    };

    const hasil = detailThreadReducer(state, action);

    expect(hasil.downVotesBy).toEqual(['user-2', 'user-1']);
    expect(hasil.upVotesBy).toEqual([]);
    expect(hasil.comments).toBe(stateDetail.comments);
    expect(hasil).not.toBe(state);
    expect(state).toEqual(stateDetail);
  });

  it('harus menghapus userId dari upVotesBy dan downVotesBy saat NEUTRALIZE_VOTE_DETAIL_THREAD', () => {
    const state = stateDetail;
    const action = {
      type: ActionType.NEUTRALIZE_VOTE_DETAIL_THREAD,
      payload: { userId: 'user-2' },
    };

    const hasil = detailThreadReducer(state, action);

    expect(hasil.upVotesBy).toEqual(['user-1']);
    expect(hasil.downVotesBy).toEqual([]);
    expect(hasil.comments).toBe(stateDetail.comments);
    expect(hasil).not.toBe(state);
    expect(state).toEqual(stateDetail);
  });

  it('harus menambahkan id ke upVotesBy komentar dan menghapusnya dari downVotesBy komentar saat TOGGLE_UPVOTE_COMMENT', () => {
    const state = stateDetail;
    const action = {
      type: ActionType.TOGGLE_UPVOTE_COMMENT,
      payload: { commentId: 'comment-1', userId: 'user-2' },
    };

    const hasil = detailThreadReducer(state, action);

    expect(hasil.comments[0].upVotesBy).toEqual(['user-1', 'user-2']);
    expect(hasil.comments[0].downVotesBy).toEqual([]);
    expect(hasil.comments[1]).toBe(stateDetail.comments[1]);
    expect(hasil.upVotesBy).toBe(stateDetail.upVotesBy);
    expect(hasil).not.toBe(state);
    expect(state).toEqual(stateDetail);
    expect(stateDetail.comments[0].upVotesBy).toEqual(['user-1']);
    expect(stateDetail.comments[0].downVotesBy).toEqual(['user-2']);
  });

  it('harus menambahkan id ke downVotesBy komentar dan menghapusnya dari upVotesBy komentar saat TOGGLE_DOWNVOTE_COMMENT', () => {
    const state = stateDetail;
    const action = {
      type: ActionType.TOGGLE_DOWNVOTE_COMMENT,
      payload: { commentId: 'comment-1', userId: 'user-1' },
    };

    const hasil = detailThreadReducer(state, action);

    expect(hasil.comments[0].downVotesBy).toEqual(['user-2', 'user-1']);
    expect(hasil.comments[0].upVotesBy).toEqual([]);
    expect(hasil.comments[1]).toBe(stateDetail.comments[1]);
    expect(hasil).not.toBe(state);
    expect(state).toEqual(stateDetail);
  });

  it('harus menghapus userId dari upVotesBy dan downVotesBy komentar saat NEUTRALIZE_VOTE_COMMENT', () => {
    const state = stateDetail;
    const action = {
      type: ActionType.NEUTRALIZE_VOTE_COMMENT,
      payload: { commentId: 'comment-1', userId: 'user-2' },
    };

    const hasil = detailThreadReducer(state, action);

    expect(hasil.comments[0].upVotesBy).toEqual(['user-1']);
    expect(hasil.comments[0].downVotesBy).toEqual([]);
    expect(hasil.comments[1]).toBe(stateDetail.comments[1]);
    expect(hasil).not.toBe(state);
    expect(state).toEqual(stateDetail);
  });

  it('harus mengembalikan null pada setiap action ketika state bernilai null', () => {
    // RECEIVE_DETAIL_THREAD memang mengembalikan payload (bukan null), sehingga
    // untuk action tersebut state null justru digantikan payload baru. Semua
    // action lain yang memiliki guard null harus mengembalikan null apa adanya.
    const hasilReceive = detailThreadReducer(null, {
      type: ActionType.RECEIVE_DETAIL_THREAD,
      payload: { detailThread: stateDetail },
    });
    expect(hasilReceive).toBe(stateDetail);

    const actions = [
      { type: ActionType.CLEAR_DETAIL_THREAD },
      { type: ActionType.ADD_COMMENT, payload: { comment: komentarBaru } },
      { type: ActionType.TOGGLE_UPVOTE_DETAIL_THREAD, payload: { userId: 'user-1' } },
      { type: ActionType.TOGGLE_DOWNVOTE_DETAIL_THREAD, payload: { userId: 'user-1' } },
      { type: ActionType.NEUTRALIZE_VOTE_DETAIL_THREAD, payload: { userId: 'user-1' } },
      { type: ActionType.TOGGLE_UPVOTE_COMMENT, payload: { commentId: 'comment-1', userId: 'user-1' } },
      { type: ActionType.TOGGLE_DOWNVOTE_COMMENT, payload: { commentId: 'comment-1', userId: 'user-1' } },
      { type: ActionType.NEUTRALIZE_VOTE_COMMENT, payload: { commentId: 'comment-1', userId: 'user-1' } },
    ];

    actions.forEach((action) => {
      const hasil = detailThreadReducer(null, action);
      expect(hasil).toBeNull();
    });
  });

  it('harus mengembalikan state apa adanya saat action tidak dikenal', () => {
    const state = stateDetail;
    const action = { type: 'UNKNOWN_ACTION' };

    const hasil = detailThreadReducer(state, action);

    expect(hasil).toBe(state);
  });
});
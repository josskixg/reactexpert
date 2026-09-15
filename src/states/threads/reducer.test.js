import { describe, it, expect } from 'vitest';
import threadsReducer from './reducer';
import { ActionType } from './action';

/**
 * SKENARIO PENGUJIAN REDUCER THREADS
 *
 * Menguji perilaku murni (pure function) dari threadsReducer dengan dua thread
 * sebagai data uji, sehingga dapat dipastikan thread lain tidak ikut berubah.
 *
 * Skenario yang diuji:
 * 1. RECEIVE_THREADS    : reducer mengembalikan daftar thread dari payload dan
 *                         tidak memutasi state lama (hasil !== state).
 * 2. ADD_THREAD         : thread baru ditambahkan di urutan paling depan tanpa
 *                         memutasi state lama.
 * 3. TOGGLE_UPVOTE_THREAD   : userId ditambahkan ke upVotesBy, dihapus dari
 *                             downVotesBy, thread lain tidak tersentuh, dan
 *                             state lama tidak dimutasi.
 * 4. TOGGLE_UPVOTE_THREAD (idempoten) : jika userId sudah ada di upVotesBy,
 *                             tidak boleh menambah id duplikat.
 * 5. TOGGLE_UPVOTE_THREAD (threadId tak cocok) : tidak ada thread yang berubah,
 *                             referensi tiap thread tetap sama.
 * 6. TOGGLE_DOWNVOTE_THREAD : userId ditambahkan ke downVotesBy, dihapus dari
 *                             upVotesBy, dan thread lain tidak tersentuh.
 * 7. NEUTRALIZE_VOTE_THREAD : userId dihapus dari upVotesBy maupun downVotesBy.
 * 8. Action tidak dikenal  : reducer mengembalikan state apa adanya
 *                             (hasil === state).
 */

const stateDuaThread = [
  {
    id: 'thread-1',
    title: 'Thread Pertama',
    body: 'Isi thread pertama',
    category: 'umum',
    createdAt: '2024-01-01T00:00:00.000Z',
    ownerId: 'user-1',
    upVotesBy: ['user-1'],
    downVotesBy: ['user-2'],
    totalComments: 2,
  },
  {
    id: 'thread-2',
    title: 'Thread Kedua',
    body: 'Isi thread kedua',
    category: 'teknologi',
    createdAt: '2024-01-02T00:00:00.000Z',
    ownerId: 'user-2',
    upVotesBy: ['user-2'],
    downVotesBy: [],
    totalComments: 0,
  },
];

const threadBaru = {
  id: 'thread-3',
  title: 'Thread Baru',
  body: 'Isi thread baru',
  category: 'umum',
  createdAt: '2024-01-03T00:00:00.000Z',
  ownerId: 'user-3',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 0,
};

describe('threadsReducer', () => {
  it('harus mengembalikan daftar thread dan tidak memutasi state saat RECEIVE_THREADS', () => {
    const state = [];
    const threads = stateDuaThread;
    const action = {
      type: ActionType.RECEIVE_THREADS,
      payload: { threads },
    };

    const hasil = threadsReducer(state, action);

    expect(hasil).toEqual(threads);
    expect(hasil).not.toBe(state);
    expect(state).toEqual([]);
  });

  it('harus menambahkan thread baru di urutan paling depan saat ADD_THREAD', () => {
    const state = stateDuaThread;
    const action = {
      type: ActionType.ADD_THREAD,
      payload: { thread: threadBaru },
    };

    const hasil = threadsReducer(state, action);

    expect(hasil).toEqual([threadBaru, ...stateDuaThread]);
    expect(hasil).not.toBe(state);
    expect(state).toEqual(stateDuaThread);
    expect(hasil[1]).toBe(stateDuaThread[0]);
  });

  it('harus menambahkan id ke upVotesBy dan menghapusnya dari downVotesBy saat TOGGLE_UPVOTE_THREAD', () => {
    const state = stateDuaThread;
    const action = {
      type: ActionType.TOGGLE_UPVOTE_THREAD,
      payload: { threadId: 'thread-1', userId: 'user-2' },
    };

    const hasil = threadsReducer(state, action);

    expect(hasil[0].upVotesBy).toEqual(['user-1', 'user-2']);
    expect(hasil[0].downVotesBy).toEqual([]);
    expect(hasil[1]).toBe(stateDuaThread[1]);
    expect(hasil).not.toBe(state);
    expect(state).toEqual(stateDuaThread);
    expect(stateDuaThread[0].upVotesBy).toEqual(['user-1']);
    expect(stateDuaThread[0].downVotesBy).toEqual(['user-2']);
  });

  it('tidak boleh menambahkan id duplikat bila userId sudah ada di upVotesBy saat TOGGLE_UPVOTE_THREAD', () => {
    const state = stateDuaThread;
    const action = {
      type: ActionType.TOGGLE_UPVOTE_THREAD,
      payload: { threadId: 'thread-1', userId: 'user-1' },
    };

    const hasil = threadsReducer(state, action);

    expect(hasil[0].upVotesBy).toEqual(['user-1']);
    expect(hasil[0].upVotesBy.filter((id) => id === 'user-1')).toHaveLength(1);
    expect(hasil[1]).toBe(stateDuaThread[1]);
  });

  it('tidak mengubah thread apa pun bila threadId tidak cocok saat TOGGLE_UPVOTE_THREAD', () => {
    const state = stateDuaThread;
    const action = {
      type: ActionType.TOGGLE_UPVOTE_THREAD,
      payload: { threadId: 'thread-tidak-ada', userId: 'user-9' },
    };

    const hasil = threadsReducer(state, action);

    expect(hasil).toEqual(state);
    expect(hasil[0]).toBe(stateDuaThread[0]);
    expect(hasil[1]).toBe(stateDuaThread[1]);
    expect(state).toEqual(stateDuaThread);
  });

  it('harus menambahkan id ke downVotesBy dan menghapusnya dari upVotesBy saat TOGGLE_DOWNVOTE_THREAD', () => {
    const state = stateDuaThread;
    const action = {
      type: ActionType.TOGGLE_DOWNVOTE_THREAD,
      payload: { threadId: 'thread-1', userId: 'user-1' },
    };

    const hasil = threadsReducer(state, action);

    expect(hasil[0].downVotesBy).toEqual(['user-2', 'user-1']);
    expect(hasil[0].upVotesBy).toEqual([]);
    expect(hasil[1]).toBe(stateDuaThread[1]);
    expect(hasil).not.toBe(state);
    expect(state).toEqual(stateDuaThread);
  });

  it('harus menghapus userId dari upVotesBy dan downVotesBy saat NEUTRALIZE_VOTE_THREAD', () => {
    const state = stateDuaThread;
    const action = {
      type: ActionType.NEUTRALIZE_VOTE_THREAD,
      payload: { threadId: 'thread-1', userId: 'user-2' },
    };

    const hasil = threadsReducer(state, action);

    expect(hasil[0].upVotesBy).toEqual(['user-1']);
    expect(hasil[0].downVotesBy).toEqual([]);
    expect(hasil[1]).toBe(stateDuaThread[1]);
    expect(hasil).not.toBe(state);
    expect(state).toEqual(stateDuaThread);
  });

  it('harus mengembalikan state apa adanya saat action tidak dikenal', () => {
    const state = stateDuaThread;
    const action = { type: 'UNKNOWN_ACTION' };

    const hasil = threadsReducer(state, action);

    expect(hasil).toBe(state);
  });
});
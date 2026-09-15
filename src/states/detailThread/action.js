import api from '../../api/api';
import { showLoadingActionCreator, hideLoadingActionCreator } from '../loading/action';
import { showModalActionCreator } from '../modal/action';

const ActionType = {
  RECEIVE_DETAIL_THREAD: 'detailThread/receive',
  CLEAR_DETAIL_THREAD: 'detailThread/clear',
  ADD_COMMENT: 'detailThread/addComment',
  TOGGLE_UPVOTE_DETAIL_THREAD: 'detailThread/toggleUpvote',
  TOGGLE_DOWNVOTE_DETAIL_THREAD: 'detailThread/toggleDownvote',
  NEUTRALIZE_VOTE_DETAIL_THREAD: 'detailThread/neutralizeVote',
  TOGGLE_UPVOTE_COMMENT: 'detailThread/toggleUpvoteComment',
  TOGGLE_DOWNVOTE_COMMENT: 'detailThread/toggleDownvoteComment',
  NEUTRALIZE_VOTE_COMMENT: 'detailThread/neutralizeVoteComment',
};

function receiveDetailThreadActionCreator(detailThread) {
  return {
    type: ActionType.RECEIVE_DETAIL_THREAD,
    payload: {
      detailThread,
    },
  };
}

function clearDetailThreadActionCreator() {
  return {
    type: ActionType.CLEAR_DETAIL_THREAD,
  };
}

function addCommentActionCreator(comment) {
  return {
    type: ActionType.ADD_COMMENT,
    payload: {
      comment,
    },
  };
}

function toggleUpvoteDetailThreadActionCreator(userId) {
  return {
    type: ActionType.TOGGLE_UPVOTE_DETAIL_THREAD,
    payload: {
      userId,
    },
  };
}

function toggleDownvoteDetailThreadActionCreator(userId) {
  return {
    type: ActionType.TOGGLE_DOWNVOTE_DETAIL_THREAD,
    payload: {
      userId,
    },
  };
}

function neutralizeVoteDetailThreadActionCreator(userId) {
  return {
    type: ActionType.NEUTRALIZE_VOTE_DETAIL_THREAD,
    payload: {
      userId,
    },
  };
}

function toggleUpvoteCommentActionCreator({ commentId, userId }) {
  return {
    type: ActionType.TOGGLE_UPVOTE_COMMENT,
    payload: {
      commentId,
      userId,
    },
  };
}

function toggleDownvoteCommentActionCreator({ commentId, userId }) {
  return {
    type: ActionType.TOGGLE_DOWNVOTE_COMMENT,
    payload: {
      commentId,
      userId,
    },
  };
}

function neutralizeVoteCommentActionCreator({ commentId, userId }) {
  return {
    type: ActionType.NEUTRALIZE_VOTE_COMMENT,
    payload: {
      commentId,
      userId,
    },
  };
}

function asyncReceiveDetailThread(id) {
  return async (dispatch) => {
    dispatch(showLoadingActionCreator());
    dispatch(clearDetailThreadActionCreator());
    try {
      const detailThread = await api.getDetailThread(id);
      dispatch(receiveDetailThreadActionCreator(detailThread));
    } catch (error) {
      dispatch(
        showModalActionCreator({
          title: 'Gagal Memuat Diskusi',
          message: error.message || 'Diskusi tidak ditemukan atau terjadi kendala.',
          type: 'error',
        })
      );
    } finally {
      dispatch(hideLoadingActionCreator());
    }
  };
}

function asyncAddComment({ threadId, content }) {
  return async (dispatch) => {
    dispatch(showLoadingActionCreator());
    try {
      const comment = await api.createComment({ threadId, content });
      dispatch(addCommentActionCreator(comment));
      dispatch(
        showModalActionCreator({
          title: 'Tanggapan Terkirim',
          message: 'Tanggapan Anda telah berhasil ditambahkan pada diskusi ini.',
          type: 'success',
        })
      );
      return { error: false };
    } catch (error) {
      dispatch(
        showModalActionCreator({
          title: 'Gagal Mengirim Tanggapan',
          message: error.message || 'Terjadi kesalahan saat mengirim komentar.',
          type: 'error',
        })
      );
      return { error: true, message: error.message };
    } finally {
      dispatch(hideLoadingActionCreator());
    }
  };
}

function asyncToggleUpvoteDetailThread() {
  return async (dispatch, getState) => {
    const { authUser, detailThread } = getState();
    if (!authUser) {
      dispatch(
        showModalActionCreator({
          title: 'Perlu Masuk',
          message: 'Silakan masuk ke akun Anda terlebih dahulu untuk memberikan penilaian.',
          type: 'info',
        })
      );
      return;
    }
    if (!detailThread) return;

    const isUpvoted = detailThread.upVotesBy.includes(authUser.id);

    // Optimistic update
    if (isUpvoted) {
      dispatch(neutralizeVoteDetailThreadActionCreator(authUser.id));
    } else {
      dispatch(toggleUpvoteDetailThreadActionCreator(authUser.id));
    }

    try {
      if (isUpvoted) {
        await api.neutralizeVoteThread(detailThread.id);
      } else {
        await api.upVoteThread(detailThread.id);
      }
    } catch (error) {
      dispatch(
        showModalActionCreator({
          title: 'Gagal Memperbarui Vote',
          message: error.message || 'Terjadi kesalahan pada server.',
          type: 'error',
        })
      );
      if (isUpvoted) {
        dispatch(toggleUpvoteDetailThreadActionCreator(authUser.id));
      } else {
        dispatch(neutralizeVoteDetailThreadActionCreator(authUser.id));
      }
    }
  };
}

function asyncToggleDownvoteDetailThread() {
  return async (dispatch, getState) => {
    const { authUser, detailThread } = getState();
    if (!authUser) {
      dispatch(
        showModalActionCreator({
          title: 'Perlu Masuk',
          message: 'Silakan masuk ke akun Anda terlebih dahulu untuk memberikan penilaian.',
          type: 'info',
        })
      );
      return;
    }
    if (!detailThread) return;

    const isDownvoted = detailThread.downVotesBy.includes(authUser.id);

    // Optimistic update
    if (isDownvoted) {
      dispatch(neutralizeVoteDetailThreadActionCreator(authUser.id));
    } else {
      dispatch(toggleDownvoteDetailThreadActionCreator(authUser.id));
    }

    try {
      if (isDownvoted) {
        await api.neutralizeVoteThread(detailThread.id);
      } else {
        await api.downVoteThread(detailThread.id);
      }
    } catch (error) {
      dispatch(
        showModalActionCreator({
          title: 'Gagal Memperbarui Vote',
          message: error.message || 'Terjadi kesalahan pada server.',
          type: 'error',
        })
      );
      if (isDownvoted) {
        dispatch(toggleDownvoteDetailThreadActionCreator(authUser.id));
      } else {
        dispatch(neutralizeVoteDetailThreadActionCreator(authUser.id));
      }
    }
  };
}

function asyncToggleUpvoteComment(commentId) {
  return async (dispatch, getState) => {
    const { authUser, detailThread } = getState();
    if (!authUser) {
      dispatch(
        showModalActionCreator({
          title: 'Perlu Masuk',
          message: 'Silakan masuk ke akun Anda terlebih dahulu untuk memberikan penilaian.',
          type: 'info',
        })
      );
      return;
    }
    if (!detailThread) return;

    const comment = detailThread.comments.find((c) => c.id === commentId);
    if (!comment) return;

    const isUpvoted = comment.upVotesBy.includes(authUser.id);

    // Optimistic update
    if (isUpvoted) {
      dispatch(neutralizeVoteCommentActionCreator({ commentId, userId: authUser.id }));
    } else {
      dispatch(toggleUpvoteCommentActionCreator({ commentId, userId: authUser.id }));
    }

    try {
      if (isUpvoted) {
        await api.neutralizeVoteComment({ threadId: detailThread.id, commentId });
      } else {
        await api.upVoteComment({ threadId: detailThread.id, commentId });
      }
    } catch (error) {
      dispatch(
        showModalActionCreator({
          title: 'Gagal Memperbarui Vote',
          message: error.message || 'Terjadi kesalahan pada server.',
          type: 'error',
        })
      );
      if (isUpvoted) {
        dispatch(toggleUpvoteCommentActionCreator({ commentId, userId: authUser.id }));
      } else {
        dispatch(neutralizeVoteCommentActionCreator({ commentId, userId: authUser.id }));
      }
    }
  };
}

function asyncToggleDownvoteComment(commentId) {
  return async (dispatch, getState) => {
    const { authUser, detailThread } = getState();
    if (!authUser) {
      dispatch(
        showModalActionCreator({
          title: 'Perlu Masuk',
          message: 'Silakan masuk ke akun Anda terlebih dahulu untuk memberikan penilaian.',
          type: 'info',
        })
      );
      return;
    }
    if (!detailThread) return;

    const comment = detailThread.comments.find((c) => c.id === commentId);
    if (!comment) return;

    const isDownvoted = comment.downVotesBy.includes(authUser.id);

    // Optimistic update
    if (isDownvoted) {
      dispatch(neutralizeVoteCommentActionCreator({ commentId, userId: authUser.id }));
    } else {
      dispatch(toggleDownvoteCommentActionCreator({ commentId, userId: authUser.id }));
    }

    try {
      if (isDownvoted) {
        await api.neutralizeVoteComment({ threadId: detailThread.id, commentId });
      } else {
        await api.downVoteComment({ threadId: detailThread.id, commentId });
      }
    } catch (error) {
      dispatch(
        showModalActionCreator({
          title: 'Gagal Memperbarui Vote',
          message: error.message || 'Terjadi kesalahan pada server.',
          type: 'error',
        })
      );
      if (isDownvoted) {
        dispatch(toggleDownvoteCommentActionCreator({ commentId, userId: authUser.id }));
      } else {
        dispatch(neutralizeVoteCommentActionCreator({ commentId, userId: authUser.id }));
      }
    }
  };
}

export {
  ActionType,
  receiveDetailThreadActionCreator,
  clearDetailThreadActionCreator,
  addCommentActionCreator,
  toggleUpvoteDetailThreadActionCreator,
  toggleDownvoteDetailThreadActionCreator,
  neutralizeVoteDetailThreadActionCreator,
  toggleUpvoteCommentActionCreator,
  toggleDownvoteCommentActionCreator,
  neutralizeVoteCommentActionCreator,
  asyncReceiveDetailThread,
  asyncAddComment,
  asyncToggleUpvoteDetailThread,
  asyncToggleDownvoteDetailThread,
  asyncToggleUpvoteComment,
  asyncToggleDownvoteComment,
};

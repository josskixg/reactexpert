import { ActionType } from './action';

function threadsReducer(threads = [], action = {}) {
  switch (action.type) {
  case ActionType.RECEIVE_THREADS:
    return action.payload.threads;
  case ActionType.ADD_THREAD:
    return [action.payload.thread, ...threads];
  case ActionType.TOGGLE_UPVOTE_THREAD:
    return threads.map((thread) => {
      if (thread.id === action.payload.threadId) {
        return {
          ...thread,
          upVotesBy: thread.upVotesBy.includes(action.payload.userId)
            ? thread.upVotesBy
            : [...thread.upVotesBy, action.payload.userId],
          downVotesBy: thread.downVotesBy.filter((id) => id !== action.payload.userId),
        };
      }
      return thread;
    });
  case ActionType.TOGGLE_DOWNVOTE_THREAD:
    return threads.map((thread) => {
      if (thread.id === action.payload.threadId) {
        return {
          ...thread,
          downVotesBy: thread.downVotesBy.includes(action.payload.userId)
            ? thread.downVotesBy
            : [...thread.downVotesBy, action.payload.userId],
          upVotesBy: thread.upVotesBy.filter((id) => id !== action.payload.userId),
        };
      }
      return thread;
    });
  case ActionType.NEUTRALIZE_VOTE_THREAD:
    return threads.map((thread) => {
      if (thread.id === action.payload.threadId) {
        return {
          ...thread,
          upVotesBy: thread.upVotesBy.filter((id) => id !== action.payload.userId),
          downVotesBy: thread.downVotesBy.filter((id) => id !== action.payload.userId),
        };
      }
      return thread;
    });
  default:
    return threads;
  }
}

export default threadsReducer;

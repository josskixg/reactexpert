import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import {
  asyncReceiveDetailThread,
  asyncAddComment,
  asyncToggleUpvoteDetailThread,
  asyncToggleDownvoteDetailThread,
  asyncToggleUpvoteComment,
  asyncToggleDownvoteComment,
} from '../states/detailThread/action';
import ThreadDetail from '../components/organisms/ThreadDetail';
import CommentInput from '../components/molecules/CommentInput';
import CommentList from '../components/organisms/CommentList';

function DetailPage() {
  const { id } = useParams();
  const detailThread = useSelector((state) => state.detailThread);
  const authUser = useSelector((state) => state.authUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncReceiveDetailThread(id));
  }, [id, dispatch]);

  const onUpvoteDetailThread = () => {
    dispatch(asyncToggleUpvoteDetailThread());
  };

  const onDownvoteDetailThread = () => {
    dispatch(asyncToggleDownvoteDetailThread());
  };

  const onSubmitComment = (content) => {
    return dispatch(asyncAddComment({ threadId: id, content }));
  };

  const onUpvoteComment = (commentId) => {
    dispatch(asyncToggleUpvoteComment(commentId));
  };

  const onDownvoteComment = (commentId) => {
    dispatch(asyncToggleDownvoteComment(commentId));
  };

  if (!detailThread) {
    return (
      <div className="clay-card p-10 text-center text-[#78716C] my-6">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-[#D6CEC2] rounded-full w-2/3 mx-auto" />
          <div className="h-3.5 bg-[#D6CEC2] rounded-full w-1/3 mx-auto" />
          <div className="h-28 bg-[#D6CEC2] rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          to="/"
          className="clay-btn px-3.5 py-1.5 text-xs font-bold inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali</span>
        </Link>
      </div>

      <ThreadDetail
        {...detailThread}
        authUserId={authUser ? authUser.id : null}
        onUpvote={onUpvoteDetailThread}
        onDownvote={onDownvoteDetailThread}
      />

      <CommentInput
        authUser={authUser}
        onSubmitComment={onSubmitComment}
      />

      <CommentList
        comments={detailThread.comments}
        authUserId={authUser ? authUser.id : null}
        onUpvote={onUpvoteComment}
        onDownvote={onDownvoteComment}
      />
    </div>
  );
}

export default DetailPage;

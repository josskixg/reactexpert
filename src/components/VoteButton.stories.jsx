import VoteButton from './VoteButton';

export default {
  title: 'Components/VoteButton',
  component: VoteButton,
  args: {
    upVotesBy: [],
    downVotesBy: [],
    authUserId: null,
    compact: false,
    onUpvote: () => {},
    onDownvote: () => {},
  },
  argTypes: {
    upVotesBy: {
      control: 'object',
      description: 'Daftar id pengguna yang melakukan upvote.',
    },
    downVotesBy: {
      control: 'object',
      description: 'Daftar id pengguna yang melakukan downvote.',
    },
    authUserId: {
      control: 'text',
      description: 'Id pengguna yang sedang login, dipakai untuk menandai vote aktif.',
    },
    compact: {
      control: 'boolean',
      description: 'Tampilkan versi ringkas dengan ikon dan teks lebih kecil.',
    },
  },
};

export const Default = {
  args: {
    upVotesBy: ['user-1', 'user-2'],
    downVotesBy: ['user-3'],
    authUserId: null,
  },
};

export const Upvoted = {
  args: {
    upVotesBy: ['user-1', 'user-2', 'user-3'],
    downVotesBy: ['user-4'],
    authUserId: 'user-1',
  },
};

export const Downvoted = {
  args: {
    upVotesBy: ['user-1'],
    downVotesBy: ['user-2', 'user-3'],
    authUserId: 'user-2',
  },
};

export const StackedScore = {
  args: {
    upVotesBy: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'],
    downVotesBy: ['user-6', 'user-7'],
    authUserId: 'user-3',
    compact: true,
  },
};

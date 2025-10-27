export interface Activity {
  id: string;
  type: 'tip' | 'like' | 'comment' | 'follow';
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  targetUser?: {
    name: string;
  };
  post?: {
    id: string;
    preview: string;
  };
  amount?: number;
  timestamp: Date;
}

export const dummyActivities: Activity[] = [
  {
    id: '1',
    type: 'tip',
    user: {
      id: '1',
      name: 'Max Furrstappen',
      avatar: 'https://i.pravatar.cc/150?img=33',
    },
    targetUser: {
      name: 'Adriana',
    },
    amount: 0.2,
    post: {
      id: '1',
      preview: 'sol',
    },
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9h ago
  },
  {
    id: '2',
    type: 'like',
    user: {
      id: '1',
      name: 'Max Furrstappen',
      avatar: 'https://i.pravatar.cc/150?img=33',
    },
    targetUser: {
      name: 'Adriana',
    },
    post: {
      id: '2',
      preview: '',
    },
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9h ago
  },
  {
    id: '3',
    type: 'like',
    user: {
      id: '1',
      name: 'Max Furrstappen',
      avatar: 'https://i.pravatar.cc/150?img=33',
    },
    targetUser: {
      name: 'Adriana',
    },
    post: {
      id: '3',
      preview: '',
    },
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9h ago
  },
  {
    id: '4',
    type: 'like',
    user: {
      id: '1',
      name: 'Max Furrstappen',
      avatar: 'https://i.pravatar.cc/150?img=33',
    },
    targetUser: {
      name: 'Adriana',
    },
    post: {
      id: '4',
      preview: '',
    },
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9h ago
  },
  {
    id: '5',
    type: 'like',
    user: {
      id: '1',
      name: 'Max Furrstappen',
      avatar: 'https://i.pravatar.cc/150?img=33',
    },
    targetUser: {
      name: 'Adriana',
    },
    post: {
      id: '5',
      preview: '',
    },
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9h ago
  },
  {
    id: '6',
    type: 'like',
    user: {
      id: '1',
      name: 'Max Furrstappen',
      avatar: 'https://i.pravatar.cc/150?img=33',
    },
    targetUser: {
      name: 'Adriana',
    },
    post: {
      id: '6',
      preview: '',
    },
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9h ago
  },
  {
    id: '7',
    type: 'like',
    user: {
      id: '1',
      name: 'Max Furrstappen',
      avatar: 'https://i.pravatar.cc/150?img=33',
    },
    targetUser: {
      name: 'Adriana',
    },
    post: {
      id: '7',
      preview: '',
    },
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9h ago
  },
];


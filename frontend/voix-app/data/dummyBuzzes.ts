export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface Buzz {
  id: string;
  parentBuzzId: string | null;
  content: string | null;
  image: string | null;
  video: string | null;
  userid: string;
  user: User;
  votes: {
    upvotes: number;
    downvotes: number;
  };
  tips: number;
  repliesCount: number;
  createdAt: Date;
}

export const dummyUsers: User[] = [
  {
    id: '1',
    name: 'Tom Jabes',
    username: '@tomjabes',
    avatar: 'https://i.pravatar.cc/150?img=33',
  },
  {
    id: '2',
    name: 'Alexa R',
    username: '@alexar',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: '3',
    name: 'Sarah Chen',
    username: '@sarahc',
    avatar: 'https://i.pravatar.cc/150?img=20',
  },
  {
    id: '4',
    name: 'Mike Ross',
    username: '@mikeross',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
];

export const dummyBuzzes: Buzz[] = [
  {
    id: '1',
    parentBuzzId: null,
    content: 'meow meow meoww',
    image: null,
    video: null,
    userid: '1',
    user: dummyUsers[0],
    votes: {
      upvotes: 156,
      downvotes: 12,
    },
    tips: 5,
    repliesCount: 23,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    parentBuzzId: null,
    content: null,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600',
    video: null,
    userid: '2',
    user: dummyUsers[1],
    votes: {
      upvotes: 892,
      downvotes: 34,
    },
    tips: 12,
    repliesCount: 67,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: '3',
    parentBuzzId: null,
    content: 'Just finished my morning workout! Feeling energized 💪',
    image: null,
    video: null,
    userid: '3',
    user: dummyUsers[2],
    votes: {
      upvotes: 234,
      downvotes: 8,
    },
    tips: 3,
    repliesCount: 15,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
  {
    id: '4',
    parentBuzzId: null,
    content: 'The sunset today was absolutely breathtaking 🌅',
    image: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=600',
    video: null,
    userid: '4',
    user: dummyUsers[3],
    votes: {
      upvotes: 445,
      downvotes: 15,
    },
    tips: 8,
    repliesCount: 32,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
  },
];


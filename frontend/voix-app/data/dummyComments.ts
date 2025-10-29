import { User } from './dummyBuzzes';

export interface Comment {
  id: string;
  buzzId: string;
  content: string;
  user: User;
  createdAt: Date;
  likes: number;
}

export const dummyComments: Comment[] = [
  {
    id: '1',
    buzzId: '1',
    content: 'This is adorable! 😻',
    user: {
      id: '2',
      name: 'Alexa R',
      username: '@alexar',
      avatar: 'https://i.pravatar.cc/150?img=47',
    },
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    likes: 12,
  },
  {
    id: '2',
    buzzId: '1',
    content: 'Love it! Where can I get one?',
    user: {
      id: '3',
      name: 'Sarah Chen',
      username: '@sarahc',
      avatar: 'https://i.pravatar.cc/150?img=20',
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    likes: 5,
  },
  {
    id: '3',
    buzzId: '1',
    content: 'So cute! 🐱',
    user: {
      id: '4',
      name: 'Mike Ross',
      username: '@mikeross',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    likes: 8,
  },
];


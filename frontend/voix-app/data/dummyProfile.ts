export interface ProfileUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  coins: number;
}

export const currentUser: ProfileUser = {
  id: '1',
  name: 'Max Furrstappen',
  username: '10',
  avatar: 'https://i.pravatar.cc/150?img=33',
  bio: 'Simply meow',
  stats: {
    posts: 10,
    followers: 10,
    following: 10,
  },
  coins: 250,
};

// Sample images for grid view
export const profileImages = [
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
  'https://images.unsplash.com/photo-1573865526739-10c1dd7e2951?w=400',
  'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400',
  'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400',
  'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=400',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
  'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400',
  'https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=400',
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400',
];


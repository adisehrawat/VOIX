import { FlatList } from 'react-native';
import { Buzz } from '../../../data/dummyBuzzes';
import BuzzCard from '../../BuzzCard';

interface ProfileFeedViewProps {
  posts: Buzz[];
}

export default function ProfileFeedView({ posts }: ProfileFeedViewProps) {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <BuzzCard buzz={item} />}
      contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    />
  );
}


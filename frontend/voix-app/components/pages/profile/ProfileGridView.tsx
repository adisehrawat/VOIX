import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { Buzz } from '../../../data/dummyBuzzes';

interface ProfileGridViewProps {
  posts: Buzz[];
}

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 8) / 3; // 3 columns with 2px gap each

export default function ProfileGridView({ posts }: ProfileGridViewProps) {
  const renderItem = ({ item, index }: { item: Buzz; index: number }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        className="bg-zinc-900 items-center justify-center"
        style={{
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          marginRight: index % 3 !== 2 ? 2 : 0,
          marginBottom: 2,
        }}
      >
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-zinc-800 items-center justify-center p-2">
            <Text className="text-white text-xs text-center" numberOfLines={4}>
              {item.content}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      scrollEnabled={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
}


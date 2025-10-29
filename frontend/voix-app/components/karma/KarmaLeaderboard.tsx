import { Award, Crown, Medal, Trophy } from 'lucide-react-native';
import { FlatList, Image, Text, View } from 'react-native';
import { Karma } from '../../types';

interface KarmaLeaderboardProps {
  leaderboard: Karma[];
  currentUserId?: string;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown size={20} color="#FFD700" strokeWidth={2.5} fill="#FFD700" />;
    case 2:
      return <Medal size={20} color="#C0C0C0" strokeWidth={2.5} />;
    case 3:
      return <Medal size={20} color="#CD7F32" strokeWidth={2.5} />;
    default:
      return null;
  }
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'border-yellow-500 bg-yellow-500/10';
    case 2:
      return 'border-gray-400 bg-gray-400/10';
    case 3:
      return 'border-orange-700 bg-orange-700/10';
    default:
      return 'border-zinc-800 bg-zinc-900';
  }
};

const LeaderboardCard = ({
  karma,
  rank,
  isCurrentUser,
}: {
  karma: Karma;
  rank: number;
  isCurrentUser: boolean;
}) => {
  return (
    <View
      className={`rounded-2xl p-4 mb-3 border ${getRankColor(rank)} ${
        isCurrentUser ? 'border-purple-500' : ''
      }`}
    >
      <View className="flex-row items-center">
        {/* Rank */}
        <View className="w-12 items-center mr-3">
          {rank <= 3 ? (
            getRankIcon(rank)
          ) : (
            <Text className="text-gray-400 text-lg font-bold">#{rank}</Text>
          )}
        </View>

        {/* User Info */}
        <Image
          source={{ uri: karma.user.imageUrl }}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="text-white font-semibold text-base">
            {karma.user.name}
            {isCurrentUser && (
              <Text className="text-purple-500 text-sm"> (You)</Text>
            )}
          </Text>
          <View className="flex-row items-center mt-1">
            <Award size={14} color="#71717a" strokeWidth={2} />
            <Text className="text-gray-400 text-sm ml-1">
              {karma.nfts} NFTs
            </Text>
          </View>
        </View>

        {/* Points */}
        <View className="items-end">
          <Text className="text-white text-xl font-bold">{karma.points}</Text>
          <Text className="text-gray-400 text-xs">points</Text>
        </View>
      </View>
    </View>
  );
};

export default function KarmaLeaderboard({ leaderboard, currentUserId }: KarmaLeaderboardProps) {
  const renderHeader = () => (
    <View className="bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800">
      <View className="flex-row items-center">
        <Trophy size={24} color="#f97316" strokeWidth={2} />
        <Text className="text-white text-lg font-bold ml-2">
          Top Contributors
        </Text>
      </View>
      <Text className="text-gray-400 text-sm mt-2">
        Ranked by karma points earned
      </Text>
    </View>
  );

  return (
    <FlatList
      data={leaderboard}
      keyExtractor={(item) => item.userId}
      ListHeaderComponent={renderHeader}
      renderItem={({ item, index }) => (
        <LeaderboardCard
          karma={item}
          rank={index + 1}
          isCurrentUser={item.userId === currentUserId}
        />
      )}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    />
  );
}


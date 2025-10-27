import { Award, ExternalLink } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface NFT {
  id: string;
  name: string;
  image: string;
  collection: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

interface NFTDisplayProps {
  nfts: NFT[];
  onViewNFT?: (nftId: string) => void;
}

const getRarityColor = (rarity?: string) => {
  switch (rarity) {
    case 'legendary':
      return 'border-yellow-500 bg-yellow-500/10';
    case 'epic':
      return 'border-purple-500 bg-purple-500/10';
    case 'rare':
      return 'border-blue-500 bg-blue-500/10';
    default:
      return 'border-zinc-800 bg-zinc-900';
  }
};

const NFTCard = ({ nft, onPress }: { nft: NFT; onPress?: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-2xl overflow-hidden border ${getRarityColor(nft.rarity)}`}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: nft.image }}
        className="w-full aspect-square"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="text-white font-semibold text-sm mb-1" numberOfLines={1}>
          {nft.name}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-400 text-xs" numberOfLines={1}>
            {nft.collection}
          </Text>
          {nft.rarity && (
            <View
              className={`px-2 py-0.5 rounded-full ${
                nft.rarity === 'legendary'
                  ? 'bg-yellow-500/20'
                  : nft.rarity === 'epic'
                  ? 'bg-purple-500/20'
                  : nft.rarity === 'rare'
                  ? 'bg-blue-500/20'
                  : 'bg-gray-500/20'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  nft.rarity === 'legendary'
                    ? 'text-yellow-500'
                    : nft.rarity === 'epic'
                    ? 'text-purple-500'
                    : nft.rarity === 'rare'
                    ? 'text-blue-500'
                    : 'text-gray-500'
                }`}
              >
                {nft.rarity}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function NFTDisplay({ nfts, onViewNFT }: NFTDisplayProps) {
  if (nfts.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <View className="w-20 h-20 bg-zinc-900 rounded-full items-center justify-center mb-4">
          <Award size={32} color="#71717a" strokeWidth={2} />
        </View>
        <Text className="text-gray-400 text-base">No NFTs yet</Text>
        <Text className="text-gray-500 text-sm mt-2">
          Earn karma to unlock exclusive NFTs
        </Text>
      </View>
    );
  }

  return (
    <View className="p-4">
      {/* Header */}
      <View className="bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Award size={24} color="#f97316" strokeWidth={2} />
            <Text className="text-white text-lg font-bold ml-2">
              My NFT Collection
            </Text>
          </View>
          <TouchableOpacity
            className="flex-row items-center bg-zinc-800 px-3 py-1.5 rounded-full"
            activeOpacity={0.8}
          >
            <ExternalLink size={14} color="#fff" strokeWidth={2} />
            <Text className="text-white text-xs font-semibold ml-1">
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-400 text-sm mt-2">
          {nfts.length} NFT{nfts.length !== 1 ? 's' : ''} collected
        </Text>
      </View>

      {/* NFT Grid */}
      <View className="flex-row flex-wrap gap-3">
        {nfts.map((nft) => (
          <View key={nft.id} className="w-[48%]">
            <NFTCard nft={nft} onPress={() => onViewNFT?.(nft.id)} />
          </View>
        ))}
      </View>
    </View>
  );
}


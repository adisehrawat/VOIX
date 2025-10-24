import { Search } from 'lucide-react-native';
import { TextInput, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChangeText, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-zinc-900 rounded-full px-4 py-3 mx-6 mb-4 border border-zinc-800">
      <Search size={20} color="#71717a" strokeWidth={2} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#71717a"
        className="flex-1 ml-3 text-white text-base"
      />
    </View>
  );
}


import { AlertTriangle, Key, LogOut, Trash2, Wallet } from 'lucide-react-native';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { User } from '../../types';

interface AccountManagementProps {
  user: User;
  onChangePassword: () => void;
  onManageWallet: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export default function AccountManagement({
  user,
  onChangePassword,
  onManageWallet,
  onLogout,
  onDeleteAccount,
}: AccountManagementProps) {
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onDeleteAccount,
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: onLogout,
        },
      ]
    );
  };

  return (
    <View className="p-4">
      {/* Header */}
      <View className="bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800">
        <View className="flex-row items-center">
          <AlertTriangle size={24} color="#f97316" strokeWidth={2} />
          <Text className="text-white text-lg font-bold ml-2">
            Account Management
          </Text>
        </View>
        <Text className="text-gray-400 text-sm mt-2">
          Manage your account settings and security
        </Text>
      </View>

      {/* Account Info */}
      <View className="bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800">
        <Text className="text-gray-400 text-xs mb-3">ACCOUNT INFORMATION</Text>
        <View className="mb-3">
          <Text className="text-gray-400 text-sm">Email</Text>
          <Text className="text-white text-base font-semibold">{user.email}</Text>
        </View>
        <View className="mb-3">
          <Text className="text-gray-400 text-sm">Auth Type</Text>
          <View className="flex-row items-center mt-1">
            <View
              className={`px-3 py-1 rounded-full ${
                user.authType === 'Google' ? 'bg-blue-500/20' : 'bg-purple-500/20'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  user.authType === 'Google' ? 'text-blue-500' : 'text-purple-500'
                }`}
              >
                {user.authType}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Text className="text-gray-400 text-sm">Wallet ID</Text>
          <Text className="text-white text-sm font-mono" numberOfLines={1}>
            {user.walletId}
          </Text>
        </View>
      </View>

      {/* Security Actions */}
      <View className="mb-4">
        <Text className="text-gray-400 text-xs mb-3 px-2">SECURITY</Text>
        
        {user.authType === 'Password' && (
          <TouchableOpacity
            onPress={onChangePassword}
            className="bg-zinc-900 rounded-2xl p-4 mb-3 border border-zinc-800 flex-row items-center"
            activeOpacity={0.8}
          >
            <View className="w-10 h-10 bg-blue-500/20 rounded-full items-center justify-center mr-3">
              <Key size={20} color="#3b82f6" strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-base">
                Change Password
              </Text>
              <Text className="text-gray-400 text-sm">
                Update your account password
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={onManageWallet}
          className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex-row items-center"
          activeOpacity={0.8}
        >
          <View className="w-10 h-10 bg-purple-500/20 rounded-full items-center justify-center mr-3">
            <Wallet size={20} color="#a855f7" strokeWidth={2} />
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold text-base">
              Manage Wallet
            </Text>
            <Text className="text-gray-400 text-sm">
              View and manage your wallet settings
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      <View>
        <Text className="text-red-500 text-xs mb-3 px-2">DANGER ZONE</Text>
        
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-zinc-900 rounded-2xl p-4 mb-3 border border-zinc-800 flex-row items-center"
          activeOpacity={0.8}
        >
          <View className="w-10 h-10 bg-orange-500/20 rounded-full items-center justify-center mr-3">
            <LogOut size={20} color="#f97316" strokeWidth={2} />
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold text-base">
              Logout
            </Text>
            <Text className="text-gray-400 text-sm">
              Sign out of your account
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDeleteAccount}
          className="bg-red-500/10 rounded-2xl p-4 border border-red-500/20 flex-row items-center"
          activeOpacity={0.8}
        >
          <View className="w-10 h-10 bg-red-500/20 rounded-full items-center justify-center mr-3">
            <Trash2 size={20} color="#ef4444" strokeWidth={2} />
          </View>
          <View className="flex-1">
            <Text className="text-red-500 font-semibold text-base">
              Delete Account
            </Text>
            <Text className="text-gray-400 text-sm">
              Permanently delete your account and data
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}


import * as ExpoLocation from 'expo-location';
import { MapPin } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

interface LocationServicesProps {
  onLocationUpdate: (latitude: string, longitude: string) => void;
}

export default function LocationServices({ onLocationUpdate }: LocationServicesProps) {
  const [location, setLocation] = useState<ExpoLocation.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await ExpoLocation.getForegroundPermissionsAsync();
    setIsEnabled(status === 'granted');
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert(
          'Location Permission',
          'Please enable location services to see nearby buzzes'
        );
        return;
      }

      setIsEnabled(true);
      getCurrentLocation();
    } catch (error) {
      setErrorMsg('Error requesting location permission');
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await ExpoLocation.getCurrentPositionAsync({});
      setLocation(location);
      onLocationUpdate(
        location.coords.latitude.toString(),
        location.coords.longitude.toString()
      );
    } catch (error) {
      setErrorMsg('Error getting location');
    }
  };

  return (
    <View className="bg-zinc-900 rounded-2xl p-4 mx-4 mb-4 border border-zinc-800">
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 bg-blue-500/20 rounded-full items-center justify-center mr-3">
          <MapPin size={20} color="#3b82f6" strokeWidth={2} />
        </View>
        <View className="flex-1">
          <Text className="text-white font-semibold text-base">
            Location Services
          </Text>
          <Text className="text-gray-400 text-sm">
            {isEnabled ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
      </View>

      {!isEnabled ? (
        <TouchableOpacity
          onPress={requestLocationPermission}
          className="bg-blue-500 rounded-full py-3 items-center"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold">Enable Location</Text>
        </TouchableOpacity>
      ) : (
        <View>
          {location && (
            <View className="bg-zinc-800 rounded-xl p-3 mb-3">
              <Text className="text-gray-400 text-xs mb-1">Current Location</Text>
              <Text className="text-white text-sm">
                Lat: {location.coords.latitude.toFixed(4)}
              </Text>
              <Text className="text-white text-sm">
                Lng: {location.coords.longitude.toFixed(4)}
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={getCurrentLocation}
            className="bg-zinc-800 rounded-full py-3 items-center border border-zinc-700"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold">Refresh Location</Text>
          </TouchableOpacity>
        </View>
      )}

      {errorMsg && (
        <Text className="text-red-500 text-xs mt-2">{errorMsg}</Text>
      )}
    </View>
  );
}


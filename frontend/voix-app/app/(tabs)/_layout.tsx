import { router, Tabs } from 'expo-router';
import { Bell, Home, Plus, Search, User } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, TouchableOpacity, useWindowDimensions, View } from 'react-native';

function CustomTabBar({ state, descriptors, navigation }: { state: any, descriptors: any, navigation: any }) {
  const tabWidth = 64;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = React.useState(0);

  const { width: screenWidth } = useWindowDimensions();

  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  useEffect(() => {
    if (containerWidth > 0) {
      const padding = 32; // px-4 = 16px on each side
      const availableWidth = containerWidth - padding - tabWidth;
      const numberOfTabs = state.routes.length;
      const spacing = availableWidth / (numberOfTabs - 1);
      const position = spacing * state.index;

      Animated.timing(animatedValue, {
        toValue: position,
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index, containerWidth]);

  const handleCreateBuzz = () => {
    router.push('/create-buzz');
  };

  return (
    <>
      {/* Create Buzz Button */}
      <View className="absolute bottom-32 right-8">
        <TouchableOpacity
          onPress={handleCreateBuzz}
          className="w-16 h-16 rounded-full bg-white items-center justify-center shadow-lg"
          activeOpacity={0.8}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Plus size={30} color="#000" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View className="absolute bottom-8 left-0 right-0 items-center">
        <View 
          onLayout={handleLayout}
          className="bg-zinc-900 rounded-full px-4 py-3 flex-row items-center justify-between border border-zinc-800 mx-10 relative" 
          style={{ width: Math.min(screenWidth * 0.9, 400) }}
        >
        <Animated.View 
          className="absolute bg-white rounded-full"
          style={{
            width: tabWidth,
            height: 48,
            transform: [{ translateX: animatedValue }],
            left: 16,
          }}
        />
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Get icon based on route name
          const getIcon = () => {
            switch (route.name) {
              case 'index':
                return Home;
              case 'explore':
                return Search;
              case 'activity':
                return Bell;
              case 'profile':
                return User;
              default:
                return Home;
            }
          };

          const Icon = getIcon();

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              className="h-12 items-center justify-center z-10"
              style={{ width: tabWidth }}
            >
              <Icon
                size={24}
                color={isFocused ? '#000000' : '#ffffff'}
                fill={route.name === 'index' && isFocused ? '#000000' : 'none'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
    </>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
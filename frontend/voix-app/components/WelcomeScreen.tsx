import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
import AnimatedLogo from "./AnimatedLogo";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [show, setShow] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const taglineFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Screen fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Logo fade in
    Animated.timing(logoFadeAnim, {
      toValue: 1,
      duration: 1500,
      delay: 300,
      useNativeDriver: true,
    }).start();

    // Text fade in
    Animated.timing(textFadeAnim, {
      toValue: 1,
      duration: 1000,
      delay: 2500,
      useNativeDriver: true,
    }).start();

    // Tagline fade in
    Animated.timing(taglineFadeAnim, {
      toValue: 1,
      duration: 1000,
      delay: 2800,
      useNativeDriver: true,
    }).start();

    // Button fade in
    Animated.timing(buttonFadeAnim, {
      toValue: 1,
      duration: 1000,
      delay: 3100,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, logoFadeAnim, textFadeAnim, taglineFadeAnim, buttonFadeAnim]);

  const handleContinue = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setShow(false);
      onComplete();
    });
  };

  if (!show) return null;

  return (
    <Animated.View
      className="flex-1 items-center justify-center"
      style={{
        backgroundColor: '#000000',
        opacity: fadeAnim,
      }}
    >
      <View className="items-center px-8">
        <Animated.View style={{ opacity: logoFadeAnim }}>
          <AnimatedLogo />
        </Animated.View>
        
        <Animated.Text
          className="text-2xl font-bold text-white mt-12 mb-3 text-center"
          style={{ opacity: textFadeAnim }}
        >
          VOIX
        </Animated.Text>

      </View>
    </Animated.View>
  );
}

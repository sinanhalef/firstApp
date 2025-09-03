import { useRouter, Href } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

interface GameIconProps {
  gameName?: string;
  iconName: string | React.ReactNode;
  gameRoute?: Href;
}

const GameIcon = ({ gameName = "Game Name", iconName = "🎮", gameRoute }: GameIconProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();

  const handlePress = () => {
    console.log("button pressed");
    setIsClicked(true);
    if (gameRoute) {
      router.push(gameRoute);
    }
    setTimeout(() => {
      setIsClicked(false);
    }, 1000);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        (pressed || isClicked) && styles.containerPressed,
      ]}
    >
      <View style={styles.textSection}>
        <Text style={styles.gameNameText}>{gameName}</Text>
      </View>
      <View style={styles.iconSection}>
        <Text style={styles.iconText}>{iconName}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: RFValue(200),
    height: RFValue(50),
    flexDirection: 'row',
    backgroundColor: '#333333',
    borderRadius: RFValue(6),
    overflow: 'hidden',
  },
  textSection: {
    flex: 0.7, // 70% of the width
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(4),
  },
  iconSection: {
    flex: 0.3, // 30% of the width
    backgroundColor: '#ffffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameNameText: {
    color: '#ffffff',
    fontSize: RFValue(10),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconText: {
    fontSize: RFValue(16),
    textAlign: 'center',
  },
  containerPressed: {
    width: RFValue(200),
    height: RFValue(50),
    flexDirection: 'row',
    backgroundColor: '#929292ff',
    borderRadius: RFValue(6),
    overflow: 'hidden',
  },
});

export default GameIcon;
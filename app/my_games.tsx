import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import GameIcon from '../components/GameIcon';
import { Href } from 'expo-router';


export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome</Text>
      <View style={styles.iconsContainer}>
        <GameIcon gameName="Spy" iconName="🎮" gameRoute={"/spy/spy_game_select" as Href}/>
        <GameIcon gameName="ID" iconName="🕵️‍♂️" gameRoute={"/id/spy_game_select" as Href}/>
        <GameIcon iconName="🎯"/>
      
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff9fafff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 80,
  },
  welcomeText: {
    fontSize: RFValue(48),
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  iconsContainer: {
    gap: RFValue(10),
    marginTop: RFValue(20),
  },
});

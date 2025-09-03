import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { StatusBar } from 'react-native-web'
import { hp, wp } from '../helpers/common'
import {theme} from '../constants/theme'
import Button from '../components/Button'
import { useRouter } from 'expo-router'
//WE ARE AT 34.00
const Welcome = () => {
  const router = useRouter();
  return(
    <ScreenWrapper bg = "white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/*welcome image*/}
        <Image style = {styles.welcomeImage} resizeMode='contain' source={require('../assets/images/default_user.png')} />
        <View style={{gap: 20}}>
            <Text style={styles.title}>Night Pulse!</Text>
            <Text style={styles.punchline}>
              Where every connection matters. Join us in building a community that values every interaction.
            </Text>
          </View>

          <View sytle={styles.footer}>
            <Button
            title="Getting Started"
            buttonStyle={{marginHorizontal: wp(3)}}
              onPress={() => router.push('signUp')}
            />
            <View style={styles.bottomTextContainer}>
              <Text style={styles.loginText}>
                Already have an account?
                </Text>
                <Pressable onPress = {() => router.push('/login')}>
                  {/* Pressable is used to make the text clickable */}
                  <Text style={[styles.loginText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>
                    Login
                    </Text>
                </Pressable>
              </View>
          </View>
        </View>
    </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingHorizontal: wp(4)
  },
  welcomeImage: {
    height: hp(30),
    width: wp(100),
    alignSelf: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: 'center',
    fontWeight: theme.fonts.extraBold
  },
  punchline: {
    color: theme.colors.text,
    fontSize: hp(1.7),
    textAlign: 'center',
    paddingHorizontal: wp(10),
  },
  footer: {
    gap: 30,
    width: '100%',
  },
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  loginText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6),
  }
})
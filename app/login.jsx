import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { theme } from '../constants/theme'
import Icon from '../assets/icons/index'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import { StatusBar } from 'react-native-web'
import { useRouter } from 'expo-router'
import { hp, wp } from '../helpers/common'
import Input from '../components/Input'

const Login = () => {
    const router = useRouter();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);

    const onSubmit = () => {
        if(!emailRef.current || !passwordRef.current) {
            Alert.alert("Please fill in all fields");
            return;
        }
        //good to go
        setLoading(true);
    }
  return (
    <ScreenWrapper bg='white'>
        <StatusBar style="dark" />
        <View style={styles.container}>
        <BackButton router={router}/>
        
        <View>
            <Text style={styles.welcomeText}>Hey</Text>
            <Text style={styles.welcomeText}>Welcome back</Text>
        </View>

        <View style={styles.form}>
            <Text style={{fontSize: hp(1.5), color: theme.colors.text}}>
                Please login to continue
            </Text>

            <Input
                icon={<Icon name="mail" size={26} strokeWidth={1.6}/>}
                placeholder="Enter your Email"
                onChangeText={value => emailRef.current = value}
            />

            <Input
                icon={<Icon name="lock" size={26} strokeWidth={1.6}/>}
                placeholder="Enter your Password"
                secureTextEntry={true}
                onChangeText={value => passwordRef.current = value}
            />
            <Text style={styles.forgotPassword}> 
                Forgot Password?
            </Text>

            <Button title={"Login"} loading={loading} onPress={onSubmit} />
        </View>

        <View style={styles.footer}>
            <Text style={styles.footerText}>
                Don't have an account?
            </Text>
            <Pressable>
                <Text style={[styles.footerText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}
                onPress={() => router.push('/signUp')}>
                    Sign Up
                </Text>
            </Pressable>
        </View>
        

        </View>
    </ScreenWrapper>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5),
    },
    welcomeText: {
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text,
        fontSize: hp(4),
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    forgotPassword: {
        textAlign: 'right',
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text,
    },
    form: {
        gap: 25,
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6),
    },
})
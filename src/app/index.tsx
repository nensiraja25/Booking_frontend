import CustomText from '@/components/shared/CustomText'
import { tokenStorage } from '@/store/storage'
import { useUserStore } from '@/store/userStore'
import { commonStyles } from '@/styles/commonStyles'
import { splashStyles } from '@/styles/splashStyles'
import { useFonts } from 'expo-font'
import React, { useEffect, useState } from 'react'
import { Alert, Image, View } from 'react-native'
import {jwtDecode} from 'jwt-decode';
import { resetAndNavigate } from '@/utils/Helpers'
import { refresh_tokens } from '@/service/apiInterceptor'
import { logout } from '@/service/authService'

interface decodedToken { 
  exp: number;
}

const Main = () => {

  const [loaded] = useFonts({
    Bold: require('../assets/fonts/NotoSans-Bold.ttf'),
    Regular: require('../assets/fonts/NotoSans-Regular.ttf'),
    Medium: require('../assets/fonts/NotoSans-Medium.ttf'),
    Light: require('../assets/fonts/NotoSans-Light.ttf'),
    SemiBold: require('../assets/fonts/NotoSans-SemiBold.ttf'),
  });

  const {user}=useUserStore()
  const [hasNavigated, setHasNavigated] = useState(false);

  const tokenCheck=async()=>{
    const access_token=tokenStorage.getString('access_token') as string;
    const refresh_token=tokenStorage.getString('refresh_token') as string;

    if(access_token){
      const decodedAccessToken= jwtDecode<decodedToken>(access_token);
      const decodedRefreshToken= jwtDecode<decodedToken>(refresh_token);
      const currentTime = Date.now() / 1000; // Current time in seconds

      if (decodedRefreshToken?.exp < currentTime) {
        // resetAndNavigate('/role');
        logout();
        Alert.alert('Session Expired', 'Your session has expired. Please log in again.');
      }

      if(decodedAccessToken?.exp < currentTime){
        try {
          refresh_tokens();
        } catch (error) {
          console.error('Error refreshing tokens:', error);
          Alert.alert('refresh token error.');
        }
      }

      if(user){
        resetAndNavigate('./customer/home');
      }
      else{
        resetAndNavigate('./rider/home');
      }
      return;
    }

    resetAndNavigate('/role');
  }

  useEffect(() => {
    if (loaded && !hasNavigated) {
      const timeoutId = setTimeout(() => {
        tokenCheck()
        setHasNavigated(true);
      }, 1000);
      return () => clearTimeout(timeoutId);
    } 
  }, [loaded, hasNavigated]);


  return (
    <View style={commonStyles.container}>
      <Image source={require('@/assets/images/logo_t.png')} 
      style={splashStyles.img}/>
      <CustomText variant='h5' fontFamily='Medium' style={splashStyles.text}>
        Made in INDIA 🇮🇳
      </CustomText>
    </View>
  )
}

export default Main
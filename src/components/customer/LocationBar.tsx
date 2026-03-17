import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useUserStore } from '@/store/userStore'
import { useWS } from '@/service/WSProvider'
import { uiStyles } from '@/styles/uiStyles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { logout } from '@/service/authService'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { RFValue } from 'react-native-responsive-fontsize'
import { Colors } from '@/utils/Constants'
import { router } from 'expo-router'
import CustomText from '../shared/CustomText'

const LocationBar = () => {

    const {location}=useUserStore()
    const {disconnect}=useWS()

  return (
    <View style={uiStyles.absoluteTop}>
        <SafeAreaView/>
        <View style={uiStyles.container}>
            <TouchableOpacity style={uiStyles.btn} onPress={()=> logout(disconnect)}>
                {/* <Ionicons name="menu-outline" size={RFValue(18)} color={Colors.text}/> */}
                <AntDesign name="poweroff" size={RFValue(18)} color={Colors.text}/>
            </TouchableOpacity>
            <TouchableOpacity style={uiStyles.locationBar} onPress={()=>router.navigate("/customer/selectlocations")}>
                <View style={uiStyles.dot}/>
                <CustomText numberOfLines={1} style={uiStyles.locationText}>
                    {location?.address || "Select Location..."}
                </CustomText>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default LocationBar
import CustomText from '@/components/shared/CustomText'
import { roleStyles } from '@/styles/roleStyles'
import { router } from 'expo-router'
import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'

const Role  = () => {
  const handleCustomerPress = () => {
    router.navigate('./customer/auth');
  }
  const handleRiderPress = () => {
    router.navigate('./rider/auth');
  }
  const handleAdminPress = () => {
    router.navigate('./admin/auth');
  }
  return (
    <View style={roleStyles.container}>
      <Image source={require('@/assets/images/logo_t.png')} 
        style={roleStyles.logo} />
        <CustomText fontFamily='Medium' variant='h6'>
          choose your role type
        </CustomText>
        <TouchableOpacity style={roleStyles.card} onPress={handleCustomerPress}>
          <Image source={require("@/assets/images/customer.jpg")} style={roleStyles.image} />
          <View style={roleStyles.cardContent}>
            <CustomText style={roleStyles.title}>User</CustomText>
            <CustomText style={roleStyles.description}>Are you a User? i hope we serve you the best </CustomText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={roleStyles.card} onPress={handleRiderPress}>
          <Image source={require("@/assets/images/rider.jpg")} style={roleStyles.image} />
          <View style={roleStyles.cardContent}>
            <CustomText style={roleStyles.title}>Rider</CustomText>
            <CustomText style={roleStyles.description}>Are you a Service Provider?  </CustomText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={roleStyles.card} onPress={handleAdminPress}>
          <Image source={require("@/assets/images/customer.jpg")} style={roleStyles.image} />
          <View style={roleStyles.cardContent}>
            <CustomText style={roleStyles.title}>Admin</CustomText>
            <CustomText style={roleStyles.description}>Manage users, providers, and requests</CustomText>
          </View>
        </TouchableOpacity>
    </View>
  )
}

export default Role 
import { View, Text } from 'react-native'
import React, { FC } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import CustomText from './CustomText'
import { StyleSheet } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
// import { PhoneInputProps } from '@/types/props'
import { PhoneInputProps } from '@/utils/types'

const PhoneInput: FC<PhoneInputProps> = ({value,onChangeText,onFocus,onBlur}) => { 

  return (
    <View style={styles.container} >
        <CustomText fontFamily='Medium' style={styles.text}>
            🇮🇳 +91
        </CustomText>
        <TextInput
            placeholder='0000000000'
            keyboardType='phone-pad'
            value={value}
            maxLength={10}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholderTextColor={"#ccc "}
            style={styles.input}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        gap:4,
        marginVertical:15,
        borderWidth:1,
        borderColor:'#222',
        borderRadius:0,
        paddingHorizontal:10,
    },
    input:{
        fontSize:RFValue(14),
        fontFamily:'Medium',
        height:45,
        width:'90%',
    },
    text:{
        fontSize:RFValue(14),
        top:-1,
        fontFamily:'Medium',
    }
    
})

export default PhoneInput;
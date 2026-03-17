import { View, Text, Alert, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import { useWS } from '@/service/WSProvider';
import { useRiderStore } from '@/store/riderStore';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import CustomText from '../shared/CustomText';
import { riderStyles } from '@/styles/riderStyles';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { commonStyles } from '@/styles/commonStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '@/utils/Constants';
import { logout } from '@/service/authService';

const RiderHeader = () => {

    const { disconnect, emit } = useWS();
    const { setOnDuty, onDuty, setLocation } = useRiderStore();
    const isFocused = useIsFocused();

    const toggleOnDuty = async () => {
        if (onDuty) {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Location permission is required to go on duty.");
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude, heading } = location.coords;
            setLocation({ latitude: latitude, longitude: longitude, address: 'Somewhere', heading: heading as number });
            emit('goOnDuty', {
                latitude: location?.coords?.latitude,
                longitude: location?.coords?.longitude,
                heading: heading
            })
        } else {
            emit('goOffDuty')
        }
    };

    useEffect(() => {
        if (isFocused) {
            toggleOnDuty();
        }
    }, [isFocused, onDuty])

    return (
        <>
            <View style={riderStyles.headerContainer}>
                <SafeAreaView />

                <View style={commonStyles.flexRowBetween}>
                    
                    <FontAwesome name="power-off" onPress={() => logout(disconnect)} size={RFValue(24)} color={Colors.text}/>
                    <TouchableOpacity
                        style={riderStyles.toggleContainer}
                        onPress={() => setOnDuty(!onDuty)}
                    >
                        <CustomText
                            fontFamily="SemiBold"
                            fontSize={12}
                            style={{ color: "#888" }}
                        >
                            {onDuty ? "ON-DUTY" : "OFF-DUTY"}
                        </CustomText>

                        <Image
                            source={
                                onDuty
                                    ? require("@/assets/icons/switch_on.png")
                                    : require("@/assets/icons/switch_off.png")
                            }
                            style={riderStyles.icon}
                        />
                    </TouchableOpacity>

                    <MaterialIcons name="notifications" size={24} color="black" />
                </View>
            </View>
            <View style={riderStyles?.earningContainer}>
                <CustomText fontSize={13} style={{ color: "#fff" }} fontFamily="Medium">
                    Today's Earnings
                </CustomText>

                <View style={commonStyles?.flexRowGap}>
                    <CustomText
                        fontSize={14}
                        style={{ color: "#fff" }}
                        fontFamily="Medium"
                    >
                        ₹ 231.22
                    </CustomText>
                    <MaterialIcons name="arrow-drop-down" size={24} color="#fff" />
                </View>
            </View>

        </>
    );
};

export default RiderHeader
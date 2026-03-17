import RoutesMap from '@/components/customer/RoutesMap';
import CustomText from '@/components/shared/CustomText';
import { useUserStore } from '@/store/userStore';
import { commonStyles } from '@/styles/commonStyles';
import { rideStyles } from '@/styles/rideStyles';
import { calculateFare } from '@/utils/mapUtils';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
// import { router } from '../../../.expo/types/router';
import { router } from 'expo-router';
import CustomButton from '@/components/shared/CustomButton';
import { createRide } from '@/service/rideService';


const RideBooking = () => {
    const route = useRoute() as any;
    const item = route?.params as any;
    const { location } = useUserStore() as any;
    const [selectedOption, setSelectedOption] = useState("Bike");
    const [loading, setLoading] = useState(false)

    const farePrice = useMemo(
        () => calculateFare(parseFloat(item?.distanceInKm)), [item?.distanceInKm],
    );

    const rideOptions = useMemo(
        () => [
            {
                type: "AMBULANCE",
                seats: 1,
                time: "1 mins",
                droptime: "4:27 PM",
                price: farePrice?.bike,
                isfastest: true,
                icon: require("@/assets/icons/ambulance.png"),
            },
            {
                type: "FIRE_BRIGADE",
                seats: 3,
                time: "2 mins",
                droptime: "4:30 PM",
                price: farePrice?.auto,
                isfastest: false,
                icon: require("@/assets/icons/fire.png"),
            },
            {
                type: "ANIMAL_NGO",
                seats: 4,
                time: "3 mins",
                droptime: "4:32 PM",
                price: farePrice?.cabEconomy,
                isfastest: false,
                icon: require("@/assets/icons/ngo.png"),
            },
        ], [farePrice]
    )

    const handleOptionSelect = useCallback((type: string) => {
        setSelectedOption(type);

    }, [])

    const handleRideBooking = async () => {
        setLoading(true);
         
        await createRide({  
         vehicle:  
         selectedOption === "AMBULANCE"  
         ? "AMBULANCE"  
         : selectedOption === "FIRE_BRIGADE"  
         ? "FIRE_BRIGADE" 
         : "ANIMAL_NGO",  
         drop: {  
         latitude: parseFloat(item.drop_latitude),  
         longitude: parseFloat(item.drop_longitude),  
         address: item?.drop_address,  
         },  
         pickup: {  
         latitude: parseFloat(location.latitude),  
         longitude: parseFloat(location.longitude),  
         address: location.address,  
         },
        });

        setLoading(false);
        // navigate to ride tracking screen or show confirmation
    };

    return (
        <View style={rideStyles.container}>
            <StatusBar style="light" backgroundColor='orange' translucent={false} />
            {item?.drop_latitude && location?.latitude && (
                <RoutesMap
                    drop={{
                        latitude: parseFloat(item?.drop_latitude),
                        longitude: parseFloat(item?.drop_longitude),
                    }}
                    pickup={{
                        latitude: parseFloat(location?.latitude),
                        longitude: parseFloat(location?.longitude),
                    }}
                />
            )}
            <View style={rideStyles.rideSelectionContainer}>
                <View style={rideStyles?.offerContainer}>
                    <CustomText fontSize={12} style={rideStyles.offerText}>
                        | You get ₹10 off 5 coins cashback!
                    </CustomText>
                </View>
                <ScrollView
                    contentContainerStyle={rideStyles?.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {rideOptions?.map((ride, index) => (
                        <RideOption
                            key={index}
                            ride={ride}
                            selected={selectedOption}
                            onSelect={handleOptionSelect}
                        />
                    ))}
                </ScrollView>
                </View>
                <TouchableOpacity
                    style={rideStyles.backButton}
                    onPress={() => router.back()}
                >
                    <MaterialIcons
                        name="arrow-back-ios"
                        size={RFValue(14)}
                        style={{ left: 4 }}
                        color="black"
                    />
                </TouchableOpacity>

                <View style={rideStyles.bookingContainer}>
                    <CustomButton title='Book service' onPress={handleRideBooking} disabled={loading} loading={loading}/>
                    </View>
        </View>
    )
}

const RideOption = memo(({ ride, selected, onSelect }: any) => (
    <TouchableOpacity
        onPress={() => onSelect(ride?.type)}
        style={[
            rideStyles.rideOption,
            { borderColor: selected === ride.type ? "#222" : "#ddd" },
        ]}
    >
        <View style={commonStyles.flexRowBetween}>
            <Image source={ride?.icon} style={rideStyles?.rideIcon} />
            <View style={rideStyles?.rideDetails}>
                <CustomText fontSize={12} fontFamily="Medium">
                    {ride?.type}
                    {ride?.isfastest && <Text style={rideStyles?.fastestLabel}>Fastest</Text>}
                </CustomText>
                <CustomText fontSize={10}>
                    {ride?.seats} seats | {ride?.time} Away | Drop by {ride?.droptime}
                </CustomText>
            </View>
            <View style={rideStyles?.priceContainer}>
                <CustomText fontFamily="Medium" fontSize={14}>
                    ₹{ride?.price?.toFixed(2)}
                </CustomText>
                {selected === ride.type && (
                    <Text style={rideStyles?.discountedPrice}>
                        ₹{Number(ride?.price + 10).toFixed(2)}
                    </Text>
                )}
            </View>

        </View>
    </TouchableOpacity>
));

export default memo(RideBooking);
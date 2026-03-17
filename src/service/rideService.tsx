import { router } from "expo-router";
import { appAxios } from "./apiInterceptor";
import { Alert } from "react-native";
import { resetAndNavigate } from "@/utils/Helpers";

interface coords {
    latitude: number;
    longitude: number;
    address: string;
}

export const createRide = async (payload: {
    vehicle: "Ambulance" | "Fire" | "NGO",
    pickup: coords,
    drop: coords,
}) => {
    try {
        const res = await appAxios.post('/ride/create', payload);
        router?.navigate(
            {
                pathname: "/customer/liveride",
                params: {
                    id: res?.data?.ride?._id,
                },
            }
        );
    } catch (error: any) {
        Alert.alert("Error", error?.response?.data?.message || "Failed to create ride. Please try again.");
        console.log("Error creating ride:", error.response || error);
    }
}

export const getMyRides = async (isCustomer: boolean = true) => {
    try {
        const res = await appAxios.get(`/ride/rides`);
        const filterRides = res.data.rides?.filter(
            (ride: any) => ride?.status != "COMPLETED"
        );
        if (filterRides?.length > 0) {
            router?.navigate({
                pathname: isCustomer ? "/customer/liveride" : "/rider/liveride",
                params: {
                    id: filterRides![0]?._id,
                },
            });
        }
    } catch (error: any) {
        Alert.alert("Oh! Dang there was an error");
        console.log("Error: GET MY Ride", error);
    }
};

export const acceptRideOffer = async (rideId: string) => {
    try {
        const res = await appAxios.patch(`/ride/accept/${rideId}`);
        resetAndNavigate({
            pathname: '/rider/liveride',
            params: { id: rideId }
        })
    } catch (error: any) {
        Alert.alert("Oh! Dang there was an error");
        console.log(error);
    }
}


export const updateRideStatus = async (rideId: string, status: string) => {
    try {
        const res = await appAxios.patch(`/ride/update/${rideId}`, { status })
        return true;
    } catch (error: any) {
        Alert.alert("Oh! Dang there was an error");
        console.log(error);
        return false;
    }
}




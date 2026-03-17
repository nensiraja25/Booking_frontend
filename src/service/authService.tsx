import { useRiderStore } from "@/store/riderStore";
import { tokenStorage } from "@/store/storage";
import { useUserStore } from "@/store/userStore";
import { resetAndNavigate } from "@/utils/Helpers";
import axios from "axios";
import { Alert } from "react-native";
import { BASE_URL } from "./config";

export const requestOtp = async (payload: {
    role: "customer" | "rider" | "admin";
    phone: string;
}) => {
    const res = await axios.post(`${BASE_URL}/auth/request-otp`, payload);
    return res.data as { message: string; dev_otp?: string; expires_in_seconds: number };
};

export const verifyOtp = async (
    payload: {
        role: "customer" | "rider" | "admin";
        phone: string;
        code: string;
    },
    updateAccessToken: () => void
) => {
    const { setUser } = useUserStore.getState();
    const { setUser: setRiderUser } = useRiderStore.getState();

    const res = await axios.post(`${BASE_URL}/auth/verify-otp`, payload);

    if (res.data.user.role === "customer" || res.data.user.role === "admin") {
        setUser(res.data.user);
    } else {
        setRiderUser(res.data.user);
    }

    tokenStorage.set("access_token", res.data.access_token);
    tokenStorage.set("refresh_token", res.data.refresh_token);

    if (res.data.user.role === "customer") {
        resetAndNavigate("/customer/home");
    } else if (res.data.user.role === "rider") {
        resetAndNavigate("/rider/home");
    } else {
        resetAndNavigate("/admin/home");
    }

    updateAccessToken();
};

export const signin = async (
    payload:{
        role:"customer" | "rider";
        phone:string;
    },
    updateAccessToken:()=>void
) => {
    const {setUser}=useUserStore.getState();
    const {setUser: setRiderUser}=useRiderStore.getState();

    try {
        const res=await axios.post(`${BASE_URL}/auth/signin`,payload);
        if(res.data.user.role==="customer"){
            setUser(res.data.user);
        }
        else{
            setRiderUser(res.data.user);
        }

        tokenStorage.set("access_token",res.data.access_token);
        tokenStorage.set("refresh_token",res.data.refresh_token);

        if(res.data.user.role==="customer"){
            resetAndNavigate("/customer/home");
        }
        else{
            resetAndNavigate("/rider/home");
        }

        updateAccessToken();
    } catch (error:any) {

    console.log("====== SIGNIN ERROR START ======");
    console.log("Message:", error?.message);
    console.log("Response:", error?.response);
    console.log("Response data:", error?.response?.data);
    console.log("Status:", error?.response?.status);
    console.log("====== SIGNIN ERROR END ======");
    
        Alert.alert("Sign in failed","An error occurred while signing in. Please try again later.")
        console.log("Error: ",error?.response?.data?.msg || "Error signing in");
    }
}


export const logout = async( disconnect?:()=>void) => {
    if(disconnect){
        disconnect();
    }

     const {clearData} = useUserStore.getState();
     const {clearData:clearRiderData} = useRiderStore.getState();
     tokenStorage.clearAll();
     clearData();
     clearRiderData();
     resetAndNavigate("/role");
}
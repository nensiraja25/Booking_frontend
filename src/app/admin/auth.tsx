import { View, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

import { authStyles } from "@/styles/authStyles";
import { commonStyles } from "@/styles/commonStyles";
import CustomText from "@/components/shared/CustomText";
import CustomButton from "@/components/shared/CustomButton";
import PhoneInput from "@/components/shared/PhoneInput";
import OtpInputModal from "@/components/shared/OtpInputModal";
import { requestOtp, verifyOtp } from "@/service/authService";
import { useWS } from "@/service/WSProvider";

const AdminAuth = () => {
  const { updateAccessToken } = useWS();
  const [phone, setPhone] = useState("");
  const [otpVisible, setOtpVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert("Invalid phone number", "Please enter a valid phone number");
      return;
    }
    try {
      setLoading(true);
      const res = await requestOtp({ role: "admin", phone });
      if (res?.dev_otp) {
        Alert.alert("Dev OTP", `Your OTP is ${res.dev_otp}`);
      }
      setOtpVisible(true);
    } catch (e: any) {
      Alert.alert("Failed", "Could not send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.container}>
        <View style={commonStyles.flexRowBetween}>
          <Image
            source={require("@/assets/images/logo_t.png")}
            style={authStyles.logo}
          />
          <TouchableOpacity style={authStyles.flexRowGap}>
            <MaterialIcons name="help" size={18} color="gray" />
            <CustomText fontFamily="Medium" variant="h7">
              Help
            </CustomText>
          </TouchableOpacity>
        </View>
        <CustomText variant="h6" fontFamily="Medium">
          Admin login
        </CustomText>
        <CustomText
          variant="h7"
          style={commonStyles.lightText}
          fontFamily="Regular"
        >
          Enter your phone number to proceed.
        </CustomText>
        <PhoneInput onChangeText={setPhone} value={phone} />
      </ScrollView>

      <View style={authStyles.footerContainer}>
        <CustomText
          variant="h8"
          fontFamily="Regular"
          style={[
            commonStyles.lightText,
            { textAlign: "center", marginHorizontal: 20 },
          ]}
        >
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </CustomText>
        <CustomButton
          title="Next"
          onPress={handleNext}
          loading={loading}
          disabled={loading}
        />
      </View>

      <OtpInputModal
        visible={otpVisible}
        onClose={() => setOtpVisible(false)}
        title="Enter OTP"
        onConfirm={(otp) =>
          verifyOtp({ role: "admin", phone, code: otp }, updateAccessToken)
        }
        length={4}
      />
    </SafeAreaView>
  );
};

export default AdminAuth;


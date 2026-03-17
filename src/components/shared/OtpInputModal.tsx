import React, { memo, useRef, useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { modalStyles } from "@/styles/modalStyles";

interface OtpInputModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  onConfirm: (otp: string) => void;
  length?: number;
}

const OtpInputModal: React.FC<OtpInputModalProps> = ({
  visible,
  onClose,
  title,
  onConfirm,
  length = 4,
}) => {
  const [otp, setOtp] = useState<string[]>(Array.from({ length }, () => ""));
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (/^\d$/.test(value) || value === "") {
      const next = [...otp];
      next[index] = value;
      setOtp(next);

      if (value && index < inputs.current.length - 1) {
        inputs.current[index + 1]?.focus();
      }
      if (!value && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleConfirm = () => {
    const otpValue = otp.join("");
    if (otpValue.length === length) {
      onConfirm(otpValue);
    } else {
      alert(`Please enter a valid ${length}-digit OTP`);
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={visible}
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalContainer}>
        <Text style={modalStyles.centerText}>{title}</Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              value={digit}
              onChangeText={(v) => handleOtpChange(v, index)}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    textAlign: "center",
    fontSize: 18,
    borderRadius: 8,
  },
  confirmButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    margin: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default memo(OtpInputModal);


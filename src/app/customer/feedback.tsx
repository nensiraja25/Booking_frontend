import React, { useState } from "react";
import { Alert, ScrollView, TextInput, View } from "react-native";
import CustomText from "@/components/shared/CustomText";
import CustomButton from "@/components/shared/CustomButton";
import { commonStyles } from "@/styles/commonStyles";
import { submitFeedback } from "@/service/feedbackService";
import { router } from "expo-router";

const CustomerFeedback = () => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(5);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!message.trim()) {
      Alert.alert("Missing", "Please write feedback");
      return;
    }
    setLoading(true);
    try {
      await submitFeedback({ message, rating });
      Alert.alert("Thank you", "Feedback submitted");
      setMessage("");
      router.back();
    } catch (e: any) {
      Alert.alert("Failed", "Could not submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[commonStyles.container, { padding: 16 }]}>
      <CustomText variant="h6" fontFamily="SemiBold">
        Feedback
      </CustomText>
      <CustomText variant="h8" style={commonStyles.lightText}>
        Tell us what to improve
      </CustomText>

      <View style={{ marginTop: 16, gap: 10 }}>
        <TextInput
          placeholder="Write your feedback..."
          value={message}
          onChangeText={setMessage}
          multiline
          style={{
            minHeight: 140,
            borderWidth: 1,
            borderColor: "#e5e5e5",
            borderRadius: 12,
            padding: 12,
            backgroundColor: "#fff",
            textAlignVertical: "top",
          }}
        />

        <View style={{ flexDirection: "row", gap: 8 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <View key={n} style={{ flex: 1 }}>
              <CustomButton
                title={`${n}`}
                onPress={() => setRating(n)}
                disabled={loading}
                loading={false}
              />
            </View>
          ))}
        </View>
        <CustomText style={commonStyles.lightText}>
          Selected rating: {rating ?? "-"}
        </CustomText>

        <CustomButton title="Submit" onPress={send} disabled={loading} loading={loading} />
      </View>
    </ScrollView>
  );
};

export default CustomerFeedback;


import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import CustomText from "@/components/shared/CustomText";
import CustomButton from "@/components/shared/CustomButton";
import { appAxios } from "@/service/apiInterceptor";
import { commonStyles } from "@/styles/commonStyles";

type Feedback = {
  _id: string;
  message: string;
  rating?: number | null;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdBy?: { phone: string; role: string };
  createdAt: string;
};

const AdminFeedback = () => {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await appAxios.get("/admin/feedback");
      setItems(res.data.feedback || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const setStatus = async (item: Feedback, status: Feedback["status"]) => {
    setLoading(true);
    try {
      await appAxios.patch(`/admin/feedback/${item._id}`, { status });
      await load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[commonStyles.container, { padding: 16 }]}>
      <CustomText variant="h6" fontFamily="SemiBold">
        Review Feedback
      </CustomText>
      <CustomText variant="h8" style={commonStyles.lightText}>
        Triage and resolve user reports
      </CustomText>

      <View style={{ marginTop: 16 }}>
        <CustomButton title="Refresh" onPress={load} disabled={loading} loading={loading} />
      </View>

      <View style={{ marginTop: 16, gap: 10 }}>
        {items.map((f) => (
          <View
            key={f._id}
            style={{
              padding: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#e5e5e5",
              backgroundColor: "#fff",
            }}
          >
            <CustomText fontFamily="SemiBold">
              {f.status} {f.rating ? `• ${f.rating}/5` : ""}
            </CustomText>
            <CustomText style={commonStyles.lightText}>
              By: {f.createdBy?.phone ?? "-"} ({f.createdBy?.role ?? "-"})
            </CustomText>
            <CustomText style={{ marginTop: 8 }}>{f.message}</CustomText>

            <View style={{ marginTop: 10, gap: 8 }}>
              <CustomButton
                title="Mark In-Progress"
                onPress={() => setStatus(f, "IN_PROGRESS")}
                disabled={loading}
                loading={false}
              />
              <CustomButton
                title="Resolve"
                onPress={() => setStatus(f, "RESOLVED")}
                disabled={loading}
                loading={false}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default AdminFeedback;


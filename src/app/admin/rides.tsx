import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import CustomText from "@/components/shared/CustomText";
import CustomButton from "@/components/shared/CustomButton";
import { appAxios } from "@/service/apiInterceptor";
import { commonStyles } from "@/styles/commonStyles";

const AdminRides = () => {
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await appAxios.get("/admin/rides");
      setRides(res.data.rides || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <ScrollView contentContainerStyle={[commonStyles.container, { padding: 16 }]}>
      <CustomText variant="h6" fontFamily="SemiBold">
        Requests
      </CustomText>
      <CustomText variant="h8" style={commonStyles.lightText}>
        Showing latest 200
      </CustomText>

      <View style={{ marginTop: 16 }}>
        <CustomButton title="Refresh" onPress={load} disabled={loading} loading={loading} />
      </View>

      <View style={{ marginTop: 16, gap: 10 }}>
        {rides.map((r) => (
          <View
            key={r._id}
            style={{
              padding: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#e5e5e5",
              backgroundColor: "#fff",
            }}
          >
            <CustomText fontFamily="SemiBold">
              {r.vehicle} • {r.status}
            </CustomText>
            <CustomText style={commonStyles.lightText}>
              Customer: {r.customer?.phone ?? "-"} • Responder: {r.rider?.phone ?? "-"}
            </CustomText>
            <CustomText style={commonStyles.lightText}>
              Pickup: {r.pickup?.address ?? "-"}
            </CustomText>
            <CustomText style={commonStyles.lightText}>
              Drop: {r.drop?.address ?? "-"}
            </CustomText>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default AdminRides;


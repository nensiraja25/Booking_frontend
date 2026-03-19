import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import CustomText from "@/components/shared/CustomText";
import CustomButton from "@/components/shared/CustomButton";
import { appAxios } from "@/service/apiInterceptor";
import { commonStyles } from "@/styles/commonStyles";

type Bucket = { _id: string; count: number };

const Bar = ({ label, value, max }: { label: string; value: number; max: number }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <View style={{ marginTop: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <CustomText fontFamily="Medium">{label}</CustomText>
        <CustomText style={commonStyles.lightText}>{value}</CustomText>
      </View>
      <View
        style={{
          height: 10,
          borderRadius: 999,
          backgroundColor: "#eee",
          overflow: "hidden",
          marginTop: 6,
        }}
      >
        <View
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: "#111",
          }}
        />
      </View>
    </View>
  );
};

const AdminReports = () => {
  const [byService, setByService] = useState<Bucket[]>([]);
  const [byStatus, setByStatus] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await appAxios.get("/admin/reports");
      setByService(res.data.byService || []);
      setByStatus(res.data.byStatus || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const maxService = useMemo(() => Math.max(0, ...byService.map((b) => b.count)), [byService]);
  const maxStatus = useMemo(() => Math.max(0, ...byStatus.map((b) => b.count)), [byStatus]);

  return (
    <ScrollView contentContainerStyle={[commonStyles.container, { padding: 16 }]}>
      <CustomText variant="h6" fontFamily="SemiBold">
        Reports & Diagrams
      </CustomText>
      <CustomText variant="h8" style={commonStyles.lightText}>
        Quick charts (counts)
      </CustomText>

      <View style={{ marginTop: 16 }}>
        <CustomButton title="Refresh" onPress={load} disabled={loading} loading={loading} />
      </View>

      <View style={{ marginTop: 20 }}>
        <CustomText fontFamily="SemiBold">Requests by Service</CustomText>
        {byService.map((b) => (
          <Bar key={b._id} label={b._id} value={b.count} max={maxService} />
        ))}
      </View>

      <View style={{ marginTop: 28 }}>
        <CustomText fontFamily="SemiBold">Requests by Status</CustomText>
        {byStatus.map((b) => (
          <Bar key={b._id} label={b._id} value={b.count} max={maxStatus} />
        ))}
      </View>
    </ScrollView>
  );
};

export default AdminReports;


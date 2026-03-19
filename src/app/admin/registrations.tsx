import React, { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import CustomText from "@/components/shared/CustomText";
import CustomButton from "@/components/shared/CustomButton";
import { appAxios } from "@/service/apiInterceptor";
import { commonStyles } from "@/styles/commonStyles";

type RegistrationUser = {
  _id: string;
  phone: string;
  role: "rider";
  registrationStatus: "PENDING" | "APPROVED" | "REJECTED";
  isActive: boolean;
  createdAt: string;
};

const AdminRegistrations = () => {
  const [items, setItems] = useState<RegistrationUser[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await appAxios.get("/admin/registrations?status=PENDING");
      setItems(res.data.users || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const update = async (user: RegistrationUser, registrationStatus: RegistrationUser["registrationStatus"]) => {
    setLoading(true);
    try {
      await appAxios.patch(`/admin/registrations/${user._id}`, { registrationStatus });
      await load();
    } finally {
      setLoading(false);
    }
  };

  const deactivate = async (user: RegistrationUser) => {
    Alert.alert("Deactivate", `Deactivate ${user.phone}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Deactivate",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await appAxios.patch(`/admin/registrations/${user._id}`, { isActive: false });
            await load();
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={[commonStyles.container, { padding: 16 }]}>
      <CustomText variant="h6" fontFamily="SemiBold">
        Manage Registrations
      </CustomText>
      <CustomText variant="h8" style={commonStyles.lightText}>
        Approve / Reject responder registrations
      </CustomText>

      <View style={{ marginTop: 16 }}>
        <CustomButton title="Refresh" onPress={load} disabled={loading} loading={loading} />
      </View>

      <View style={{ marginTop: 16, gap: 10 }}>
        {items.map((u) => (
          <View
            key={u._id}
            style={{
              padding: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#e5e5e5",
              backgroundColor: "#fff",
            }}
          >
            <CustomText fontFamily="SemiBold">{u.phone}</CustomText>
            <CustomText style={commonStyles.lightText}>
              Status: {u.registrationStatus} • Active: {u.isActive ? "YES" : "NO"}
            </CustomText>

            <View style={{ marginTop: 10, gap: 8 }}>
              <CustomButton
                title="Approve"
                onPress={() => update(u, "APPROVED")}
                disabled={loading}
                loading={false}
              />
              <CustomButton
                title="Reject"
                onPress={() => update(u, "REJECTED")}
                disabled={loading}
                loading={false}
              />
              <CustomButton
                title="Deactivate"
                onPress={() => deactivate(u)}
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

export default AdminRegistrations;


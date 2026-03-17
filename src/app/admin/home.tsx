import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import CustomText from "@/components/shared/CustomText";
import CustomButton from "@/components/shared/CustomButton";
import { commonStyles } from "@/styles/commonStyles";
import { appAxios } from "@/service/apiInterceptor";
import { logout } from "@/service/authService";
import { useWS } from "@/service/WSProvider";
import { router } from "expo-router";

const AdminHome = () => {
  const { disconnect } = useWS();
  const [stats, setStats] = useState<any>(null);

  const load = async () => {
    const res = await appAxios.get("/admin/stats");
    setStats(res.data);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <ScrollView contentContainerStyle={[commonStyles.container, { padding: 16 }]}>
      <CustomText variant="h6" fontFamily="SemiBold">
        Admin Dashboard
      </CustomText>
      <CustomText variant="h8" style={commonStyles.lightText}>
        Quick stats (localhost demo)
      </CustomText>

      <View style={{ marginTop: 16, gap: 10 }}>
        <CustomText fontFamily="Medium">
          Users: {stats?.users ?? "-"}
        </CustomText>
        <CustomText fontFamily="Medium">
          Requests - searching: {stats?.rides?.searching ?? "-"}
        </CustomText>
        <CustomText fontFamily="Medium">
          Requests - active: {stats?.rides?.active ?? "-"}
        </CustomText>
        <CustomText fontFamily="Medium">
          Requests - completed: {stats?.rides?.completed ?? "-"}
        </CustomText>
      </View>

      <View style={{ marginTop: 24, gap: 12 }}>
        <CustomButton title="Refresh" onPress={load} disabled={false} loading={false} />
        <CustomButton title="View Users" onPress={() => router.push("/admin/users")} disabled={false} loading={false} />
        <CustomButton title="View Requests" onPress={() => router.push("/admin/rides")} disabled={false} loading={false} />
        <CustomButton
          title="Logout"
          onPress={() => logout(disconnect)}
          disabled={false}
          loading={false}
        />
      </View>
    </ScrollView>
  );
};

export default AdminHome;


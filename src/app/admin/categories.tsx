import React, { useEffect, useState } from "react";
import { Alert, ScrollView, TextInput, View } from "react-native";
import CustomText from "@/components/shared/CustomText";
import CustomButton from "@/components/shared/CustomButton";
import { appAxios } from "@/service/apiInterceptor";
import { commonStyles } from "@/styles/commonStyles";

type Category = {
  _id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
};

const AdminCategories = () => {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await appAxios.get("/admin/categories");
      setItems(res.data.categories || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const create = async () => {
    if (!code || !name) {
      Alert.alert("Missing", "Code and name are required");
      return;
    }
    setLoading(true);
    try {
      await appAxios.post("/admin/categories", {
        code,
        name,
        description,
        isActive: true,
      });
      setCode("");
      setName("");
      setDescription("");
      await load();
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (item: Category) => {
    setLoading(true);
    try {
      await appAxios.patch(`/admin/categories/${item._id}`, {
        isActive: !item.isActive,
      });
      await load();
    } finally {
      setLoading(false);
    }
  };

  const remove = async (item: Category) => {
    Alert.alert("Delete", `Delete ${item.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await appAxios.delete(`/admin/categories/${item._id}`);
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
        Manage Categories
      </CustomText>
      <CustomText variant="h8" style={commonStyles.lightText}>
        Create/update emergency service categories
      </CustomText>

      <View style={{ marginTop: 16, gap: 10 }}>
        <TextInput
          placeholder="Code (e.g. AMBULANCE)"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          style={{
            borderWidth: 1,
            borderColor: "#e5e5e5",
            borderRadius: 10,
            padding: 12,
            backgroundColor: "#fff",
          }}
        />
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={{
            borderWidth: 1,
            borderColor: "#e5e5e5",
            borderRadius: 10,
            padding: 12,
            backgroundColor: "#fff",
          }}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={{
            borderWidth: 1,
            borderColor: "#e5e5e5",
            borderRadius: 10,
            padding: 12,
            backgroundColor: "#fff",
          }}
        />
        <CustomButton title="Create" onPress={create} disabled={loading} loading={loading} />
        <CustomButton title="Refresh" onPress={load} disabled={loading} loading={loading} />
      </View>

      <View style={{ marginTop: 16, gap: 10 }}>
        {items.map((c) => (
          <View
            key={c._id}
            style={{
              padding: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#e5e5e5",
              backgroundColor: "#fff",
            }}
          >
            <CustomText fontFamily="SemiBold">
              {c.code} • {c.isActive ? "ACTIVE" : "INACTIVE"}
            </CustomText>
            <CustomText style={commonStyles.lightText}>{c.name}</CustomText>
            {!!c.description && (
              <CustomText style={commonStyles.lightText}>{c.description}</CustomText>
            )}

            <View style={{ marginTop: 10, gap: 8 }}>
              <CustomButton
                title={c.isActive ? "Disable" : "Enable"}
                onPress={() => toggleActive(c)}
                disabled={loading}
                loading={false}
              />
              <CustomButton
                title="Delete"
                onPress={() => remove(c)}
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

export default AdminCategories;


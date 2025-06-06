// components/DropdownSelect.js
import React, { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";

const DropdownSelect = ({ label, data, selectedValue, onSelect, enabled = true }) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginTop: 16 }}>
      <Text>{label}</Text>
      <Button
        mode="outlined"
        onPress={() => enabled && setVisible(true)}
        disabled={!enabled}
        style={{ marginTop: 4 }}
      >
        {data.find(item => item.id === selectedValue)?.name || `-- ${label} --`}
      </Button>

      <Modal visible={visible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#000000aa" }}>
          <View style={{ margin: 20, backgroundColor: "#fff", borderRadius: 8, padding: 16 }}>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item.id);
                    setVisible(false);
                  }}
                >
                  <Text style={{ padding: 12 }}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <Button onPress={() => setVisible(false)} style={{ marginTop: 10 }}>
              Đóng
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DropdownSelect;

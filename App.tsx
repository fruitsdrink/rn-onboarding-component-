import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Onboarding } from "./onboarding";
import { useState } from "react";

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <View style={styles.container}>
      <Onboarding
        total={4}
        selectedIndex={selectedIndex}
        onIndexChange={(index) => setSelectedIndex(index)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center"
  }
});

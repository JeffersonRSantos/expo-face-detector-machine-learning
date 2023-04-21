import { SafeAreaView } from "react-native";
import Home from "./src/screens/Home";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        animated={true}
        backgroundColor="#61dafb"
        // showHideTransition={statusBarTransition}
        hidden={true}

      />
      <Home />
    </SafeAreaView>
  );
}

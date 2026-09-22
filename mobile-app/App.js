import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";

//// Punto de entrada principal de la aplicacion movil.
export default function App() {
  return (
    //// SafeAreaProvider evita que la interfaz choque con la barra superior o inferior del celular.
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

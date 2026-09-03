import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import DashboardScreen from "../screens/DashboardScreen";
import IncidentReportScreen from "../screens/IncidentReportScreen";
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";
import StockScreen from "../screens/StockScreen";
import TasksScreen from "../screens/TasksScreen";
import { colors } from "../theme/colors";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [user, setUser] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "800" },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {!user ? (
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => <LoginScreen {...props} onLogin={setUser} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Inicio" options={{ title: "Mineria Verde" }}>
              {(props) => <DashboardScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="Tareas" component={TasksScreen} />
            <Stack.Screen name="Stock" component={StockScreen} />
            <Stack.Screen
              name="ReporteIncidente"
              component={IncidentReportScreen}
              options={{ title: "Reportar incidente" }}
            />
            <Stack.Screen name="Perfil" options={{ title: "Mi perfil" }}>
              {(props) => <ProfileScreen {...props} user={user} onLogout={() => setUser(null)} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

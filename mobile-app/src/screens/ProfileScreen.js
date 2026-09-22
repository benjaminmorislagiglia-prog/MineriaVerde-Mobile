import { StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import Card from "../components/Card";
import Screen from "../components/Screen";
import { colors } from "../theme/colors";

//// Pantalla de perfil con datos basicos del usuario logueado.
export default function ProfileScreen({ user, onLogout }) {
  return (
    <Screen style={styles.screen}>
      <Card style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name.slice(0, 1)}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.meta}>{user.role}</Text>
        <Text style={styles.meta}>{user.shift}</Text>
        <AppButton title="Cerrar sesion" onPress={onLogout} variant="secondary" />
      </Card>
    </Screen>
  );
}

//// Estilos del perfil.
const styles = StyleSheet.create({
  screen: {
    padding: 20,
  },
  card: {
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 40,
    height: 80,
    justifyContent: "center",
    width: 80,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },
  name: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 8,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 15,
  },
});

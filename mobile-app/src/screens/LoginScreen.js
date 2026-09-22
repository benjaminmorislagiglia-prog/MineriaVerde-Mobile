import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import AppButton from "../components/AppButton";
import Screen from "../components/Screen";
import { mockUser } from "../data/mockData";
import { colors } from "../theme/colors";

//// Pantalla de ingreso con credenciales temporales para el MVP.
export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("benjamin");
  const [password, setPassword] = useState("1234");

  //// Valida el usuario de prueba y habilita el acceso a la app.
  function handleLogin() {
    const normalizedUser = username.trim().toLowerCase();

    if (normalizedUser === "benjamin" && password === "1234") {
      onLogin({ ...mockUser, username: normalizedUser });
      return;
    }

    Alert.alert("Datos incorrectos", "Usa usuario benjamin y contrasena 1234.");
  }

  return (
    <Screen>
      //// KeyboardAvoidingView ayuda a que el teclado no tape los campos.
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.brandBlock}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>MV</Text>
          </View>
          <Text style={styles.title}>Mineria Verde</Text>
          <Text style={styles.subtitle}>Gestion movil para tareas, stock e incidentes.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setUsername}
            placeholder="benjamin"
            style={styles.input}
            value={username}
          />

          <Text style={styles.label}>Contrasena</Text>
          <TextInput
            onChangeText={setPassword}
            placeholder="1234"
            secureTextEntry
            style={styles.input}
            value={password}
          />

          <AppButton title="Ingresar" onPress={handleLogin} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

//// Estilos de la pantalla de login.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  brandBlock: {
    marginBottom: 34,
  },
  logo: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 18,
    height: 64,
    justifyContent: "center",
    marginBottom: 18,
    width: 64,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
  },
  form: {
    gap: 10,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: 14,
  },
});

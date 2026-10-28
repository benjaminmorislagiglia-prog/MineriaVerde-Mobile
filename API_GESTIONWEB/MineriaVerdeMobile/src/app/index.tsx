
import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { obtenerEmpleados } from "../services/api";

export default function HomeScreen() {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function cargarEmpleados() {
    setCargando(true);
    setError("");

    try {
      const datos = await obtenerEmpleados();

      if (!Array.isArray(datos)) {
        throw new Error("La API no devolvió una lista");
      }

      setEmpleados(datos);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error desconocido"
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Minería Verde
      </Text>

      <Text style={styles.subtitle}>
        Gestión de empleados
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={cargarEmpleados}
        disabled={cargando}
      >
        <Text style={styles.buttonText}>
          Consultar empleados
        </Text>
      </TouchableOpacity>

      {cargando && <ActivityIndicator size="large" />}

      {!!error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <FlatList
        data={empleados}
        keyExtractor={(item, index) =>
          String(item.Id_Empleado ?? item.id ?? index)
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              {item.Nombre} {item.Apellido}
            </Text>
            <Text>Legajo: {item.Legajo}</Text>
            <Text>Puesto: {item.Puesto}</Text>
          </View>
        )}
        ListEmptyComponent={
  !cargando && !error ? (
    <Text style={styles.empty}>
      Presioná el botón para consultar empleados.
    </Text>
  ) : (
    <></>
  )
}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#f4f6f8",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#166534",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#166534",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 15,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#64748b",
  },
});

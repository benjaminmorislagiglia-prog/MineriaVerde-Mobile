import { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import Card from "../components/Card";
import Screen from "../components/Screen";
import StatusPill from "../components/StatusPill";
import { fallbackStock } from "../data/mockData";
import { api } from "../services/api";
import { colors } from "../theme/colors";

export default function StockScreen() {
  const [items, setItems] = useState(fallbackStock);
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState("Datos de ejemplo hasta conectar con la API desde el celular.");

  async function loadStock() {
    setLoading(true);
    try {
      const data = await api.getStock();
      setItems(Array.isArray(data) ? data : fallbackStock);
      setApiMessage(`Conectado a ${api.baseUrl}`);
    } catch (error) {
      setApiMessage("No se pudo consultar la API. Se muestran datos de ejemplo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStock();
  }, []);

  return (
    <Screen>
      <FlatList
        ListHeaderComponent={<Text style={styles.helper}>{apiMessage}</Text>}
        contentContainerStyle={styles.list}
        data={items}
        keyExtractor={(item, index) => String(item.Id ?? item.IdStock ?? index)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadStock} />}
        renderItem={({ item }) => {
          const cantidad = Number(item.Cantidad ?? item.CantidadActual ?? item.StockActual ?? 0);
          const minimo = Number(item.StockMinimo ?? item.Stock_Minimo ?? 0);
          const lowStock = minimo > 0 && cantidad < minimo;

          return (
            <Card style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.title}>{item.Repuesto ?? item.Nombre ?? "Repuesto"}</Text>
                {lowStock ? <StatusPill label="Alta" /> : null}
              </View>
              <Text style={styles.detail}>Cantidad disponible: {cantidad}</Text>
              <Text style={styles.detail}>Stock minimo: {minimo || "Sin definir"}</Text>
            </Card>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
    padding: 20,
  },
  helper: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  card: {
    gap: 8,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: 17,
    fontWeight: "800",
  },
  detail: {
    color: colors.textMuted,
  },
});

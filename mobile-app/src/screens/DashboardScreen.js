import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Card from "../components/Card";
import Screen from "../components/Screen";
import { tasks } from "../data/mockData";
import { colors } from "../theme/colors";

const actions = [
  { title: "Tareas", detail: "Ordenes asignadas", route: "Tareas" },
  { title: "Stock", detail: "Materiales y repuestos", route: "Stock" },
  { title: "Incidente", detail: "Descripcion y foto", route: "ReporteIncidente" },
  { title: "Perfil", detail: "Datos del usuario", route: "Perfil" },
];

export default function DashboardScreen({ navigation, user }) {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.kicker}>Hola, {user.name}</Text>
          <Text style={styles.title}>Panel de trabajo</Text>
          <Text style={styles.subtitle}>Acceso rapido para el control diario de maquinaria y stock.</Text>
        </View>

        <View style={styles.metrics}>
          <Card style={styles.metric}>
            <Text style={styles.metricValue}>{tasks.length}</Text>
            <Text style={styles.metricLabel}>Tareas activas</Text>
          </Card>
          <Card style={styles.metric}>
            <Text style={styles.metricValue}>1</Text>
            <Text style={styles.metricLabel}>Stock bajo</Text>
          </Card>
        </View>

        <View style={styles.grid}>
          {actions.map((action) => (
            <Pressable key={action.route} onPress={() => navigation.navigate(action.route)} style={styles.action}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDetail}>{action.detail}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
    padding: 20,
  },
  kicker: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 6,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  metrics: {
    flexDirection: "row",
    gap: 12,
  },
  metric: {
    flex: 1,
  },
  metricValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  metricLabel: {
    color: colors.textMuted,
    marginTop: 4,
  },
  grid: {
    gap: 12,
  },
  action: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  actionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  actionDetail: {
    color: colors.textMuted,
    marginTop: 4,
  },
});

import { FlatList, StyleSheet, Text, View } from "react-native";
import Card from "../components/Card";
import Screen from "../components/Screen";
import StatusPill from "../components/StatusPill";
import { tasks } from "../data/mockData";
import { colors } from "../theme/colors";

export default function TasksScreen() {
  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.list}
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.id}>{item.id}</Text>
              <StatusPill label={item.priority} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.machine}>{item.machine}</Text>
            <StatusPill label={item.status} />
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
    padding: 20,
  },
  card: {
    gap: 10,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  id: {
    color: colors.primary,
    fontWeight: "800",
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  machine: {
    color: colors.textMuted,
  },
});

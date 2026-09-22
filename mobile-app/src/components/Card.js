import { StyleSheet, View } from "react-native";
import { colors } from "../theme/colors";

//// Tarjeta reutilizable para agrupar informacion en listados y pantallas.
export default function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

//// Estilos de la tarjeta.
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
});

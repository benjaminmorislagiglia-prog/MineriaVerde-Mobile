import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

//// Colores para mostrar prioridad o estado de forma visual.
const toneStyles = {
  Alta: { backgroundColor: "#FEE4E2", color: colors.danger },
  Media: { backgroundColor: "#FEF0C7", color: colors.warning },
  Baja: { backgroundColor: "#DFF6EA", color: colors.success },
  Pendiente: { backgroundColor: "#FEF0C7", color: colors.warning },
  "En proceso": { backgroundColor: "#E1EFFD", color: "#175CD3" },
  Programada: { backgroundColor: "#ECE9FE", color: "#5925DC" },
};

//// Etiqueta pequena para estados como Alta, Pendiente o En proceso.
export default function StatusPill({ label }) {
  const tone = toneStyles[label] ?? { backgroundColor: colors.surfaceMuted, color: colors.textMuted };

  return (
    <View style={[styles.pill, { backgroundColor: tone.backgroundColor }]}>
      <Text style={[styles.text, { color: tone.color }]}>{label}</Text>
    </View>
  );
}

//// Estilos del indicador de estado.
const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
});

import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import AppButton from "../components/AppButton";
import Card from "../components/Card";
import Screen from "../components/Screen";
import { colors } from "../theme/colors";

//// Pantalla para registrar incidentes con descripcion y foto.
export default function IncidentReportScreen() {
  const [description, setDescription] = useState("");
  const [machine, setMachine] = useState("");
  const [photo, setPhoto] = useState(null);

  //// Abre la galeria del celular para adjuntar evidencia del incidente.
  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permiso necesario", "Necesitamos acceso a tus fotos para adjuntar evidencia.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  }

  //// Valida los datos minimos antes de preparar el reporte.
  function submitReport() {
    if (!machine.trim() || !description.trim()) {
      Alert.alert("Faltan datos", "Completa maquinaria y descripcion antes de enviar.");
      return;
    }

    Alert.alert("Reporte preparado", "El formulario ya queda listo para conectarlo al endpoint de incidentes.");
    setMachine("");
    setDescription("");
    setPhoto(null);
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.form}>
          <Text style={styles.label}>Maquinaria</Text>
          <TextInput
            onChangeText={setMachine}
            placeholder="Ej: Excavadora Volvo"
            style={styles.input}
            value={machine}
          />

          <Text style={styles.label}>Descripcion</Text>
          <TextInput
            multiline
            onChangeText={setDescription}
            placeholder="Describe que paso, donde y si requiere atencion urgente."
            style={[styles.input, styles.textArea]}
            textAlignVertical="top"
            value={description}
          />

          {photo ? <Image source={{ uri: photo.uri }} style={styles.photo} /> : null}

          <View style={styles.actions}>
            <AppButton title="Adjuntar foto" onPress={pickPhoto} variant="secondary" />
            <AppButton title="Guardar reporte" onPress={submitReport} />
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}

//// Estilos del formulario de incidente.
const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  form: {
    gap: 12,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  textArea: {
    minHeight: 130,
    paddingTop: 14,
  },
  photo: {
    borderRadius: 14,
    height: 180,
    width: "100%",
  },
  actions: {
    gap: 10,
    marginTop: 4,
  },
});

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddReflectionScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const saveReflection = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Błąd', 'Wypełnij tytuł i treść refleksji.');
      return;
    }

    const newReflection = { title, content };
    try {
      const existing = await AsyncStorage.getItem('reflections');
      const reflections = existing ? JSON.parse(existing) : [];
      reflections.push(newReflection);  // Dodaj nową refleksję do istniejących
      await AsyncStorage.setItem('reflections', JSON.stringify(reflections));  // Zapisz zaktualizowaną listę refleksji
      navigation.goBack();  // Powróć na poprzedni ekran (ReflectionScreen)
    } catch (e) {
      Alert.alert('Błąd', 'Nie udało się zapisać refleksji.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Zapewnia różne zachowanie dla iOS i Androida
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <TextInput
            placeholder="Tytuł"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Twoja refleksja..."
            value={content}
            onChangeText={setContent}
            multiline
            style={[styles.input, styles.textArea]}
          />
          <Button title="Zapisz" onPress={saveReflection} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  inner: {
    padding: 20,
    flex: 1,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReflectionScreen() {
  const [reflections, setReflections] = useState([]);

  useEffect(() => {
    const loadReflections = async () => {
      try {
        const storedReflections = await AsyncStorage.getItem('reflections');
        if (storedReflections) {
          const parsed = JSON.parse(storedReflections);
          // Najnowsze na górze (zakładamy, że nowe są dodawane na koniec)
          const sorted = [...parsed].reverse();
          setReflections(sorted);
        }
      } catch (e) {
        console.error('Błąd wczytywania refleksji:', e);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadReflections);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Refleksje</Text>
      <FlatList
        data={reflections}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.content}>{item.content}</Text>
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    marginTop: 8,
    fontSize: 16,
  },
});

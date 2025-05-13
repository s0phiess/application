import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [reflections, setReflections] = useState([]);

  useEffect(() => {
    const loadReflections = async () => {
      try {
        const stored = await AsyncStorage.getItem('reflections');
        if (stored) {
          const parsed = JSON.parse(stored);
          setReflections(parsed.reverse()); // najnowsze na górze
        }
      } catch (e) {
        console.error('Błąd wczytywania:', e);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadReflections);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('ReflectionDetail', { reflection: item })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text numberOfLines={2} style={styles.content}>{item.content}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Refleksje</Text>
      <FlatList
        data={reflections}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Brak refleksji</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddReflection')}
      >
        <Text style={styles.addButtonText}>+ Dodaj refleksję</Text>
      </TouchableOpacity>
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
    marginTop: 6,
    fontSize: 15,
    color: '#333',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#aaa',
  },
});

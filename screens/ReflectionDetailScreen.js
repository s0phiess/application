import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ReflectionDetailScreen({ route }) {
  const { reflection } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{reflection.title}</Text>
      <Text style={styles.content}>{reflection.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 18,
    lineHeight: 24,
  },
});

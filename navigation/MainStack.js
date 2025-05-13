import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReflectionScreen from '../screens/HomeScreen';
import AddReflectionScreen from '../screens/AddReflectionScreen';
import ReflectionDetailScreen from '../screens/ReflectionDetailScreen';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Reflection" component={ReflectionScreen} options={{ title: 'Refleksje' }} />
      <Stack.Screen name="AddReflection" component={AddReflectionScreen} options={{ title: 'Dodaj refleksję' }} />
      <Stack.Screen name="ReflectionDetail" component={ReflectionDetailScreen} options={{ title: 'Szczegóły refleksji' }} />
    </Stack.Navigator>
  );
}

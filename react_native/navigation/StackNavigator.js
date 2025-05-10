import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Rental from '../screens/Rental';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="index" component={Rental} />
    </Stack.Navigator>
  );
}

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@dailyapps/theme';
import { getDefaultScreenOptions } from '@dailyapps/navigation';
import { HomeScreen } from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const theme = useTheme();
  const screenOptions = getDefaultScreenOptions(theme);

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        ...screenOptions,
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

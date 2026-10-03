import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@dailyapps/theme';
import { getDefaultScreenOptions } from '@dailyapps/navigation';
import { HomeScreen } from '../screens/HomeScreen';
import { ToolWorkflowScreen } from '../screens/ToolWorkflowScreen';

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
      <Stack.Screen name="ImagesToPdf" component={ToolWorkflowScreen} />
      <Stack.Screen name="MergePdf" component={ToolWorkflowScreen} />
      <Stack.Screen name="SplitPdf" component={ToolWorkflowScreen} />
      <Stack.Screen name="CompressPdf" component={ToolWorkflowScreen} />
      <Stack.Screen name="DocumentScanner" component={ToolWorkflowScreen} />
      <Stack.Screen name="PdfViewer" component={ToolWorkflowScreen} />
      <Stack.Screen name="PdfToImage" component={ToolWorkflowScreen} />
      <Stack.Screen name="RotatePdf" component={ToolWorkflowScreen} />
      <Stack.Screen name="DeletePages" component={ToolWorkflowScreen} />
      <Stack.Screen name="ReorderPages" component={ToolWorkflowScreen} />
    </Stack.Navigator>
  );
};

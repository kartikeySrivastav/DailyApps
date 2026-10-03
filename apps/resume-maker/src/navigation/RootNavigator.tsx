import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@dailyapps/theme';
import { getDefaultScreenOptions } from '@dailyapps/navigation';
import { SplashScreen } from '../screens/SplashScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { HomeScreen } from '../screens/HomeScreen';
import { DocumentTypeSelectorScreen } from '../screens/DocumentTypeSelectorScreen';
import { TemplateSelectorScreen } from '../screens/TemplateSelectorScreen';
import { ResumeBuilderScreen } from '../screens/ResumeBuilderScreen';
import { MarriageBiodataBuilderScreen } from '../screens/MarriageBiodataBuilderScreen';
import { CoverLetterBuilderScreen } from '../screens/CoverLetterBuilderScreen';
import { LivePreviewScreen } from '../screens/LivePreviewScreen';
import { PdfPreviewScreen } from '../screens/PdfPreviewScreen';
import { DocumentPreviewScreen } from '../screens/DocumentPreviewScreen';
import { TemplateGalleryScreen } from '../screens/TemplateGalleryScreen';
import { AiAssistantScreen } from '../screens/AiAssistantScreen';
import { MasterProfileScreen } from '../screens/MasterProfileScreen';
import { PremiumTemplatesScreen } from '../screens/PremiumTemplatesScreen';
import { ToolsScreen } from '../screens/ToolsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ResumeAdvancedScreen } from '../screens/ResumeAdvancedScreen';
import { DocumentActionScreen } from '../screens/DocumentActionScreen';
import { ResumeSettingsFlowScreen } from '../screens/ResumeSettingsFlowScreen';
import { FinalSupportFlowScreen } from '../screens/FinalSupportFlowScreen';
import { ExportPdfScreen } from '../screens/ExportPdfScreen';
import { ShareDocumentScreen } from '../screens/ShareDocumentScreen';
import { BiodataTypeSelectorScreen } from '../screens/BiodataTypeSelectorScreen';
import { BiodataPersonalDetailsScreen } from '../screens/BiodataPersonalDetailsScreen';
import { BiodataFamilyDetailsScreen } from '../screens/BiodataFamilyDetailsScreen';
import { BiodataEducationProfessionScreen } from '../screens/BiodataEducationProfessionScreen';
import { BiodataLifestyleScreen } from '../screens/BiodataLifestyleScreen';
import { PdfToolDetailScreen } from '../screens/PdfToolDetailScreen';
import { PdfProcessingScreen } from '../screens/PdfProcessingScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const theme = useTheme();
  const screenOptions = getDefaultScreenOptions(theme);

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        ...screenOptions,
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="DocumentTypeSelector" component={DocumentTypeSelectorScreen} />
      <Stack.Screen name="TemplateSelector" component={TemplateSelectorScreen} />
      <Stack.Screen name="ResumeBuilder" component={ResumeBuilderScreen} />
      <Stack.Screen name="MarriageBiodataBuilder" component={MarriageBiodataBuilderScreen} />
      <Stack.Screen name="CoverLetterBuilder" component={CoverLetterBuilderScreen} />
      <Stack.Screen name="LivePreview" component={LivePreviewScreen} />
      <Stack.Screen name="PdfPreview" component={PdfPreviewScreen} />
      <Stack.Screen name="DocumentPreview" component={DocumentPreviewScreen} />
      <Stack.Screen name="TemplateGallery" component={TemplateGalleryScreen} />
      <Stack.Screen name="AiAssistant" component={AiAssistantScreen} />
      <Stack.Screen name="MasterProfile" component={MasterProfileScreen} />
      <Stack.Screen name="PremiumTemplates" component={PremiumTemplatesScreen} />
      <Stack.Screen name="Tools" component={ToolsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ResumeAdvanced" component={ResumeAdvancedScreen} />
      <Stack.Screen name="DocumentAction" component={DocumentActionScreen} />
      <Stack.Screen name="ResumeSettingsFlow" component={ResumeSettingsFlowScreen} />
      <Stack.Screen name="FinalSupportFlow" component={FinalSupportFlowScreen} />
      <Stack.Screen name="ExportPdf" component={ExportPdfScreen} />
      <Stack.Screen name="ShareDocument" component={ShareDocumentScreen} />
      <Stack.Screen name="BiodataTypeSelector" component={BiodataTypeSelectorScreen} />
      <Stack.Screen name="BiodataPersonalDetails" component={BiodataPersonalDetailsScreen} />
      <Stack.Screen name="BiodataFamilyDetails" component={BiodataFamilyDetailsScreen} />
      <Stack.Screen name="BiodataEducationProfession" component={BiodataEducationProfessionScreen} />
      <Stack.Screen name="BiodataLifestyle" component={BiodataLifestyleScreen} />
      <Stack.Screen name="PdfToolDetail" component={PdfToolDetailScreen} />
      <Stack.Screen name="PdfProcessing" component={PdfProcessingScreen} />
    </Stack.Navigator>
  );
};

import { Stack } from 'expo-router';
import { AppProvider } from '../contexts/AppContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="category/[category]"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: '#f5f5f5' },
            headerTintColor: '#333',
            headerTitleStyle: { fontWeight: 'bold' }
          }}
        />
      </Stack>
    </AppProvider>
  );
}

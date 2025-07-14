import { Text, View } from 'react-native';

export default function AuthScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 24, color: '#333' }}>Écran de Connexion</Text>
      <Text style={{ fontSize: 16, color: '#666', marginTop: 10 }}>Supabase désactivé</Text>
    </View>
  );
}
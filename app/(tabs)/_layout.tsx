import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { supabase } from '../../lib/supabase';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      
      // Vérifier si l'utilisateur est admin
      const { data: userData } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      setIsAdmin(userData?.is_admin || false);
    }
    setLoading(false);
  };

  if (loading) {
    return null; // Ou un loading spinner
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="home" size={28} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="products"
        options={{
          title: 'Produits',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="watch" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoris',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="favorite" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: 'Panier',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="shopping-cart" size={28} color={color} />
          ),
        }}
      />

      {/* Onglet Admin - visible seulement pour les admins */}
      {isAdmin && (
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Admin',
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons name="admin-panel-settings" size={28} color={color} />
            ),
          }}
        />
      )}

      {/* Onglet Auth/Profile - change selon l'état de connexion */}
      <Tabs.Screen
        name={user ? "profile" : "auth"}
        options={{
          title: user ? 'Profil' : 'Connexion',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons 
              name={user ? "account-circle" : "login"} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
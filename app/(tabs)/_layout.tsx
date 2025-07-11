// On importe Tabs pour gérer les onglets en bas de l'application
import { Tabs } from 'expo-router';
// On importe React et des outils pour gérer l'état et les effets
import React, { useEffect, useState } from 'react';
// On importe les icônes MaterialIcons pour afficher des images dans les onglets
import { MaterialIcons } from '@expo/vector-icons';
// On importe la connexion à Supabase pour gérer l'utilisateur
import { supabase } from '../../lib/supabase';

// On crée le composant principal pour gérer les onglets
export default function TabLayout() {
  // On crée une variable user pour savoir si quelqu'un est connecté
  const [user, setUser] = useState<any>(null);
  // On crée une variable isAdmin pour savoir si l'utilisateur est admin
  const [isAdmin, setIsAdmin] = useState(false);

  // Quand le composant s'affiche, on vérifie l'utilisateur
  useEffect(() => {
    checkUser();
    // On écoute les changements de connexion (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null); // On met à jour l'utilisateur
      if (session?.user) {
        await checkAdminStatus(session.user.id); // On vérifie si c'est un admin
      } else {
        setIsAdmin(false); // Si pas connecté, pas admin
      }
    });
    // Quand on quitte la page, on arrête d'écouter
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fonction pour vérifier l'utilisateur actuel
  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      await checkAdminStatus(user.id);
    }
  };

  // Fonction pour vérifier si l'utilisateur est admin
  const checkAdminStatus = async (userId: string) => {
    const { data } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .single();
    setIsAdmin(data?.is_admin || false);
  };

  // On affiche les onglets en bas de l'écran
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#d4af37', // Couleur de l'onglet sélectionné
        headerShown: false, // On cache la barre du haut
      }}>
      {/* Onglet Accueil */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={28} color={color} />
          ),
        }}
      />
      {/* Onglet Catégories */}
      <Tabs.Screen
        name="products"
        options={{
          title: 'Catégories',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="category" size={28} color={color} />
          ),
        }}
      />
      {/* Onglet Panier */}
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Panier',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="shopping-cart" size={28} color={color} />
          ),
        }}
      />
      {/* Si personne n'est connecté, on montre l'onglet Connexion */}
      {!user ? (
        <Tabs.Screen
          name="auth"
          options={{
            title: 'Connexion',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="login" size={28} color={color} />
            ),
          }}
        />
      ) : (
        // Si quelqu'un est connecté, on montre l'onglet Profil
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="person" size={28} color={color} />
            ),
          }}
        />
      )}
      {/* Si l'utilisateur est admin, on montre l'onglet Admin */}
      {isAdmin && (
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Admin',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="admin-panel-settings" size={28} color={color} />
            ),
          }}
        />
      )}
    </Tabs>
  );
}
// On importe le composant Stack pour gérer la navigation entre les pages
import { Stack } from 'expo-router';
// On importe React, nécessaire pour utiliser JSX
import React from 'react';
// On importe AppProvider, qui permet de partager des données partout dans l'application
import { AppProvider } from '../contexts/AppContext';

// On crée le composant principal qui gère la structure de l'application
export default function RootLayout() {
  return (
    // On englobe toute l'application avec AppProvider pour partager des infos partout
    <AppProvider>
      {/* On utilise Stack pour gérer la navigation entre les écrans */}
      <Stack>
        {/* Premier écran : les onglets principaux, sans barre en haut */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Deuxième écran : la page d'une catégorie, avec une barre en haut personnalisée */}
        <Stack.Screen
          name="category/[category]"
          options={{
            headerShown: true, // On affiche la barre en haut
            headerStyle: {
              backgroundColor: '#f5f5f5', // Couleur de fond de la barre
            },
            headerTintColor: '#333', // Couleur du texte et des icônes de la barre
            headerTitleStyle: {
              fontWeight: 'bold', // Titre en gras
            },
          }}
        />
      </Stack>
    </AppProvider>
  );
}
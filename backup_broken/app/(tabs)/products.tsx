import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ProductsScreen() {
  const router = useRouter();

  const categories = [
    { name: 'Classique', icon: 'watch', count: 6, color: '#1a1a1a' },
    { name: 'Sport', icon: 'directions-run', count: 6, color: '#ff6b6b' },
    { name: 'Luxe', icon: 'star', count: 6, color: '#d4af37' },
    { name: 'Vintage', icon: 'access-time', count: 6, color: '#8b4513' },
    { name: 'Édition Limitée', icon: 'local-offer', count: 6, color: '#4a148c' },
    { name: 'Femme', icon: 'favorite', count: 6, color: '#e91e63' }
  ];

  const handleCategoryPress = (categoryName: string) => {
    router.push(`/category/${categoryName.toLowerCase()}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Nos Collections</Text>
      <View style={styles.categoriesGrid}>
        {categories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.categoryTile, { backgroundColor: cat.color }]}
            onPress={() => handleCategoryPress(cat.name)}
          >
            <MaterialIcons name={cat.icon as any} size={50} color="#fff" />
            <Text style={styles.categoryTileTitle}>{cat.name}</Text>
            <Text style={styles.categoryCount}>{cat.count} modèles</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
    color: '#333',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  categoryTile: {
    width: width / 2 - 30,
    borderRadius: 20,
    padding: 30,
    margin: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryTileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#fff',
  },
  categoryCount: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
});
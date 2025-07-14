import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FlipCard } from '../../components/FlipCard';
import { useCart } from '../../contexts/AppContext';

// Images libres de droit pour les montres
const watchImages = {
  classique: [
    'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400',
    'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=400',
    'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400',
    'https://images.unsplash.com/photo-1495704907664-81daba0e1e8e?w=400',
    'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400',
    'https://images.unsplash.com/photo-1594576722512-582bcd46fba3?w=400',
  ],
  sport: [
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
    'https://images.unsplash.com/photo-1506193095-80bc749473f2?w=400',
    'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400',
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',
    'https://images.unsplash.com/photo-1617714651073-17a0fcd14e41?w=400',
    'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400',
  ],
  luxe: [
    'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=400',
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400',
    'https://images.unsplash.com/photo-1565440962783-f87efdea99fd?w=400',
    'https://images.unsplash.com/photo-1629581895393-08f4c0ce6f97?w=400',
    'https://images.unsplash.com/photo-1627293491175-df9107264ca1?w=400',
    'https://images.unsplash.com/photo-1639006570490-79c0c53f1080?w=400',
  ],
};

const categoryData = {
  classique: [
    { id: 1, name: 'Révélation Classique', price: 2499, mechanism: 'Automatique', material: 'Acier inoxydable', waterResistance: '50m' },
    { id: 2, name: 'Tradition Éternelle', price: 3299, mechanism: 'Manuel', material: 'Or rose', waterResistance: '30m' },
    { id: 3, name: 'Héritage Royal', price: 3899, mechanism: 'Automatique', material: 'Or blanc', waterResistance: '50m' },
    { id: 4, name: 'Élégance Intemporelle', price: 2799, mechanism: 'Quartz', material: 'Acier PVD', waterResistance: '30m' },
    { id: 5, name: 'Prestige Classic', price: 4299, mechanism: 'Automatique', material: 'Platine', waterResistance: '100m' },
    { id: 6, name: 'Noblesse Éternelle', price: 3599, mechanism: 'Manuel', material: 'Or jaune', waterResistance: '50m' },
  ],
  sport: [
    { id: 7, name: 'Pulse Racing', price: 1899, mechanism: 'Automatique', material: 'Titane', waterResistance: '200m' },
    { id: 8, name: 'Velocity Master', price: 2199, mechanism: 'Automatique', material: 'Carbone', waterResistance: '100m' },
    { id: 9, name: 'Adrenaline Pro', price: 2499, mechanism: 'Chronographe', material: 'Céramique', waterResistance: '300m' },
    { id: 10, name: 'Speed Champion', price: 1799, mechanism: 'Quartz', material: 'Acier forgé', waterResistance: '150m' },
    { id: 11, name: 'Extreme Diver', price: 2899, mechanism: 'Automatique', material: 'Titane noir', waterResistance: '500m' },
    { id: 12, name: 'Racing Legend', price: 2399, mechanism: 'Chronographe', material: 'Acier/Caoutchouc', waterResistance: '200m' },
  ],
  luxe: [
    { id: 13, name: 'Prestige Royale', price: 8999, mechanism: 'Tourbillon', material: 'Or blanc 18k', waterResistance: '50m' },
    { id: 14, name: 'Diamond Heritage', price: 12999, mechanism: 'Perpétuel', material: 'Platine', waterResistance: '30m' },
    { id: 15, name: 'Excellence Suprême', price: 15999, mechanism: 'Grande Complication', material: 'Or rose serti', waterResistance: '50m' },
    { id: 16, name: 'Masterpiece Eternal', price: 18999, mechanism: 'Répétition minutes', material: 'Platine/Diamants', waterResistance: '30m' },
    { id: 17, name: 'Royal Skeleton', price: 10999, mechanism: 'Tourbillon', material: 'Or blanc squelette', waterResistance: '50m' },
    { id: 18, name: 'Imperial Crown', price: 22999, mechanism: 'Quantième perpétuel', material: 'Or massif', waterResistance: '50m' },
  ],
};

export default function CategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [cart, setCart] = useState<any[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const addToFavorites = async (watch: any) => {
    Alert.alert('Succès', 'Produit ajouté aux favoris');
  };

  const watches = categoryData[category as keyof typeof categoryData] || [];
  const images = watchImages[category as keyof typeof watchImages] || watchImages.classique;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>
        {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Catégorie'}
      </Text>
      <View style={styles.productsGrid}>
        {watches.map((watch, index) => (
          <FlipCard
            key={watch.id}
            watch={{ ...watch, image: images[index % images.length], category: category || '' }}
            onAddToCart={addToCart}
            onAddToFavorites={addToFavorites}
          />
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
    fontSize: 28,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
    color: '#333',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
});
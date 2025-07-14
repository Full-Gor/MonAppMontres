import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { FlipCard } from '../../components/FlipCard';
import { useCart } from '../../contexts/AppContext';
import { supabase } from '../../lib/supabase';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    checkUser();
    loadFavorites();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const removeFavorite = async (id: number) => {
    Alert.alert(
      'Retirer des favoris',
      'Voulez-vous retirer ce produit de vos favoris ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Retirer',
          style: 'destructive',
          onPress: async () => {
            const newFavorites = favorites.filter(item => item.id !== id);
            setFavorites(newFavorites);
            await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
            Alert.alert('✓', 'Produit retiré des favoris');
          }
        }
      ]
    );
  };

  const handleAddToCart = (item: any) => {
    addToCart(item);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <MaterialIcons name="favorite-border" size={80} color="#ccc" />
        <Text style={styles.loginPrompt}>Connectez-vous pour voir vos favoris</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.pageTitle}>Mes Favoris</Text>
      
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite-border" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Aucun favori pour le moment</Text>
          <Text style={styles.emptySubtext}>
            Appuyez sur le ❤️ pour ajouter des montres à vos favoris
          </Text>
        </View>
      ) : (
        <View style={styles.favoritesGrid}>
          {favorites.map((item) => (
            <View key={item.id} style={styles.favoriteCard}>
              <FlipCard 
                watch={item}
                onAddToCart={handleAddToCart}
                onAddToFavorites={() => {}}
                onRemove={removeFavorite}
              />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loginPrompt: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  favoritesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  favoriteCard: {
    width: '48%',
    marginBottom: 15,
  },
}); 
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { FlipCard } from '../../components/FlipCard';
import { useCart } from '../../contexts/AppContext';

export default function FavoritesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { favorites, user, loadFavorites, removeFavorite } = useCart();

  useEffect(() => {
    loadFavorites();
  }, []);

  // Recharger les favoris quand l'écran est focalisé
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const handleRemoveFavorite = (id: number) => {
    removeFavorite(id);
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <MaterialIcons name="favorite-border" size={80} color="#ccc" />
        <Text style={styles.loginPrompt}>Connectez-vous pour synchroniser vos favoris</Text>
        <Text style={styles.loginSubPrompt}>
          Vous pouvez toujours ajouter des favoris localement
        </Text>
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
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Mes Favoris</Text>
        <View style={styles.statsContainer}>
          <MaterialIcons name="favorite" size={20} color="#ff4444" />
          <Text style={styles.statsText}>{favorites.length} produit{favorites.length !== 1 ? 's' : ''}</Text>
        </View>
      </View>
      
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
            <FlipCard 
              key={item.id}
              watch={item}
              onRemove={handleRemoveFavorite}
            />
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
    paddingHorizontal: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
    fontWeight: '500',
  },
  loginPrompt: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  loginSubPrompt: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 24,
  },
  favoritesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
}); 
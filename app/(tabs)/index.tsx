import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlipCard } from '../../components/FlipCard';
import { useCart } from '../../contexts/AppContext';

const { width } = Dimensions.get('window');

// Données avec toutes les vidéos corrigées
const mockWatches = {
  classique: [
    {
      id: 1,
      name: 'Révélation Classique',
      price: 2499,
      image: 'https://videos.pexels.com/video-files/6827301/6827301-uhd_2560_1440_25fps.mp4',
      category: 'classique',
      mechanism: 'Automatique',
      material: 'Acier inoxydable',
      waterResistance: '50m'
    },
   
    {
      id: 5,
      name: 'Élégance Intemporelle',
      price: 2799,
      image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400',
      category: 'classique',
      mechanism: 'Quartz',
      material: 'Acier PVD',
      waterResistance: '30m'
    }
  ],
  sport: [
    {
      id: 3,
      name: 'Pulse Racing',
      price: 1899,
      image: 'https://videos.pexels.com/video-files/29280252/12629244_1080_1920_30fps.mp4',
      category: 'sport',
      mechanism: 'Automatique',
      material: 'Titane',
      waterResistance: '200m'
    }
   
  ],
};

// Images corrigées pour les catégories
const categoryImages = {
  'Classique': 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400',
  'Sport': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
  'Luxe': 'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=400',
  'Vintage': 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400',
  'Femme': 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=400',
};

export default function HomeScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const handleAddToCart = (watch: any) => {
    addToCart(watch);
  };

  const handleCategoryPress = (category: string) => {
    router.push(`/category/${category.toLowerCase()}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.hero, { opacity: fadeAnim }]}>
        <Video
          source={{ uri: 'https://videos.pexels.com/video-files/6827301/6827301-uhd_2560_1440_25fps.mp4' }}
          style={styles.heroVideo}
          shouldPlay
          isLooping
          isMuted
          resizeMode={ResizeMode.COVER}
        />
        <View style={styles.heroOverlay}>
          <Animated.Text style={[styles.heroTitle, { transform: [{ translateY: slideAnim }] }]}>
            L'Art du Temps Révélé
          </Animated.Text>
          <Text style={styles.heroSubtitle}>
            Découvrez nos montres squelette d'exception
          </Text>
        </View>
      </Animated.View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Collections Exclusives</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.entries(categoryImages).map(([cat, imageUrl], index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(cat)}
            >
              <Image
                source={{ uri: imageUrl }}
                style={styles.categoryImage}
              />
              <Text style={styles.categoryName}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nouveautés</Text>
        <FlatList
          horizontal
          data={Object.values(mockWatches).flat()}
          renderItem={({ item }) => (
            <FlipCard
              watch={item}
              onAddToCart={handleAddToCart}
              onAddToFavorites={() => { }}
            />
          )}
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  hero: {
    position: 'relative',
    height: 350,
    marginBottom: 20,
  },
  heroVideo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  categoryCard: {
    marginRight: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryImage: {
    width: 160,
    height: 160,
    borderRadius: 15,
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
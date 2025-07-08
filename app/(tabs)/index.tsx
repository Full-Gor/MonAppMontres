import { ResizeMode, Video } from 'expo-av';
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

const { width } = Dimensions.get('window');

// Données mock pour les montres
const mockWatches = {
  classique: [
    { id: 1, name: 'Révélation Classique', price: 2499, image: 'https://videos.pexels.com/video-files/6827301/6827301-uhd_2560_1440_25fps.mp4', category: 'classique', mechanism: 'Automatique', material: 'Acier inoxydable', waterResistance: '50m' },
    { id: 2, name: 'Tradition Éternelle', price: 3299, image: 'https://videos.pexels.com/video-files/6827301/6827301-uhd_2560_1440_25fps.mp4', category: 'classique', mechanism: 'Manuel', material: 'Or rose', waterResistance: '30m' }
  ],
  sport: [
    { id: 3, name: 'Pulse Racing', price: 1899, image: 'https://videos.pexels.com/video-files/6827301/6827301-uhd_2560_1440_25fps.mp4', category: 'sport', mechanism: 'Automatique', material: 'Titane', waterResistance: '200m' },
    { id: 4, name: 'Velocity Master', price: 2199, image: 'https://videos.pexels.com/video-files/6827301/6827301-uhd_2560_1440_25fps.mp4', category: 'sport', mechanism: 'Automatique', material: 'Carbone', waterResistance: '100m' }
  ],
};

export default function HomeScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

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

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.hero, { opacity: fadeAnim }]}>
        <Image
          source={{ uri: 'https://videos.pexels.com/video-files/6827301/6827301-uhd_2560_1440_25fps.mp4' }}
          style={styles.heroImage}
        />
        <Animated.Text style={[styles.heroTitle, { transform: [{ translateY: slideAnim }] }]}>
          L'Art du Temps Révélé
        </Animated.Text>
        <Text style={styles.heroSubtitle}>
          Découvrez nos montres squelette d'exception
        </Text>
      </Animated.View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Collections Exclusives</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Classique', 'Sport', 'Luxe', 'Vintage', 'Limitée', 'Femme'].map((cat, index) => (
            <TouchableOpacity key={index} style={styles.categoryCard}>
              <Image
                source={{ uri: 'https://videos.pexels.com/video-files/6827301/6827301-uhd_2560_1440_25fps.mp4' }}
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
          data={Object.values(mockWatches).flat().slice(0, 4)}
          renderItem={({ item }) => (
            <View style={styles.featuredCard}>
              {item.name === 'Révélation Classique' ? (
                <Video
                  source={{ uri: "https://videos.pexels.com/video-files/6827301/6827301-uhd_2560_1440_25fps.mp4" }}
                  style={styles.featuredImage}
                  resizeMode={ResizeMode.COVER}
                  isLooping
                  isMuted
                  shouldPlay
                />
              ) : (
                <Image source={{ uri: item.image }} style={styles.featuredImage} />
              )}
              <Text style={styles.featuredName}>{item.name}</Text>
              <Text style={styles.featuredPrice}>{item.price}€</Text>
            </View>
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
    height: 300,
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroTitle: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    color: '#fff',
    fontSize: 18,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  categoryCard: {
    marginRight: 15,
    alignItems: 'center',
  },
  categoryImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  featuredCard: {
    marginRight: 15,
    width: 200,
  },
  featuredImage: {
    width: 200,
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  featuredName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  featuredPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d4af37',
  },
});
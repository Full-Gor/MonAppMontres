import { MaterialIcons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useCart } from '../contexts/AppContext';

const { width } = Dimensions.get('window');

interface WatchProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  mechanism: string;
  material: string;
  waterResistance: string;
  limited?: string;
}

interface FlipCardProps {
  watch: WatchProps;
  onAddToCart?: (watch: WatchProps) => void;
  onAddToFavorites?: (watch: WatchProps) => void;
  onRemove?: (id: number) => void;
}

export const FlipCard: React.FC<FlipCardProps> = ({ 
  watch, 
  onAddToCart, 
  onAddToFavorites, 
  onRemove 
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);
  const { addToCart, addToFavorites, removeFavorite, isFavorite } = useCart();

  // Associer la bonne vidéo à chaque montre
  let videoUrl = null;
  if (watch.name === 'Révélation Classique') {
    videoUrl = "https://videos.pexels.com/video-files/6827301/6827301-uhd_2560_1440_25fps.mp4";
  } else if (watch.name === 'Pulse Racing') {
    videoUrl = "https://videos.pexels.com/video-files/29280252/12629244_1080_1920_30fps.mp4";
  }

  const flipCard = () => {
    Animated.spring(animatedValue, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg']
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg']
  });

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(watch);
    } else {
      addToCart(watch);
    }
  };

  const handleToggleFavorite = () => {
    if (isFavorite(watch.id)) {
      removeFavorite(watch.id);
    } else {
      if (onAddToFavorites) {
        onAddToFavorites(watch);
      } else {
        addToFavorites(watch);
      }
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* Indicateur de favori en haut à droite */}
      <TouchableOpacity 
        style={styles.favoriteIndicator}
        onPress={handleToggleFavorite}
      >
        <MaterialIcons 
          name={isFavorite(watch.id) ? "favorite" : "favorite-border"} 
          size={24} 
          color={isFavorite(watch.id) ? "#ff4444" : "#666"} 
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={flipCard} style={styles.flipContainer}>
        <Animated.View style={[styles.card, { transform: [{ rotateY: frontInterpolate }] }]}>
          {videoUrl ? (
            <Video
              source={{ uri: videoUrl }}
              style={styles.cardVideo}
              shouldPlay
              isLooping
              isMuted
              resizeMode={ResizeMode.COVER}
            />
          ) : (
            <Image source={{ uri: watch.image }} style={styles.cardVideo} />
          )}
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{watch.name}</Text>
            <Text style={styles.cardPrice}>{watch.price}€</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.card, styles.cardBack, { transform: [{ rotateY: backInterpolate }] }]}>
          <Text style={styles.cardBackTitle}>Spécifications</Text>
          <Text style={styles.spec}>Mécanisme: {watch.mechanism}</Text>
          <Text style={styles.spec}>Matériau: {watch.material}</Text>
          <Text style={styles.spec}>Étanchéité: {watch.waterResistance}</Text>
          {watch.limited && <Text style={styles.limited}>Édition limitée: {watch.limited}</Text>}

          <View style={styles.cardButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleAddToCart}>
              <MaterialIcons name="shopping-cart" size={20} color="#fff" />
              <Text style={styles.buttonText}>Panier</Text>
            </TouchableOpacity>
            
            {onRemove && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.removeButton]} 
                onPress={() => onRemove(watch.id)}
              >
                <MaterialIcons name="delete" size={20} color="#fff" />
                <Text style={styles.buttonText}>Supprimer</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.45,
    height: 280,
    margin: 8,
    position: 'relative',
  },
  favoriteIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  flipContainer: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 15,
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  cardBack: {
    backgroundColor: '#fff',
    padding: 15,
    justifyContent: 'space-between',
  },
  cardVideo: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardContent: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  cardBackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  spec: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  limited: {
    fontSize: 12,
    color: '#d4af37',
    fontWeight: 'bold',
    marginTop: 5,
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#d4af37',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 80,
    justifyContent: 'center',
  },
  removeButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';

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
  onAddToCart: (watch: WatchProps) => void;
  onAddToFavorites: (watch: WatchProps) => void;
  onRemove?: (id: number) => void;
}

export const FlipCard: React.FC<FlipCardProps> = ({ watch, onAddToCart, onAddToFavorites, onRemove }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

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

  return (
    <TouchableOpacity onPress={flipCard} style={styles.cardContainer}>
      <Animated.View style={[styles.card, { transform: [{ rotateY: frontInterpolate }] }]}>
        <Video
          source={{ uri: 'https://videos.pexels.com/video-files/6827301/6827301-uhd_2560_1440_25fps.mp4' }}
          style={styles.cardVideo}
          shouldPlay
          isLooping
          isMuted
          resizeMode={ResizeMode.COVER}
        />
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
          <TouchableOpacity style={styles.actionButton} onPress={() => onAddToCart(watch)}>
            <MaterialIcons name="shopping-cart" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => onAddToFavorites(watch)}>
            <MaterialIcons name="favorite" size={20} color="#fff" />
          </TouchableOpacity>
          {onRemove && (
            <TouchableOpacity style={[styles.actionButton, styles.removeButton]} onPress={() => onRemove(watch.id)}>
              <MaterialIcons name="delete" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width / 2 - 30,
    height: 300,
    margin: 10,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
    padding: 20,
  },
  cardVideo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  cardBackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  spec: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  limited: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff4444',
    marginTop: 10,
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 'auto',
    paddingTop: 20,
  },
  actionButton: {
    backgroundColor: '#d4af37',
    padding: 10,
    borderRadius: 25,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#ff4444',
  },
});
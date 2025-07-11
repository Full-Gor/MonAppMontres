import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
  mechanism?: string;
  material?: string;
  waterResistance?: string;
}

interface AppContextType {
  cart: CartItem[];
  addToCart: (item: any) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  favorites: any[];
  addToFavorites: (item: any) => Promise<void>;
  removeFavorite: (id: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    loadCart();
    loadFavorites();
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

  const saveCart = async (newCart: CartItem[]) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const saveFavorites = async (newFavorites: any[]) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addToCart = async (item: any) => {
    return new Promise(async (resolve) => {
      const existingItem = cart.find(cartItem => cartItem.id === item.id);
      let newCart;
      
      if (existingItem) {
        newCart = cart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        newCart = [...cart, { ...item, quantity: 1 }];
      }
      
      setCart(newCart);
      await saveCart(newCart);
      Alert.alert('✓', `${item.name} ajouté au panier`);
      resolve();
    });
  };

  const removeFromCart = async (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    await saveCart(newCart);
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }
    
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setCart(newCart);
    await saveCart(newCart);
  };

  const clearCart = async () => {
    setCart([]);
    await AsyncStorage.removeItem('cart');
  };

  const addToFavorites = async (item: any) => {
    const exists = favorites.find(fav => fav.id === item.id);
    if (!exists) {
      const newFavorites = [...favorites, item];
      setFavorites(newFavorites);
      await saveFavorites(newFavorites);
      Alert.alert('✓', `${item.name} ajouté aux favoris`);
    } else {
      Alert.alert('Info', 'Déjà dans les favoris');
    }
  };

  const removeFavorite = async (id: number) => {
    const newFavorites = favorites.filter(item => item.id !== id);
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
  };

  return (
    <AppContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      favorites,
      addToFavorites,
      removeFavorite
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useCart must be used within AppProvider');
  }
  return context;
};
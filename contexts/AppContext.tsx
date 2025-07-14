import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';

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
  isFavorite: (id: number) => boolean;
  loadFavorites: () => Promise<void>;
  user: any;
  setUser: (user: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadCart();
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

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
    if (!user) {
      // Si pas connecté, charger depuis AsyncStorage
      try {
        const savedFavorites = await AsyncStorage.getItem('favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites from storage:', error);
      }
      return;
    }

    try {
      // Charger depuis Supabase si connecté
      const { data: favoritesData, error } = await supabase
        .from('favorites')
        .select(`
          id,
          product_id,
          created_at,
          products (
            id,
            name,
            price,
            image,
            category,
            mechanism,
            material,
            waterResistance
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && favoritesData) {
        const formattedFavorites = favoritesData.map(fav => ({
          ...fav.products,
          favorite_id: fav.id
        }));
        setFavorites(formattedFavorites);
        
        // Synchroniser avec AsyncStorage
        await AsyncStorage.setItem('favorites', JSON.stringify(formattedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites from Supabase:', error);
      // Fallback vers AsyncStorage
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  };

  const saveCart = async (newCart: CartItem[]) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const saveFavoritesToStorage = async (newFavorites: any[]) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addToCart = async (item: any): Promise<void> => {
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
      resolve(undefined);
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

  const isFavorite = (id: number) => {
    return favorites.some(fav => fav.id === id);
  };

  const addToFavorites = async (item: any) => {
    if (isFavorite(item.id)) {
      Alert.alert('Info', 'Déjà dans les favoris');
      return;
    }

    if (!user) {
      // Si pas connecté, sauvegarder localement
      const newFavorites = [...favorites, item];
      setFavorites(newFavorites);
      await saveFavoritesToStorage(newFavorites);
      Alert.alert('✓', `${item.name} ajouté aux favoris`);
      return;
    }

    try {
      // Ajouter à Supabase si connecté
      const { data, error } = await supabase
        .from('favorites')
        .insert([{
          user_id: user.id,
          product_id: item.id,
        }])
        .select()
        .single();

      if (!error && data) {
        const newFavorites = [...favorites, { ...item, favorite_id: data.id }];
        setFavorites(newFavorites);
        await saveFavoritesToStorage(newFavorites);
        Alert.alert('✓', `${item.name} ajouté aux favoris`);
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter aux favoris');
    }
  };

  const removeFavorite = async (id: number) => {
    const favoriteItem = favorites.find(fav => fav.id === id);
    
    if (!user) {
      // Si pas connecté, supprimer localement
      const newFavorites = favorites.filter(item => item.id !== id);
      setFavorites(newFavorites);
      await saveFavoritesToStorage(newFavorites);
      return;
    }

    try {
      // Supprimer de Supabase si connecté
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteItem?.favorite_id);

      if (!error) {
        const newFavorites = favorites.filter(item => item.id !== id);
        setFavorites(newFavorites);
        await saveFavoritesToStorage(newFavorites);
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      Alert.alert('Erreur', 'Impossible de supprimer des favoris');
    }
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
      removeFavorite,
      isFavorite,
      loadFavorites,
      user,
      setUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useCart must be used within an AppProvider');
  }
  return context;
};
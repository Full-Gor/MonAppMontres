import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  id: number;
  total: number;
  status: string;
  created_at: string;
}

export default function CartScreen() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('cart');

  useEffect(() => {
    loadCart();
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      loadOrderHistory();
    }
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

  const loadOrderHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setOrders(data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(newCart);
    await AsyncStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = async (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    await AsyncStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleCheckout = async () => {
    if (!user) {
      Alert.alert('Connexion requise', 'Veuillez vous connecter pour passer commande');
      return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    try {
      const { error } = await supabase
        .from('orders')
        .insert([{ user_id: user.id, total, status: 'en cours' }]);

      if (!error) {
        Alert.alert('Succès', 'Commande passée avec succès!');
        setCart([]);
        await AsyncStorage.removeItem('cart');
        loadOrderHistory();
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la commande');
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'cart' && styles.activeTab]}
          onPress={() => setActiveTab('cart')}
        >
          <Text style={[styles.tabText, activeTab === 'cart' && styles.activeTabText]}>
            Panier ({cart.length})
          </Text>
        </TouchableOpacity>
        {user && (
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
            onPress={() => setActiveTab('orders')}
          >
            <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
              Commandes
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {activeTab === 'cart' ? (
        <>
          {cart.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="shopping-cart" size={80} color="#ccc" />
              <Text style={styles.emptyText}>Votre panier est vide</Text>
            </View>
          ) : (
            <>
              {cart.map(item => (
                <View key={item.id} style={styles.cartItem}>
                  <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemPrice}>{item.price}€</Text>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                        <MaterialIcons name="remove-circle" size={24} color="#d4af37" />
                      </TouchableOpacity>
                      <Text style={styles.quantity}>{item.quantity}</Text>
                      <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                        <MaterialIcons name="add-circle" size={24} color="#d4af37" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                    <MaterialIcons name="delete" size={24} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              ))}
              
              <View style={styles.totalSection}>
                <Text style={styles.totalText}>Total: {total}€</Text>
                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                  <Text style={styles.checkoutButtonText}>Passer commande</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      ) : (
        <View style={styles.ordersContainer}>
          {orders.length === 0 ? (
            <Text style={styles.emptyText}>Aucune commande</Text>
          ) : (
            orders.map(order => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderDate}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </Text>
                  <Text style={styles.orderStatus}>{order.status}</Text>
                </View>
                <Text style={styles.orderTotal}>Total: {order.total}€</Text>
                <View style={styles.orderActions}>
                  <TouchableOpacity style={styles.trackButton}>
                    <MaterialIcons name="local-shipping" size={16} color="#fff" />
                    <Text style={styles.trackButtonText}>Suivre</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.returnButton}>
                    <Text style={styles.returnButtonText}>Retour</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#d4af37',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#d4af37',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    alignItems: 'center',
    elevation: 2,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cartItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d4af37',
    marginVertical: 5,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    alignItems: 'center',
    elevation: 3,
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  checkoutButton: {
    backgroundColor: '#d4af37',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ordersContainer: {
    padding: 10,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderStatus: {
    fontSize: 14,
    color: '#d4af37',
    fontWeight: 'bold',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackButton: {
    flexDirection: 'row',
    backgroundColor: '#d4af37',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  trackButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
  },
  returnButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#666',
  },
  returnButtonText: {
    color: '#666',
    fontWeight: '600',
  },
});
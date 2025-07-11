import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
  });
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      await loadProfile(user.id);
      await loadMessages(user.id);
    }
  };

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setProfileData({
        name: data.name || '',
        email: data.email || user?.email || '',
        phone: data.phone || '',
        address: data.address || '',
        avatar: data.avatar || '',
      });
    }
  };

  const loadMessages = async (userId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`user_id.eq.${userId},admin_id.eq.${userId}`)
      .order('created_at', { ascending: true });
    
    if (data) {
      setMessages(data);
    }
  };

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileData({ ...profileData, avatar: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('users')
      .update({
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        avatar: profileData.avatar,
      })
      .eq('id', user.id);

    if (!error) {
      Alert.alert('Succès', 'Profil mis à jour');
      setEditing(false);
      await loadProfile(user.id);
    } else {
      Alert.alert('Erreur', 'Erreur lors de la mise à jour');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert([{
        user_id: user.id,
        content: newMessage,
        type: 'question',
        created_at: new Date().toISOString(),
      }]);

    if (!error) {
      setNewMessage('');
      await loadMessages(user.id);
      Alert.alert('Succès', 'Message envoyé');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(tabs)/auth');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (user) {
      await loadProfile(user.id);
      await loadMessages(user.id);
    }
    setRefreshing(false);
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <MaterialIcons name="account-circle" size={80} color="#ccc" />
        <Text style={styles.loginPrompt}>Veuillez vous connecter</Text>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.push('/(tabs)/auth')}
        >
          <Text style={styles.loginButtonText}>Se connecter</Text>
        </TouchableOpacity>
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
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handleImagePicker} disabled={!editing}>
          <Image 
            source={{ uri: profileData.avatar || 'https://via.placeholder.com/150' }} 
            style={styles.profileAvatar}
          />
          {editing && (
            <View style={styles.cameraIconContainer}>
              <MaterialIcons name="camera-alt" size={24} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.profileName}>{profileData.name || 'Utilisateur'}</Text>
        <Text style={styles.profileEmail}>{profileData.email}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <TouchableOpacity onPress={() => setEditing(!editing)}>
            <MaterialIcons name={editing ? "close" : "edit"} size={24} color="#d4af37" />
          </TouchableOpacity>
        </View>
        
        {editing ? (
          <>
            <TextInput
              style={styles.input}
              value={profileData.name}
              onChangeText={(text) => setProfileData({...profileData, name: text})}
              placeholder="Nom"
            />
            <TextInput
              style={styles.input}
              value={profileData.phone}
              onChangeText={(text) => setProfileData({...profileData, phone: text})}
              placeholder="Téléphone"
              keyboardType="phone-pad"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={profileData.address}
              onChangeText={(text) => setProfileData({...profileData, address: text})}
              placeholder="Adresse"
              multiline
              numberOfLines={3}
            />
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <MaterialIcons name="phone" size={20} color="#666" />
              <Text style={styles.infoLabel}>Téléphone:</Text>
              <Text style={styles.infoValue}>{profileData.phone || 'Non renseigné'}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="location-on" size={20} color="#666" />
              <Text style={styles.infoLabel}>Adresse:</Text>
              <Text style={styles.infoValue}>{profileData.address || 'Non renseignée'}</Text>
            </View>
          </>
        )}
      </View>

      <TouchableOpacity 
        style={styles.messageButton}
        onPress={() => setMessageModalVisible(true)}
      >
        <MaterialIcons name="message" size={24} color="#fff" />
        <Text style={styles.messageButtonText}>Messages ({messages.length})</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="#fff" />
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
      </TouchableOpacity>

      <Modal
        visible={messageModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMessageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Messages</Text>
              <TouchableOpacity onPress={() => setMessageModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.messagesContainer}>
              {messages.map((msg) => (
                <View 
                  key={msg.id} 
                  style={[
                    styles.messageItem,
                    msg.type === 'reply' ? styles.replyMessage : styles.userMessage
                  ]}
                >
                  <Text style={styles.messageContent}>{msg.content}</Text>
                  <Text style={styles.messageDate}>
                    {new Date(msg.created_at).toLocaleString()}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.messageInputContainer}>
              <TextInput
                style={styles.messageInput}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Écrivez votre message..."
                multiline
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <MaterialIcons name="send" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  loginPrompt: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#d4af37',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  profileAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 15,
    right: 0,
    backgroundColor: '#d4af37',
    borderRadius: 20,
    padding: 8,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    margin: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#d4af37',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  messageButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ff4444',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageItem: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  replyMessage: {
    backgroundColor: '#d4af37',
    alignSelf: 'flex-end',
  },
  messageContent: {
    fontSize: 16,
    color: '#333',
  },
  messageDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  messageInputContainer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#d4af37',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
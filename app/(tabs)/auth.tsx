import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Vérifier le rôle de l'utilisateur
      const { data: userData } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (userData?.is_admin) {
        router.replace('/(tabs)/admin');
      } else {
        router.replace('/(tabs)');
      }
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        Alert.alert('Erreur de connexion', error.message);
        return;
      }

      if (data.user) {
        // Vérifier si l'utilisateur existe dans la table users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError || !userData) {
          // Créer l'utilisateur s'il n'existe pas
          await supabase
            .from('users')
            .insert([{
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || '',
              is_admin: false,
            }]);
        }

        // Rediriger selon le rôle
        if (userData?.is_admin) {
          router.replace('/(tabs)/admin');
        } else {
          router.replace('/(tabs)');
        }
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!formData.email || !formData.password || !formData.name) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (error) {
        Alert.alert('Erreur d\'inscription', error.message);
        return;
      }

      if (data.user) {
        // Créer l'utilisateur dans la table users
        await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email: data.user.email,
            name: formData.name,
            is_admin: false,
          }]);

        Alert.alert(
          'Inscription réussie',
          'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
          [{ text: 'OK', onPress: () => setIsLogin(true) }]
        );
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
    });
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image 
            source={require('../../assets/images/icon.png')} 
            style={styles.logo}
          />
          <Text style={styles.title}>MonApp Montres</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
          </Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <MaterialIcons name="person" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Nom complet"
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              value={formData.password}
              onChangeText={(text) => setFormData({...formData, password: text})}
              secureTextEntry
            />
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                secureTextEntry
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={isLogin ? handleLogin : handleSignup}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'S\'inscrire')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={switchMode} style={styles.switchButton}>
            <Text style={styles.switchText}>
              {isLogin 
                ? 'Pas de compte ? Inscrivez-vous' 
                : 'Déjà un compte ? Connectez-vous'
              }
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.adminInfo}>
          <Text style={styles.adminInfoText}>
            👑 Compte admin de test : admin123@gmail.com
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#d4af37',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
  },
  switchText: {
    color: '#d4af37',
    fontSize: 16,
  },
  adminInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fff3cd',
    borderRadius: 10,
    alignItems: 'center',
  },
  adminInfoText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
  },
});
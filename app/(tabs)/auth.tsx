import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        if (!isLogin && !name) {
            Alert.alert('Erreur', 'Veuillez entrer votre nom');
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    Alert.alert('Erreur de connexion', error.message);
                } else {
                    Alert.alert('Succès', 'Connexion réussie !');
                    router.replace('/(tabs)');
                }
            } else {
                // Inscription
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) {
                    Alert.alert('Erreur d\'inscription', error.message);
                } else if (data.user) {
                    // Créer le profil utilisateur dans la table users
                    const { error: profileError } = await supabase
                        .from('users')
                        .insert([{
                            id: data.user.id,
                            email: email,
                            name: name,
                            created_at: new Date().toISOString(),
                        }]);

                    if (profileError) {
                        console.error('Erreur création profil:', profileError);
                    }

                    Alert.alert(
                        'Inscription réussie !',
                        'Votre compte a été créé. Vous pouvez maintenant vous connecter.',
                        [{ text: 'OK', onPress: () => setIsLogin(true) }]
                    );

                    // Réinitialiser les champs
                    setEmail('');
                    setPassword('');
                    setName('');
                }
            }
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur est survenue');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.logoContainer}>
                    <View style={styles.iconBackground}>
                        <MaterialIcons name="watch" size={60} color="#d4af37" />
                    </View>
                    <Text style={styles.title}>Montres Squelette</Text>
                    <Text style={styles.subtitle}>L'excellence horlogère</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>
                        {isLogin ? 'Connexion' : 'Créer un compte'}
                    </Text>

                    {!isLogin && (
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="person" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Nom complet"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        </View>
                    )}

                    <View style={styles.inputContainer}>
                        <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                placeholder="Mot de passe"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleAuth}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.switchButton}
                        onPress={() => {
                            setIsLogin(!isLogin);
                            setEmail('');
                            setPassword('');
                            setName('');
                        }}
                    >
                        <Text style={styles.switchText}>
                            {isLogin
                                ? "Pas encore de compte ? Inscrivez-vous"
                                : 'Déjà un compte ? Connectez-vous'}
                        </Text>
                    </TouchableOpacity>
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
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconBackground: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    formTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#fafafa',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 16,
        color: '#333',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%', // Ensure it takes full width of inputContainer
        marginBottom: 0, // Remove bottom margin here
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 12,
    },
    button: {
        backgroundColor: '#d4af37',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#d4af37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchButton: {
        marginTop: 25,
        alignItems: 'center',
    },
    switchText: {
        color: '#d4af37',
        fontSize: 16,
        fontWeight: '500',
    },
});
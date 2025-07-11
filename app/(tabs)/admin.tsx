// On importe React et des outils pour gérer l'état et les effets
import React, { useEffect, useState } from 'react';
// On importe des outils pour l'affichage et les interactions
import {
    Alert, // Pour afficher une liste d'éléments
    Image, // Pour afficher des messages d'alerte
    Modal, // Pour afficher des images
    RefreshControl, // Pour afficher du texte
    ScrollView,
    StyleSheet, // Pour regrouper des éléments
    Text, // Pour rendre un bouton cliquable
    TextInput, // Pour faire défiler l'écran
    TouchableOpacity, // Pour écrire le style
    View
} from 'react-native';
// On importe les icônes MaterialIcons pour afficher des images
import { MaterialIcons } from '@expo/vector-icons';
// On importe la connexion à Supabase pour gérer les données
import { supabase } from '../../lib/supabase';
// On importe useRouter pour changer de page
import { useRouter } from 'expo-router';

// On crée le composant principal pour la page admin
export default function AdminScreen() {
    // On crée une variable user pour savoir qui est connecté
    const [user, setUser] = useState<any>(null);
    // Onglet actif (dashboard, produits, utilisateurs, messages...)
    const [activeTab, setActiveTab] = useState('dashboard');
    // Liste des produits
    const [products, setProducts] = useState<any[]>([]);
    // Liste des utilisateurs
    const [users, setUsers] = useState<any[]>([]);
    // Liste des messages
    const [messages, setMessages] = useState<any[]>([]);
    // Pour afficher ou cacher la fenêtre d'édition de produit
    const [editModalVisible, setEditModalVisible] = useState(false);
    // Pour afficher ou cacher la fenêtre de réponse à un message
    const [messageReplyModalVisible, setMessageReplyModalVisible] = useState(false);
    // Produit en cours d'édition
    const [editingProduct, setEditingProduct] = useState<any>(null);
    // Message sélectionné pour répondre
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    // Texte de la réponse à un message
    const [replyContent, setReplyContent] = useState('');
    // Pour savoir si on rafraîchit la page
    const [refreshing, setRefreshing] = useState(false);
    // Statistiques (ventes, commandes, utilisateurs, produits)
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
    });
    // Pour changer de page
    const router = useRouter();

    // Quand la page s'affiche, on vérifie si l'utilisateur est admin
    useEffect(() => {
        checkAdmin();
    }, []);

    // Fonction pour vérifier si l'utilisateur est admin
    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('users')
                .select('is_admin')
                .eq('id', user.id)
                .single();

            if (data?.is_admin) {
                setUser(user);
                await loadData(); // On charge les données admin
            } else {
                Alert.alert('Accès refusé', 'Vous n\'êtes pas administrateur');
                router.replace('/(tabs)'); // On renvoie à l'accueil
            }
        } else {
            router.replace('/(tabs)/auth'); // Si pas connecté, on va à la connexion
        }
    };

    // Fonction pour charger toutes les données (produits, utilisateurs, messages, stats)
    const loadData = async () => {
        // Charger produits
        const { data: productsData } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        setProducts(productsData || []);

        // Charger utilisateurs
        const { data: usersData } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
        setUsers(usersData || []);

        // Charger messages
        const { data: messagesData } = await supabase
            .from('messages')
            .select('*, users!messages_user_id_fkey(name, email)')
            .order('created_at', { ascending: false });
        setMessages(messagesData || []);

        // Charger statistiques
        const { data: ordersData } = await supabase
            .from('orders')
            .select('total');

        const totalSales = ordersData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

        setStats({
            totalSales,
            totalOrders: ordersData?.length || 0,
            totalUsers: usersData?.length || 0,
            totalProducts: productsData?.length || 0,
        });
    };

    // Fonction pour rafraîchir les données quand on tire vers le bas
    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    // Fonction pour éditer un produit (ouvrir la fenêtre d'édition)
    const handleEditProduct = (product: any) => {
        setEditingProduct(product || {
            name: '',
            price: '',
            category: '',
            image: '',
            mechanism: '',
            material: '',
            waterResistance: ''
        });
        setEditModalVisible(true);
    };

    // Fonction pour sauvegarder un produit (création ou mise à jour)
    const handleSaveProduct = async () => {
        if (!editingProduct.name || !editingProduct.price) {
            Alert.alert('Erreur', 'Nom et prix requis');
            return;
        }

        if (editingProduct.id) {
            // Mise à jour
            const { error } = await supabase
                .from('products')
                .update(editingProduct)
                .eq('id', editingProduct.id);

            if (!error) {
                Alert.alert('Succès', 'Produit mis à jour');
            }
        } else {
            // Création
            const { error } = await supabase
                .from('products')
                .insert([editingProduct]);

            if (!error) {
                Alert.alert('Succès', 'Produit créé');
            }
        }

        setEditModalVisible(false);
        await loadData();
    };

    // Fonction pour supprimer un produit
    const handleDeleteProduct = async (id: number) => {
        Alert.alert(
            'Confirmation',
            'Supprimer ce produit ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        const { error } = await supabase
                            .from('products')
                            .delete()
                            .eq('id', id);

                        if (!error) {
                            Alert.alert('Succès', 'Produit supprimé');
                            await loadData();
                        }
                    }
                }
            ]
        );
    };

    // Fonction pour supprimer un utilisateur
    const handleDeleteUser = async (id: string) => {
        Alert.alert(
            'Confirmation',
            'Supprimer cet utilisateur ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        const { error } = await supabase
                            .from('users')
                            .delete()
                            .eq('id', id);

                        if (!error) {
                            Alert.alert('Succès', 'Utilisateur supprimé');
                            await loadData();
                        }
                    }
                }
            ]
        );
    };

    // Fonction pour répondre à un message (ouvrir la fenêtre de réponse)
    const handleReplyMessage = (message: any) => {
        setSelectedMessage(message);
        setReplyContent('');
        setMessageReplyModalVisible(true);
    };

    // Fonction pour envoyer une réponse à un message
    const sendReply = async () => {
        if (!replyContent.trim()) return;

        const { error } = await supabase
            .from('messages')
            .insert([{
                user_id: selectedMessage.user_id,
                admin_id: user.id,
                content: replyContent,
                type: 'reply',
                parent_id: selectedMessage.id,
            }]);

        if (!error) {
            Alert.alert('Succès', 'Réponse envoyée');
            setMessageReplyModalVisible(false);
            await loadData();
        }
    };

    // Fonction pour supprimer un message
    const handleDeleteMessage = async (id: number) => {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id);

        if (!error) {
            await loadData(); // On recharge les messages après suppression
        }
    };

    // Ce que la page affiche
    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Pour rafraîchir la page en tirant vers le bas
            }
        >
            <Text style={styles.pageTitle}>Administration</Text>

            {/* Onglets pour naviguer entre les sections */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
                    onPress={() => setActiveTab('dashboard')}
                >
                    <Text style={styles.tabText}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'products' && styles.activeTab]}
                    onPress={() => setActiveTab('products')}
                >
                    <Text style={styles.tabText}>Produits</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'users' && styles.activeTab]}
                    onPress={() => setActiveTab('users')}
                >
                    <Text style={styles.tabText}>Utilisateurs</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'messages' && styles.activeTab]}
                    onPress={() => setActiveTab('messages')}
                >
                    <Text style={styles.tabText}>Messages</Text>
                </TouchableOpacity>
            </View>

            {/* Section Dashboard : statistiques */}
            {activeTab === 'dashboard' && (
                <>
                    <View style={styles.statsGrid}>
                        <View style={[styles.statCard, { backgroundColor: '#4CAF50' }]}> {/* Chiffre d'affaires */}
                            <MaterialIcons name="attach-money" size={30} color="#fff" />
                            <Text style={styles.statNumber}>{stats.totalSales.toLocaleString()}€</Text>
                            <Text style={styles.statLabel}>Chiffre d'affaires</Text>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: '#2196F3' }]}> {/* Commandes */}
                            <MaterialIcons name="shopping-cart" size={30} color="#fff" />
                            <Text style={styles.statNumber}>{stats.totalOrders}</Text>
                            <Text style={styles.statLabel}>Commandes</Text>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: '#FF9800' }]}> {/* Utilisateurs */}
                            <MaterialIcons name="people" size={30} color="#fff" />
                            <Text style={styles.statNumber}>{stats.totalUsers}</Text>
                            <Text style={styles.statLabel}>Utilisateurs</Text>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: '#9C27B0' }]}> {/* Produits */}
                            <MaterialIcons name="inventory" size={30} color="#fff" />
                            <Text style={styles.statNumber}>{stats.totalProducts}</Text>
                            <Text style={styles.statLabel}>Produits</Text>
                        </View>
                    </View>
                </>
            )}

            {/* Section Produits */}
            {activeTab === 'products' && (
                <View style={styles.productsContainer}>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleEditProduct(null)}
                    >
                        <MaterialIcons name="add" size={24} color="#fff" />
                        <Text style={styles.addButtonText}>Ajouter un produit</Text>
                    </TouchableOpacity>

                    {products.map(product => (
                        <View key={product.id} style={styles.productItem}>
                            <Image
                                source={{ uri: product.image || 'https://via.placeholder.com/60' }}
                                style={styles.productImage}
                            />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productPrice}>{product.price}€</Text>
                                <Text style={styles.productCategory}>{product.category}</Text>
                            </View>
                            <View style={styles.productActions}>
                                <TouchableOpacity onPress={() => handleEditProduct(product)}>
                                    <MaterialIcons name="edit" size={24} color="#d4af37" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeleteProduct(product.id)}>
                                    <MaterialIcons name="delete" size={24} color="#ff4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {/* Section Utilisateurs */}
            {activeTab === 'users' && (
                <View style={styles.usersContainer}>
                    {users.map(user => (
                        <View key={user.id} style={styles.userItem}>
                            <Image
                                source={{ uri: user.avatar || 'https://via.placeholder.com/50' }}
                                style={styles.userAvatar}
                            />
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{user.name || 'Sans nom'}</Text>
                                <Text style={styles.userEmail}>{user.email}</Text>
                                {user.is_admin && (
                                    <Text style={styles.adminBadge}>Admin</Text>
                                )}
                            </View>
                            {/* On ne peut pas supprimer un admin */}
                            {!user.is_admin && (
                                <TouchableOpacity onPress={() => handleDeleteUser(user.id)}>
                                    <MaterialIcons name="delete" size={24} color="#ff4444" />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* Section Messages */}
            {activeTab === 'messages' && (
                <View style={styles.messagesContainer}>
                    {messages.map(message => (
                        <View key={message.id} style={styles.messageItem}>
                            <View style={styles.messageHeader}>
                                <View>
                                    <Text style={styles.messageSender}>
                                        {message.users?.name || 'Utilisateur'}
                                    </Text>
                                    <Text style={styles.messageEmail}>
                                        {message.users?.email}
                                    </Text>
                                </View>
                                <Text style={styles.messageDate}>
                                    {new Date(message.created_at).toLocaleDateString()}
                                </Text>
                            </View>
                            <Text style={styles.messageContent}>{message.content}</Text>
                            <View style={styles.messageActions}>
                                {/* On ne peut répondre qu'aux messages qui ne sont pas des réponses */}
                                {message.type !== 'reply' && (
                                    <TouchableOpacity
                                        style={styles.replyButton}
                                        onPress={() => handleReplyMessage(message)}
                                    >
                                        <MaterialIcons name="reply" size={16} color="#fff" />
                                        <Text style={styles.replyButtonText}>Répondre</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity onPress={() => handleDeleteMessage(message.id)}>
                                    <MaterialIcons name="delete" size={20} color="#ff4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {/* Fenêtre pour éditer ou ajouter un produit */}
            <Modal
                visible={editModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {editingProduct?.id ? 'Modifier' : 'Ajouter'} un produit
                        </Text>

                        <ScrollView>
                            <TextInput
                                style={styles.input}
                                placeholder="Nom du produit"
                                value={editingProduct?.name}
                                onChangeText={(text) => setEditingProduct({ ...editingProduct, name: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Prix"
                                value={editingProduct?.price?.toString()}
                                onChangeText={(text) => setEditingProduct({ ...editingProduct, price: text })}
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Catégorie (classique, sport, luxe...)"
                                value={editingProduct?.category}
                                onChangeText={(text) => setEditingProduct({ ...editingProduct, category: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="URL de l'image"
                                value={editingProduct?.image}
                                onChangeText={(text) => setEditingProduct({ ...editingProduct, image: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Mécanisme"
                                value={editingProduct?.mechanism}
                                onChangeText={(text) => setEditingProduct({ ...editingProduct, mechanism: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Matériau"
                                value={editingProduct?.material}
                                onChangeText={(text) => setEditingProduct({ ...editingProduct, material: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Étanchéité"
                                value={editingProduct?.waterResistance}
                                onChangeText={(text) => setEditingProduct({ ...editingProduct, waterResistance: text })}
                            />
                        </ScrollView>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSaveProduct}
                            >
                                <Text style={styles.buttonText}>Sauvegarder</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal réponse message */}
            <Modal
                visible={messageReplyModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setMessageReplyModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Répondre au message</Text>

                        <View style={styles.originalMessage}>
                            <Text style={styles.originalMessageLabel}>Message original :</Text>
                            <Text style={styles.originalMessageContent}>
                                {selectedMessage?.content}
                            </Text>
                        </View>

                        <TextInput
                            style={[styles.input, styles.replyInput]}
                            placeholder="Votre réponse..."
                            value={replyContent}
                            onChangeText={setReplyContent}
                            multiline
                            numberOfLines={4}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setMessageReplyModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={sendReply}
                            >
                                <Text style={styles.buttonText}>Envoyer</Text>
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
    pageTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        padding: 20,
        paddingBottom: 10,
        color: '#333',
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 10,
        padding: 5,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#d4af37',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    statCard: {
        width: '48%',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginVertical: 10,
    },
    statLabel: {
        fontSize: 14,
        color: '#fff',
    },
    productsContainer: {
        paddingHorizontal: 20,
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: '#d4af37',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    productItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 15,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    productPrice: {
        fontSize: 14,
        color: '#d4af37',
        fontWeight: 'bold',
    },
    productCategory: {
        fontSize: 12,
        color: '#666',
    },
    productActions: {
        flexDirection: 'row',
        gap: 15,
    },
    usersContainer: {
        paddingHorizontal: 20,
    },
    userItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
    },
    adminBadge: {
        fontSize: 12,
        color: '#d4af37',
        fontWeight: 'bold',
        marginTop: 2,
    },
    messagesContainer: {
        paddingHorizontal: 20,
    },
    messageItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    messageSender: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    messageEmail: {
        fontSize: 12,
        color: '#666',
    },
    messageDate: {
        fontSize: 12,
        color: '#666',
    },
    messageContent: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
    },
    messageActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    replyButton: {
        flexDirection: 'row',
        backgroundColor: '#d4af37',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignItems: 'center',
    },
    replyButtonText: {
        color: '#fff',
        marginLeft: 5,
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    replyInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    originalMessage: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    originalMessageLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    originalMessageContent: {
        fontSize: 14,
        color: '#333',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#999',
    },
    saveButton: {
        backgroundColor: '#d4af37',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
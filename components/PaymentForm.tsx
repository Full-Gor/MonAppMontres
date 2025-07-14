import { MaterialIcons } from '@expo/vector-icons';
import {
    CardField,
    CardFieldInput,
    useStripe,
} from '@stripe/stripe-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  onSuccess,
  onCancel,
}) => {
  const { confirmPayment } = useStripe();
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(null);

  const handlePayment = async () => {
    if (!cardDetails?.complete) {
      Alert.alert('Erreur', 'Veuillez entrer des informations de carte valides');
      return;
    }

    setLoading(true);

    try {
      // TODO: Appeler votre backend pour créer un PaymentIntent
      // Pour l'instant, on simule le paiement
      Alert.alert(
        'Paiement simulé',
        'Dans une vraie app, ceci appellerait votre backend pour créer un PaymentIntent avec Stripe',
        [
          {
            text: 'OK',
            onPress: () => onSuccess('payment_intent_simulé'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Le paiement a échoué');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="lock" size={24} color="#4CAF50" />
        <Text style={styles.headerText}>Paiement sécurisé</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Montant total</Text>
        <Text style={styles.amountValue}>{amount}€</Text>
      </View>

      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
          borderWidth: 1,
          borderColor: '#E0E0E0',
          borderRadius: 8,
        }}
        style={styles.cardField}
        onCardChange={(cardDetails) => {
          setCardDetails(cardDetails);
        }}
      />

      <Text style={styles.testInfo}>
        💡 Carte de test : 4242 4242 4242 4242
      </Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.payButton, loading && styles.disabledButton]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="payment" size={20} color="#fff" />
              <Text style={styles.payButtonText}>Payer {amount}€</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.securityInfo}>
        <MaterialIcons name="security" size={16} color="#666" />
        <Text style={styles.securityText}>
          Vos informations de paiement sont cryptées et sécurisées
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  amountContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
  },
  amountValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d4af37',
    marginTop: 5,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 20,
  },
  testInfo: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  payButton: {
    flex: 2,
    backgroundColor: '#d4af37',
    padding: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
}); 
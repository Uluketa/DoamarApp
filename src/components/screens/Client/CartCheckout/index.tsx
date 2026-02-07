import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { RootState } from '~/store';
import { RootStackParamList } from '~/types/Navigation';
import { IMAGE_BASE_URL } from '~/api';
import { clearCart } from '~/store/modules/cart/actions';

import Toast from 'react-native-toast-message';
import { colors } from '~/styles/colors';

export const CartCheckout = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const { items, institution } = useSelector((state: RootState) => state.cart);
  const { userData, token } = useSelector((state: RootState) => state.user);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const isValid = useMemo(() => {
    return items.length > 0 && institution && userData?.client;
  }, [items, institution, userData]);

  const handleSubmitDonations = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const donations = items.map(item => ({
        user_id: userData.id,
        order_id: item.id,
        quantity: item.quantity,
      }));

      const { createBulkDonations } = await import('~/api');
      const response = await createBulkDonations(donations, token);

      if (response.ok === 'S') {
        Toast.show({
          type: 'success',
          text1: 'Doações realizadas!',
          text2: 'Obrigado por ajudar 💙',
        });

        dispatch(clearCart());
        setConfirmModal(false);
        navigation.navigate('Layout');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao confirmar doações',
          text2: response.msg || 'Tente novamente.',
        });
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Erro inesperado',
        text2: 'Não foi possível concluir a doação.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔹 Carrinho vazio
  if (itemCount === 0) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
        <Ionicons name="cart-outline" size={80} color={colors.border} />
        <Text className="text-2xl font-bold mt-4" style={{ color: colors.text }}>
          Carrinho vazio
        </Text>
        <Text className="mt-2 text-center px-8" style={{ color: colors.text + 'AA' }}>
          Adicione itens antes de continuar
        </Text>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-8 bg-blue-500 px-8 py-3 rounded-lg"
        >
          <Text className="text-white font-bold">Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="p-6 border-b" style={{ backgroundColor: colors.palette[1] + '15', borderColor: colors.border }}>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-semibold" style={{ color: colors.text + 'AA' }}>
                CONFIRMAÇÃO
              </Text>
              <Text className="text-2xl font-bold mt-1" style={{ color: colors.text }}>
                {itemCount} item(ns)
              </Text>
            </View>
            <Ionicons name="gift-outline" size={40} color={colors.palette[1]} />
          </View>
        </View>

        {/* Instituição */}
        {institution && (
          <View className="p-6 border-b" style={{ borderColor: colors.border }}>
            <Text className="text-sm font-semibold mb-2" style={{ color: colors.text + 'AA' }}>
              ENVIANDO PARA
            </Text>

            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-lg font-bold" style={{ color: colors.text }}>
                  {institution.name}
                </Text>
                <Text className="text-sm" style={{ color: colors.text + 'AA' }}>
                  {institution.email}
                </Text>
              </View>

              {institution.pathLogoImage && (
                <Image
                  source={{ uri: `${IMAGE_BASE_URL}${institution.pathLogoImage}` }}
                  style={{ width: 80, height: 40, resizeMode: 'contain' }}
                />
              )}
            </View>
          </View>
        )}

        {/* Itens */}
        <View className="p-6">
          <Text className="text-sm font-semibold mb-4" style={{ color: colors.text + 'AA' }}>
            ITENS A DOAR
          </Text>

          {items.map((item, index) => (
            <View
              key={`${item.id}-${index}`}
              className="mb-4 p-4 rounded-lg border"
              style={{ borderColor: colors.border, backgroundColor: colors.background + '15' }}
            >
              <View className="flex-row justify-between">
                <View className="flex-1">
                  <Text className="font-bold text-base" style={{ color: colors.text }}>
                    {item.name}
                  </Text>

                  {item.description && (
                    <Text className="text-sm mt-1" style={{ color: colors.text + 'AA' }}>
                      {item.description}
                    </Text>
                  )}
                </View>

                <Text className="text-xl font-bold text-blue-500">×{item.quantity}</Text>
              </View>

              {item.has_limit && item.limit && item.quantity > item.limit && (
                <View className="mt-2 flex-row items-center gap-1">
                  <Ionicons name="warning" size={14} color="#f59e0b" />
                  <Text className="text-xs text-yellow-600">
                    Limite máximo: {item.limit}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="p-6 pb-8 border-t" style={{ borderColor: colors.border }}>
        <TouchableOpacity
          onPress={() => setConfirmModal(true)}
          disabled={!isValid || isSubmitting}
          className="py-4 rounded-lg flex-row items-center justify-center"
          style={{ backgroundColor: isValid ? colors.primary : colors.border }}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white font-bold ml-2 text-lg">
                Confirmar Doação
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal visible={confirmModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-2xl w-[85%] overflow-hidden">
            <View className="p-6 items-center" style={{ backgroundColor: colors.palette[1] + '15' }}>
              <Ionicons name="alert-circle" size={48} color={colors.palette[1]} />
              <Text className="text-lg font-bold mt-4 text-center">
                Confirmar doação?
              </Text>
            </View>

            <View className="p-6">
              <Text className="text-center mb-4" style={{ color: colors.text }}>
                Deseja confirmar a doação para:
              </Text>

              <Text className="font-bold text-center text-lg mb-6">
                {institution?.name}
              </Text>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setConfirmModal(false)}
                  className="flex-1 py-3 border rounded-lg"
                  style={{ borderColor: colors.border }}
                >
                  <Text className="text-center font-bold" style={{ color: colors.text }}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmitDonations}
                  className="flex-1 py-3 rounded-lg bg-blue-500"
                >
                  <Text className="text-center font-bold text-white">
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

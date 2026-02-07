import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '~/types/Navigation';
import { RootState } from '~/store';
import { updateCartItemQuantity, removeCartItem, clearCart } from '~/store/modules/cart/actions';

import Toast from 'react-native-toast-message';
import { colors } from '~/styles/colors';
import { IMAGE_BASE_URL } from '~/api';

export const ClientCart = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const { items, institution } = useSelector((state: RootState) => state.cart);

    // Calcular totais
    const itemCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);
    const hasItems = items.length > 0;

    const handleQuantityChange = (orderId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            dispatch(removeCartItem(orderId));
            Toast.show({
                type: 'info',
                text1: 'Item removido do carrinho'
            });
        } else {
            dispatch(updateCartItemQuantity({ orderId, quantity: newQuantity }));
        }
    };

    const handleClearCart = () => {
        dispatch(clearCart());
        Toast.show({
            type: 'info',
            text1: 'Carrinho limpo'
        });
    };

    const handleCheckout = () => {
        if (!hasItems) {
            Toast.show({
                type: 'error',
                text1: 'Carrinho vazio',
                text2: 'Adicione itens antes de prosseguir'
            });
            return;
        }

        navigation.navigate('CartCheckout');
    };

    // Carrinho Vazio
    if (!hasItems) {
        return (
            <View
                className='flex-1 justify-center items-center'
                style={{ backgroundColor: colors.background }}
            >
                <Ionicons name="cart-outline" size={80} color={colors.border} />
                <Text className='text-2xl font-bold mt-4' style={{ color: colors.text }}>Carrinho Vazio</Text>
                <Text style={{ color: colors.text + 'AA' }} className="mt-2 text-center px-8">
                    Adicione itens de uma instituição para começar
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Layout')}
                    className='mt-8 bg-blue-500 px-8 py-3 rounded-lg'
                >
                    <Text className='text-white font-bold'>Continuar Explorando</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Carrinho com itens
    return (
        <View className='flex-1' style={{ backgroundColor: colors.background }}>
            {/* Header */}
            <View className='p-6 border-b' style={{ backgroundColor: colors.palette[1] + '15', borderColor: colors.border }}>
                <View className='flex-row items-center justify-between'>
                    <View>
                        <Text className='text-sm font-semibold' style={{ color: colors.text + 'AA' }}>CARRINHO</Text>
                        <Text className='text-2xl font-bold mt-1' style={{ color: colors.text }}>{itemCount} item(ns)</Text>
                    </View>
                    <Ionicons name="cart" size={40} color={colors.palette[1]} />
                </View>
            </View>

            <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                {/* Instituição */}
                {institution && (
                    <View className='p-6 border-b' style={{ backgroundColor: colors.background + '15', borderColor: colors.border }}>
                        <Text className='text-sm font-semibold mb-2' style={{ color: colors.text + 'AA' }}>ENVIANDO PARA</Text>
                        <View className='flex-row items-center'>
                            <View className='flex-1'>
                                <Text className='text-lg font-bold' style={{ color: colors.text }}>{institution.name}</Text>
                                <Text className='text-sm' style={{ color: colors.text + 'AA' }}>{institution.email}</Text>
                            </View>
                            {institution.pathLogoImage && (
                                <Image
                                    source={{ uri: institution.pathLogoImage ? `${IMAGE_BASE_URL}${institution.pathLogoImage}` : undefined }}
                                    style={{ width: 80, height: 40, resizeMode: 'contain' }}
                                    
                                />
                            )}
                        </View>
                    </View>
                )}

                {/* Itens do Carrinho */}
                <View className='p-6'>
                    <Text className='text-sm font-semibold mb-4' style={{ color: colors.text + 'AA' }}>ITENS ({items.length})</Text>

                    {items.map((item, index) => (
                        <View key={`${item.id}-${index}`} className='mb-4 p-4 rounded-lg border' style={{ borderColor: colors.border, backgroundColor: colors.background + '15' }}>
                            <View className='flex-row items-center justify-between'>
                                <View className='flex-1'>
                                    <Text className='text-base font-bold line-clamp-1' style={{ color: colors.text }}>{item.name}</Text>
                                    {item.description && (
                                        <Text className='text-sm mt-1' style={{ color: colors.text + 'AA' }} numberOfLines={1}>
                                            {item.description}
                                        </Text>
                                    )}

                                    {/* Alerta de limite */}
                                    {item.has_limit && item.limit && item.quantity > item.limit && (
                                        <View className='mt-2 flex-row items-center gap-1'>
                                            <Ionicons name="warning" size={14} color="#f59e0b" />
                                            <Text className='text-xs text-yellow-600'>
                                                Limite: {item.limit}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {/* Controles de Quantidade */}
                                <View className='ml-4 flex-row items-center rounded-lg border' style={{ borderColor: colors.border, backgroundColor: colors.background + '15' }}>
                                    <TouchableOpacity
                                        onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        className='px-3 py-2'
                                    >
                                        <Text className='text-lg font-bold' style={{ color: colors.text + 'AA' }}>−</Text>
                                    </TouchableOpacity>

                                    <View className='px-4 py-2 border-l border-r' style={{ borderLeftColor: colors.border, borderRightColor: colors.border }}>
                                        <Text className='text-lg font-bold text-center w-8' style={{ color: colors.text }}>{item.quantity}</Text>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                                        className='px-3 py-2'
                                    >
                                        <Text className='text-lg font-bold' style={{ color: colors.text + 'AA' }}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Remover Item */}
                            <TouchableOpacity
                                onPress={() => handleQuantityChange(item.id, 0)}
                                className='mt-3 flex-row items-center justify-center py-2'
                            >
                                <Ionicons name="trash-outline" size={16} color="#ef4444" />
                                <Text className='text-sm text-red-500 font-semibold ml-2'>Remover</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Instruções */}
                <View className='px-6 py-4 mx-6 rounded-lg mb-6' style={{ backgroundColor: colors.palette[1] + '15' }}>
                    <View className='flex-row items-center mb-2'>
                        <Ionicons name="information-circle" size={18} color={colors.palette[1]} />
                        <Text className='font-semibold ml-2' style={{ color: colors.text + 'CC' }}>Informações</Text>
                    </View>
                    <Text className='text-sm ml-8' style={{ color: colors.text + 'AA' }}>
                        A instituição receberá notificação de cada doação
                    </Text>
                </View>
            </ScrollView>

            {/* Footer - Ações */}
            <View className='p-6 pb-8 border-t' style={{ backgroundColor: colors.background, borderTopColor: colors.border }}>
                <TouchableOpacity
                    onPress={handleCheckout}
                    className=' py-4 rounded-lg flex-row items-center justify-center mb-3'
                    style={{ backgroundColor: colors.primary }}
                >
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                    <Text className='text-white font-bold ml-2 text-lg'>
                        Confirmar Doação ({itemCount})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleClearCart}
                    className='py-3 px-6 border-2 border-red-300 rounded-lg'
                >
                    <Text className='text-center text-red-600 font-bold'>Limpar Carrinho</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

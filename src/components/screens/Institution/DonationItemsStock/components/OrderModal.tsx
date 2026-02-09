import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  Linking,
  Animated,
  PanResponder,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { LabeledTextInput } from '~/components/LabeledTextInput';
import { ORDER_TYPES, ORDER_TYPE_ID } from '~/constants/orderTypes';
import { Order } from '~/types/entities/Order';
import colors from '~/styles/colors';

export type OrderModalSavePayload = {
  name: string;
  description?: string;
  has_limit: boolean;
  limit?: number | null;
  image_url?: string | null;
  order_type_id: number;
  status: Order['status'];
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (payload: OrderModalSavePayload) => void | Promise<unknown>;
  institutionId?: number;
  order?: Order | null;
};

const ORDER_TYPE_ENTRIES = [
  { id: ORDER_TYPE_ID.ALIMENTOS, name: ORDER_TYPES[ORDER_TYPE_ID.ALIMENTOS].name },
  { id: ORDER_TYPE_ID.UTENSILIOS, name: ORDER_TYPES[ORDER_TYPE_ID.UTENSILIOS].name },
  { id: ORDER_TYPE_ID.ROUPAS, name: ORDER_TYPES[ORDER_TYPE_ID.ROUPAS].name },
  { id: ORDER_TYPE_ID.HIGIENE, name: ORDER_TYPES[ORDER_TYPE_ID.HIGIENE].name },
  { id: ORDER_TYPE_ID.MATERIAL_ESCOLAR, name: ORDER_TYPES[ORDER_TYPE_ID.MATERIAL_ESCOLAR].name },
];

export default function OrderModal({
  visible,
  onClose,
  onSave,
  institutionId,
  order,
}: Props) {
  const translateY = useRef(new Animated.Value(0)).current;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hasLimit, setHasLimit] = useState(false);
  const [limit, setLimit] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [orderTypeId, setOrderTypeId] = useState(ORDER_TYPE_ID.ALIMENTOS);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Order['status']>('available');

  useEffect(() => {
    if (!visible) return;

    if (order) {
      console.log(order)
      setName(order.name);
      setDescription(order.description ?? '');
      setHasLimit(order.has_limit ? true : false);
      setLimit(order.limit ? String(order.limit) : '');
      setImageUrl(order.image_url ?? '');
      setOrderTypeId(order.order_type.id);
      setStatus(order.status);
    } else {
      setName('');
      setDescription('');
      setHasLimit(false);
      setLimit('');
      setImageUrl('');
      setOrderTypeId(ORDER_TYPE_ID.ALIMENTOS);
      setStatus('available');
    }
  }, [visible, order]);


  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: 600,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      translateY.setValue(0);
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,

      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },

      onPanResponderRelease: (_, g) => {
        if (g.dy > 140) {
          closeSheet();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Informe o nome do produto.');
      return;
    }
    const payload: OrderModalSavePayload = {
      name: name.trim(),
      description: description.trim() || undefined,
      has_limit: hasLimit,
      limit: hasLimit ? Number(limit) || null : null,
      image_url: imageUrl.trim() || null,
      order_type_id: orderTypeId,
      status: status,
    };
    if (institutionId != null) {
      setSaving(true);
      try {
        const result = await onSave(payload);
        const res = result as { ok?: string } | undefined;
        if (res?.ok === 'S') {
          closeSheet();
        }
      } finally {
        setSaving(false);
      }
    } else {
      (onSave as (p: OrderModalSavePayload) => void)(payload);
      closeSheet();
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <View className="flex-1">
        {/* Backdrop */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeSheet}
          className="absolute inset-0 bg-black/50"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end"
        >

          {/* Sheet */}
          <View
            className="rounded-t-3xl px-6 pt-3"
            style={{ maxHeight: '75%', backgroundColor: colors.card }}
          >
            {/* Handle */}
            <View className="w-12 h-1.5 rounded-full self-center mb-4" style={{ backgroundColor: colors.secondary }} />

            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold" style={{ color: colors.text }}>
                {order ? 'Editar pedido' : 'Novo pedido'}
              </Text>

              <TouchableOpacity onPress={closeSheet}>
                <Ionicons name="close" size={26} color={colors.secondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32 }}
            >
              <LabeledTextInput
                label="Produto"
                value={name}
                onChangeText={setName}
                placeholder="Ex: Arroz, Feijão, Cesta básica"
                placeholderTextColor={colors.secondary}
              />

              <LabeledTextInput
                label="Descrição"
                value={description}
                onChangeText={setDescription}
                multiline
                placeholder="Descreva o produto e suas condições"
                placeholderTextColor={colors.secondary}
              />

              <View className="my-4 border-t pt-4" style={{ borderColor: colors.border }}>
                <Text className="mb-2 font-bold text-lg" style={{ color: colors.text }}>Tipo do pedido</Text>
                <View className="flex-row flex-wrap gap-2">
                  {ORDER_TYPE_ENTRIES.map(({ id, name: typeName }) => (
                    <TouchableOpacity
                      key={id}
                      onPress={() => setOrderTypeId(id)}
                      className="px-4 py-2 rounded-full"
                      style={{ backgroundColor: orderTypeId === id ? colors.primary : colors.background }}
                    >
                      <Text
                        className="font-semibold"
                        style={{ color: orderTypeId === id ? '#f0f0f0' : colors.secondary }}
                      >
                        {typeName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="border-t pt-4" style={{ borderColor: colors.border }}>
                <View className="flex-row justify-between items-center my-4">
                  <Text className="font-bold text-lg" style={{ color: colors.text }}>
                    Tem limite?
                  </Text>

                  <Switch
                    value={hasLimit}
                    onValueChange={setHasLimit}
                    thumbColor={hasLimit ? colors.primary : colors.secondary}
                    trackColor={{ false: colors.background, true: colors.background }}
                    ios_backgroundColor={colors.background}
                  />
                </View>

                {hasLimit && (
                  <LabeledTextInput
                    label="Limite"
                    value={limit}
                    onChangeText={setLimit}
                    keyboardType="numeric"
                    placeholder="Ex: 100 unidades"
                    placeholderTextColor={colors.secondary}
                  />
                )}
              </View>

              <View className="my-4">
                <Text className="pt-4 mb-2 font-bold text-lg border-t" style={{ color: colors.text, borderTopColor: colors.border }}>
                  URL da imagem
                </Text>

                <LabeledTextInput
                  label="Imagem"
                  value={imageUrl}
                  onChangeText={setImageUrl}
                  placeholder="https://exemplo.com/imagem.png"
                  autoCapitalize="none"
                  placeholderTextColor={colors.secondary}
                />

                {imageUrl.startsWith('http') && (
                  <View className="mt-3 items-center">
                    <Image
                      source={{ uri: imageUrl }}
                      className="w-full h-40 rounded-xl p-4 elevation-2"
                      resizeMode="contain"
                    />
                  </View>
                )}
              </View>

              <View className="my-4 border-t pt-4" style={{ borderColor: colors.border }}>
                <Text className="mb-2 font-bold text-lg" style={{ color: colors.text }}>
                  Status do pedido
                </Text>

                <View className="flex-row gap-3">
                  {(['available', 'completed', 'canceled'] as const).map(s => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => setStatus(s)}
                      className="px-4 py-2 rounded-full"
                      style={{ backgroundColor: status === s ? colors.primary : colors.background }}
                    >
                      <Text className='font-bold' style={{ color: status === s ? '#f0f0f0' : colors.secondary }}>
                        {s === 'available' ? 'Disponível' : s === 'completed' ? 'Concluído' : 'Cancelado'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                className="bg-green-600 py-4 rounded-xl items-center mt-4"
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-white font-bold text-lg">
                    {order ? 'Salvar alterações' : 'Salvar pedido'}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

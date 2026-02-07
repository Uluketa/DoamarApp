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
} from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { LabeledTextInput } from '~/components/LabeledTextInput';
import { ORDER_TYPES, ORDER_TYPE_ID } from '~/constants/orderTypes';

export type OrderModalSavePayload = {
  name: string;
  description?: string;
  has_limit: boolean;
  limit?: number | null;
  image_url?: string | null;
  order_type_id: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (payload: OrderModalSavePayload) => void | Promise<unknown>;
  institutionId?: number;
};

const ORDER_TYPE_ENTRIES = [
  { id: ORDER_TYPE_ID.ALIMENTOS, name: ORDER_TYPES[ORDER_TYPE_ID.ALIMENTOS].name },
  { id: ORDER_TYPE_ID.UTENSILIOS, name: ORDER_TYPES[ORDER_TYPE_ID.UTENSILIOS].name },
  { id: ORDER_TYPE_ID.ROUPAS, name: ORDER_TYPES[ORDER_TYPE_ID.ROUPAS].name },
  { id: ORDER_TYPE_ID.HIGIENE, name: ORDER_TYPES[ORDER_TYPE_ID.HIGIENE].name },
  { id: ORDER_TYPE_ID.MATERIAL_ESCOLAR, name: ORDER_TYPES[ORDER_TYPE_ID.MATERIAL_ESCOLAR].name },
];

export default function OrderModal({ visible, onClose, onSave, institutionId }: Props) {
  const translateY = useRef(new Animated.Value(0)).current;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hasLimit, setHasLimit] = useState(false);
  const [limit, setLimit] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [orderTypeId, setOrderTypeId] = useState(ORDER_TYPE_ID.ALIMENTOS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setName('');
      setDescription('');
      setHasLimit(false);
      setLimit('');
      setImage(null);
      setOrderTypeId(ORDER_TYPE_ID.ALIMENTOS);
    }
  }, [visible]);

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
      image_url: image?.startsWith('http') ? image : null,
      order_type_id: orderTypeId,
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

  const pickImage = async () => {
    const permission = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      const request = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!request.granted) {
        Alert.alert(
          'Permissão necessária',
          'Para adicionar uma imagem, permita o acesso às suas fotos.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir configurações', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 justify-end">
        {/* Backdrop */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeSheet}
          className="absolute inset-0 bg-black/50"
        />

        {/* Sheet */}
        <Animated.View
          {...panResponder.panHandlers}
          style={{ transform: [{ translateY }] }}
          className="bg-white rounded-t-3xl px-6 pt-3 pb-12"
        >
          {/* Handle */}
          <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4" />

          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold">
              Novo pedido
            </Text>

            <TouchableOpacity onPress={closeSheet}>
              <Ionicons name="close" size={26} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <LabeledTextInput
            label="Produto"
            value={name}
            onChangeText={setName}
            placeholder="Ex: Arroz, Feijão, Cesta básica"
            placeholderTextColor="#888"
          />

          <LabeledTextInput
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Descreva o produto e suas condições"
            placeholderTextColor="#888"
          />

          <View className="my-4">
            <Text className="mb-2 font-bold text-lg">Tipo do pedido</Text>
            <View className="flex-row flex-wrap gap-2">
              {ORDER_TYPE_ENTRIES.map(({ id, name: typeName }) => (
                <TouchableOpacity
                  key={id}
                  onPress={() => setOrderTypeId(id)}
                  className={`px-4 py-2 rounded-full ${
                    orderTypeId === id ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      orderTypeId === id ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {typeName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="flex-row justify-between items-center my-4">
            <Text className="font-bold text-lg">
              Tem limite?
            </Text>

            <Switch value={hasLimit} onValueChange={setHasLimit} />
          </View>

          {hasLimit && (
            <LabeledTextInput
              label="Limite"
              value={limit}
              onChangeText={setLimit}
              keyboardType="numeric"
              placeholder="Ex: 100 unidades"
              placeholderTextColor="#888"
            />
          )}

          {/* Imagem */}
          <View className="my-4">
            <Text className="mb-2 font-bold text-lg">
              Imagem do produto
            </Text>

            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.8}
              className={`flex-row items-center gap-4 border-2 rounded-xl p-3 ${
                image ? 'border-green-600' : 'border-gray-300'
              }`}
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  className="w-20 h-20 rounded-lg"
                />
              ) : (
                <View className="w-20 h-20 rounded-lg bg-gray-100 items-center justify-center">
                  <Ionicons name="image-outline" size={26} color="#6b7280" />
                </View>
              )}

              <View className="flex-1">
                <Text className="font-semibold">
                  {image ? 'Imagem selecionada' : 'Adicionar imagem'}
                </Text>
                <Text className="text-gray-500 text-sm">
                  Toque para escolher da galeria
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
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
                Salvar pedido
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

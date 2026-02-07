import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';

import { RootStackParamList } from '~/types/Navigation';
import { RootState } from '~/store';
import { updateClientProfile, fetchCepData, IMAGE_BASE_URL } from '~/api';
import { PATH_CLIENT_PHOTO } from '~/core/helpers';
import { updateClientData } from '~/store/modules/user/actions';

import { LabeledTextInput } from '~/components/LabeledTextInput';
import { BtnText as ButtonSalvar } from '~/components/Button';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { colors } from '~/styles/colors';

type EditProfileProps = {
    navigation: StackNavigationProp<RootStackParamList, 'EditProfile'>
};

interface EditFormData {
    name: string;
    email: string;
    cellphone: string;
    cpf: string;
    addressLine: string;
    addressNumber: string;
    addressCep: string;
    addressCity: string;
    addressState: string;
    addressNeighborhood: string;
    addressComplement: string;
    addressReference: string;
}

export default function EditProfile() {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const { userData, token } = useSelector((state: RootState) => state.user);

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [imageModal, setImageModal] = useState(false);

    const [formData, setFormData] = useState<EditFormData>({
        name: userData.client?.name || '',
        email: userData.client?.email || '',
        cellphone: userData.client?.cellphone || '',
        cpf: userData.client?.cpf || '',
        addressLine: userData.client?.addressLine || '',
        addressNumber: userData.client?.addressNumber || '',
        addressCep: userData.client?.addressCep || '',
        addressCity: userData.client?.addressCity || '',
        addressState: userData.client?.addressState || '',
        addressNeighborhood: userData.client?.addressNeighborhood || '',
        addressComplement: userData.client?.addressComplement || '',
        addressReference: userData.client?.addressReference || '',
    });

    // Carregar imagem de perfil salva no servidor (URL completa)
    useEffect(() => {
        if (userData.client?.pathProfileImage) {
            const path = userData.client.pathProfileImage.startsWith('/')
                ? userData.client.pathProfileImage
                : `/${userData.client.pathProfileImage}`;
            setProfileImage(`${IMAGE_BASE_URL}${path}`);
        }
    }, [userData.client?.pathProfileImage]);

    const handleCepChange = async (cep: string) => {
        if (cep.length === 8) {
            const result = await fetchCepData(cep);
            if (result.ok === 'S') {
                setFormData(prev => ({
                    ...prev,
                    addressLine: result.logradouro || '',
                    addressNeighborhood: result.bairro || '',
                    addressCity: result.cidade || '',
                    addressState: result.uf || '',
                    addressComplement: result.complemento || '',
                }));
            }
        }
    };

    const pickImage = async (source: 'camera' | 'gallery') => {
        try {
            let result;

            if (source === 'camera') {
                const permission = await ImagePicker.requestCameraPermissionsAsync();
                if (!permission.granted) {
                    Toast.show({
                        type: 'error',
                        text1: 'Permissão necessária',
                        text2: 'Você precisa permitir acesso à câmera.'
                    });
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });
            } else {
                const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!permission.granted) {
                    Toast.show({
                        type: 'error',
                        text1: 'Permissão necessária',
                        text2: 'Você precisa permitir acesso à galeria.'
                    });
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });
            }

            if (!result.canceled && result.assets[0]) {
                setProfileImage(result.assets[0].uri);
                setImageModal(false);
            }
        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Erro ao selecionar imagem.'
            });
        }
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Nome é obrigatório.'
            });
            return false;
        }

        if (!formData.email.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Email é obrigatório.'
            });
            return false;
        }

        if (!formData.cellphone.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Telefone é obrigatório.'
            });
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setIsSaving(true);
        try {
            // Preparar imagem se houver (aceita file://, content://, data: ou qualquer URI não-http)
            let imageData = null;
            if (profileImage && !profileImage.startsWith('http://') && !profileImage.startsWith('https://')) {
                // Se for data URI, tente extrair o tipo
                let mimeType = 'image/jpeg';
                if (profileImage.startsWith('data:')) {
                    const match = profileImage.match(/^data:(image\/[a-zA-Z]+);base64,/);
                    if (match && match[1]) mimeType = match[1];
                }

                imageData = {
                    uri: profileImage,
                    type: mimeType,
                    name: `profile-${userData.client?.id}.jpg`
                };
            }

            // Atualizar perfil com ou sem imagem
            const updateResponse = await updateClientProfile(
                userData.client?.id || 0,
                {
                    name: formData.name,
                    email: formData.email,
                    cellphone: formData.cellphone,
                    cpf: formData.cpf,
                    addressLine: formData.addressLine,
                    addressNumber: formData.addressNumber,
                    addressCep: formData.addressCep,
                    addressCity: formData.addressCity,
                    addressState: formData.addressState,
                    addressNeighborhood: formData.addressNeighborhood,
                    addressComplement: formData.addressComplement,
                    addressReference: formData.addressReference,
                },
                imageData,
                token
            );

            if (updateResponse.ok === 'N') {
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: updateResponse.msg || 'Erro ao atualizar perfil.'
                });
                setIsSaving(false);
                return;
            }

            // Atualizar Redux com dados novos (aceita data.client ou data)
            const updatedClient = updateResponse.data?.client || updateResponse.data;
            if (updatedClient) {
                dispatch(updateClientData(updatedClient));
            }

            Toast.show({
                type: 'success',
                text1: 'Sucesso!',
                text2: 'Perfil atualizado com sucesso.'
            });

            // Voltar
            navigation.goBack();

        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Erro ao salvar alterações.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView className="flex-1 px-7 py-6" style={{ backgroundColor: colors.background }}>
                {/* Foto de Perfil */}
                <View className="items-center mb-8">
                    <TouchableOpacity
                        onPress={() => setImageModal(true)}
                        className="w-36 h-36 items-center justify-center rounded-full"
                        style={{ backgroundColor: colors.border }}
                    >
                        {profileImage ? (
                            <Image
                                source={{ uri: profileImage }}
                                resizeMode="cover"
                                className='z-10 rounded-full overflow-hidden w-32 h-32'
                            />
                        ) : (
                            <Ionicons name="person" size={64} color="#999" />
                        )}
                        <View className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-2 z-50">
                            <Ionicons name="camera" size={18} color="white" />
                        </View>
                    </TouchableOpacity>
                    <Text className="mt-3 text-sm text-gray-500">Toque para alterar foto</Text>
                </View>

                {/* Formulário */}
                <View className="w-full text-center mb-6 flex-row items-center justify-center border-t pt-4" style={{ borderColor: colors.border }}>
                    <Ionicons name="person-outline" size={16} color={colors.text} />
                    <Text className="ml-2 text-lg font-bold" style={{ color: colors.text }}>
                        Informações Pessoais
                    </Text>
                </View>

                <LabeledTextInput
                    label="Nome Completo"
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Seu nome completo"
                />

                <LabeledTextInput
                    label="Email"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholder="seu@email.com"
                    keyboardType="email-address"
                />

                <LabeledTextInput
                    label="Telefone"
                    value={formData.cellphone}
                    onChangeText={(text) => setFormData({ ...formData, cellphone: text })}
                    placeholder="(11) 99999-9999"
                    keyboardType="phone-pad"
                />

                <LabeledTextInput
                    label="CPF"
                    value={formData.cpf}
                    onChangeText={(text) => setFormData({ ...formData, cpf: text })}
                    placeholder="000.000.000-00"
                    editable={false}
                />

                {/* Endereço */}
                <View className="w-full text-center mb-6 mt-4 flex-row items-center justify-center border-t pt-4" style={{ borderColor: colors.border }}>
                    <Ionicons name="location-outline" size={16} color={colors.text} />
                    <Text className='ml-2 text-lg font-bold' style={{ color: colors.text }}>Endereço</Text>
                </View>

                <LabeledTextInput
                    label="CEP"
                    value={formData.addressCep}
                    onChangeText={(text) => {
                        setFormData({ ...formData, addressCep: text });
                        handleCepChange(text.replace(/\D/g, ''));
                    }}
                    placeholder="00000-000"
                    keyboardType="number-pad"
                />

                <LabeledTextInput
                    label="Logradouro"
                    value={formData.addressLine}
                    onChangeText={(text) => setFormData({ ...formData, addressLine: text })}
                    placeholder="Rua, Avenida, etc"
                />

                <View className="flex-row gap-4 mb-4">
                    <View className="flex-1">
                        <LabeledTextInput
                            label="Número"
                            value={formData.addressNumber}
                            onChangeText={(text) => setFormData({ ...formData, addressNumber: text })}
                            placeholder="123"
                            keyboardType="number-pad"
                        />
                    </View>
                    <View className="flex-1">
                        <LabeledTextInput
                            label="UF"
                            value={formData.addressState}
                            onChangeText={(text) => setFormData({ ...formData, addressState: text.toUpperCase() })}
                            maxLength={2}
                            placeholder="SP"
                        />
                    </View>
                </View>

                <LabeledTextInput
                    label="Bairro"
                    value={formData.addressNeighborhood}
                    onChangeText={(text) => setFormData({ ...formData, addressNeighborhood: text })}
                    placeholder="Seu bairro"
                />

                <LabeledTextInput
                    label="Cidade"
                    value={formData.addressCity}
                    onChangeText={(text) => setFormData({ ...formData, addressCity: text })}
                    placeholder="Sua cidade"
                />

                <LabeledTextInput
                    label="Complemento"
                    value={formData.addressComplement}
                    onChangeText={(text) => setFormData({ ...formData, addressComplement: text })}
                    placeholder="Apto, Bloco, etc (opcional)"
                />

                <LabeledTextInput
                    label="Referência"
                    value={formData.addressReference}
                    onChangeText={(text) => setFormData({ ...formData, addressReference: text })}
                    placeholder="Próximo a... (opcional)"
                    multiline
                />

                {/* Botão Salvar */}
                <View className="mt-8 mb-12">
                    {isSaving ? (
                        <View className="rounded-lg py-4 flex-row items-center justify-center" style={{ backgroundColor: colors.palette[3] }}>
                            <ActivityIndicator color="white" size="small" />
                            <Text className="text-white font-bold ml-2">Salvando...</Text>
                        </View>
                    ) : (
                        <ButtonSalvar
                            title="Salvar Alterações"
                            onPress={handleSave}
                            bgColor={colors.palette[3]}
                        />
                    )}
                </View>
            </ScrollView>

            {/* Modal de Imagem */}
            <Modal
                visible={imageModal}
                transparent
                animationType="fade"
                onRequestClose={() => setImageModal(false)}
            >
                <View className="flex-1 bg-black/50 justify-center items-center">
                    <View className="bg-white rounded-xl w-[80%] overflow-hidden">
                        <Text className="text-lg font-bold p-4">Selecionar Foto</Text>

                        <TouchableOpacity
                            onPress={() => pickImage('camera')}
                            className="px-4 py-4 border-t border-gray-200 flex-row items-center"
                        >
                            <Ionicons name="camera" size={24} color="#0288d1" />
                            <Text className="ml-4 text-lg">Tirar Foto</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => pickImage('gallery')}
                            className="px-4 py-4 border-t border-gray-200 flex-row items-center"
                        >
                            <Ionicons name="images" size={24} color="#0288d1" />
                            <Text className="ml-4 text-lg">Galeria</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setImageModal(false)}
                            className="px-4 py-4 border-t border-gray-200"
                        >
                            <Text className="text-center text-gray-500">Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

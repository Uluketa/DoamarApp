import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Modal,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';

import { RootStackParamList } from '~/types/Navigation';
import { RootState } from '~/store';
import { listSocialIssues, updateInstitutionProfile, resolveImageUrl } from '~/api';
import { updateInstitutionData } from '~/store/modules/user/actions';

import { LabeledTextInput } from '~/components/LabeledTextInput';
import { BtnText as ButtonSalvar } from '~/components/Button';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { colors } from '~/styles/colors';
import { SocialIssue } from '~/types/entities/SocialIssue';

interface EditFormData {
    name: string;
    email: string;
    cellphone: string;
    cnpj: string;
    socialIssueId: number | null;
    addressLine: string;
    addressNumber: string;
    addressCep: string;
    addressCity: string;
    addressState: string;
    addressNeighborhood: string;
    addressComplement: string;
    addressReference: string;
}

type ImageTarget = 'logo' | 'background';

type ImageFile = {
    uri: string;
    type?: string;
    fileName?: string;
};

export default function EditInstitutionProfile() {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const { userData, token } = useSelector((state: RootState) => state.user);
    const institution = userData.institution;

    const [isSaving, setIsSaving] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [imageTarget, setImageTarget] = useState<ImageTarget | null>(null);
    const [socialIssueModal, setSocialIssueModal] = useState(false);
    const [socialIssues, setSocialIssues] = useState<SocialIssue[]>([]);
    const [isSocialIssueLoading, setIsSocialIssueLoading] = useState(false);

    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<ImageFile | null>(null);
    const [backgroundFile, setBackgroundFile] = useState<ImageFile | null>(null);

    const [formData, setFormData] = useState<EditFormData>({
        name: institution?.name || '',
        email: institution?.email || '',
        cellphone: institution?.cellphone?.toString() || '',
        cnpj: institution?.cnpj || '',
        socialIssueId: institution?.social_issue?.id ?? institution?.social_issue_id ?? null,
        addressLine: institution?.addressLine || '',
        addressNumber: institution?.addressNumber || '',
        addressCep: institution?.addressCep || '',
        addressCity: institution?.addressCity || '',
        addressState: institution?.addressState || '',
        addressNeighborhood: institution?.addressNeighborhood || '',
        addressComplement: institution?.addressComplement || '',
        addressReference: institution?.addressReference || '',
    });

    useEffect(() => {
        if (institution?.pathLogoImage) {
            setLogoUrl(resolveImageUrl(institution.pathLogoImage) ?? null);
        }
        if (institution?.pathBackgroundImage) {
            setBackgroundUrl(resolveImageUrl(institution.pathBackgroundImage) ?? null);
        }
    }, [institution?.pathLogoImage, institution?.pathBackgroundImage]);

    useEffect(() => {
        const fetchSocialIssues = async () => {
            if (isSocialIssueLoading || socialIssues.length > 0) {
                return;
            }

            setIsSocialIssueLoading(true);
            try {
                const response = await listSocialIssues();
                if (response.ok === 'S' && response.data) {
                    setSocialIssues(response.data);
                }
            } finally {
                setIsSocialIssueLoading(false);
            }
        };

        fetchSocialIssues();
    }, []);

    const openImageModal = (target: ImageTarget) => {
        setImageTarget(target);
        setImageModal(true);
    };

    const pickImage = async (source: 'camera' | 'gallery') => {
        if (!imageTarget) return;
        try {
            let result;

            if (source === 'camera') {
                const permission = await ImagePicker.requestCameraPermissionsAsync();
                if (!permission.granted) {
                    Toast.show({
                        type: 'error',
                        text1: 'Permissao necessaria',
                        text2: 'Voce precisa permitir acesso a camera.'
                    });
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    aspect: imageTarget === 'logo' ? [1, 1] : [16, 9],
                    quality: 0.8,
                });
            } else {
                const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!permission.granted) {
                    Toast.show({
                        type: 'error',
                        text1: 'Permissao necessaria',
                        text2: 'Voce precisa permitir acesso a galeria.'
                    });
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: imageTarget === 'logo' ? [1, 1] : [16, 9],
                    quality: 0.8,
                });
            }

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                const imageFile: ImageFile = {
                    uri: asset.uri,
                    fileName: `${imageTarget}-${institution?.id ?? 'temp'}.jpg`,
                    type: asset.mimeType ?? 'image/jpeg',
                };

                if (imageTarget === 'logo') {
                    setLogoUrl(asset.uri);
                    setLogoFile(imageFile);
                } else {
                    setBackgroundUrl(asset.uri);
                    setBackgroundFile(imageFile);
                }

                setImageModal(false);
                setImageTarget(null);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Erro ao selecionar imagem.'
            });
        }
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Nome e obrigatorio.' });
            return false;
        }
        if (!formData.email.trim()) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Email e obrigatorio.' });
            return false;
        }
        if (!formData.cellphone.trim()) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Telefone e obrigatorio.' });
            return false;
        }
        if (!formData.cnpj.trim()) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'CNPJ e obrigatorio.' });
            return false;
        }
        if (!formData.socialIssueId) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Causa social e obrigatoria.' });
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!institution?.id || !token) return;
        if (!validateForm()) return;

        setIsSaving(true);
        try {
            const updateResponse = await updateInstitutionProfile(
                institution.id,
                {
                    name: formData.name,
                    email: formData.email,
                    cellphone: formData.cellphone,
                    cnpj: formData.cnpj,
                    social_issue_id: formData.socialIssueId ?? undefined,
                    addressLine: formData.addressLine,
                    addressNumber: formData.addressNumber,
                    addressCep: formData.addressCep,
                    addressCity: formData.addressCity,
                    addressState: formData.addressState,
                    addressNeighborhood: formData.addressNeighborhood,
                    addressComplement: formData.addressComplement,
                    addressReference: formData.addressReference,
                },
                logoFile,
                backgroundFile,
                token
            );

            if (updateResponse.ok === 'N') {
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: updateResponse.msg || 'Erro ao atualizar perfil.',
                });
                return;
            }

            const updatedInstitution = updateResponse.data;
            if (updatedInstitution) {
                dispatch(updateInstitutionData(updatedInstitution));
            }

            Toast.show({ type: 'success', text1: 'Instituição atualizada' });
            navigation.goBack();
        } catch (e) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Erro ao salvar alterações.',
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
                {/* Imagem de fundo */}
                <View className="mb-6">
                    <Text className="text-sm font-semibold mb-3" style={{ color: colors.text }}>
                        Imagem de fundo
                    </Text>
                    <TouchableOpacity
                        onPress={() => openImageModal('background')}
                        className="w-full h-40 rounded-2xl overflow-hidden items-center justify-center"
                        style={{ backgroundColor: colors.border }}
                    >
                        {backgroundUrl ? (
                            <Image
                                source={{ uri: backgroundUrl }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <Ionicons name="image-outline" size={36} color={colors.text + '88'} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Logo */}
                <View className="items-center mb-8">
                    <TouchableOpacity
                        onPress={() => openImageModal('logo')}
                        className="w-28 h-28 items-center justify-center"
                    >
                        {logoUrl ? (
                            <Image
                                source={{ uri: logoUrl }}
                                className="w-full h-24"
                                resizeMode="contain"
                            />
                        ) : (
                            <Ionicons name="business-outline" size={32} color={colors.text + '88'} />
                        )}
                    </TouchableOpacity>
                    <Text className="text-xs mt-2" style={{ color: colors.text + 'AA' }}>
                        Toque para alterar a logo
                    </Text>
                </View>

                <View>
                    {/* Formulário */}
                    <View className="w-full text-center mb-6 flex-row items-center justify-center border-t pt-4" style={{ borderColor: colors.border }}>
                        <Ionicons name="person-outline" size={16} color={colors.text} />
                        <Text className="ml-2 text-lg font-bold" style={{ color: colors.text }}>
                            Informações da instituição
                        </Text>
                    </View>

                    <LabeledTextInput
                        label="Nome"
                        value={formData.name}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                    />

                    <LabeledTextInput
                        label="Email"
                        value={formData.email}
                        keyboardType="email-address"
                        onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                    />

                    <LabeledTextInput
                        label="Telefone"
                        value={formData.cellphone}
                        keyboardType="phone-pad"
                        onChangeText={(text) => setFormData(prev => ({ ...prev, cellphone: text }))}
                    />

                    <LabeledTextInput
                        label="CNPJ"
                        value={formData.cnpj}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, cnpj: text }))}
                    />

                    <View className="w-full text-center mb-6 mt-4 flex-row items-center justify-center border-t pt-4" style={{ borderColor: colors.border }}>
                        <Ionicons name="heart-outline" size={16} color={colors.text} />
                        <Text className="ml-2 text-lg font-bold" style={{ color: colors.text }}>
                            Causa social
                        </Text>
                    </View>

                    <TouchableOpacity
                        className="px-3 py-3 rounded-xl border"
                        style={{ borderColor: colors.border, backgroundColor: colors.background }}
                        onPress={() => setSocialIssueModal(true)}
                    >
                        <Text style={{ color: colors.text }}>
                            {socialIssues.find((issue) => issue.id === formData.socialIssueId)?.title || 'Selecione uma causa social'}
                        </Text>
                    </TouchableOpacity>

                    {/* Endereço */}
                    <View className="w-full text-center mb-6 mt-4 flex-row items-center justify-center border-t pt-4" style={{ borderColor: colors.border }}>
                        <Ionicons name="location-outline" size={16} color={colors.text} />
                        <Text className='ml-2 text-lg font-bold' style={{ color: colors.text }}>Endereço</Text>
                    </View>

                    <LabeledTextInput
                        label="CEP"
                        value={formData.addressCep}
                        keyboardType="numeric"
                        onChangeText={(text) => setFormData(prev => ({ ...prev, addressCep: text }))}
                    />

                    <LabeledTextInput
                        label="Endereco"
                        value={formData.addressLine}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, addressLine: text }))}
                    />

                    <View className="flex-row gap-3">
                        <View className="flex-1">
                            <LabeledTextInput
                                label="Numero"
                                value={formData.addressNumber}
                                keyboardType="numeric"
                                onChangeText={(text) => setFormData(prev => ({ ...prev, addressNumber: text }))}
                            />
                        </View>
                        <View className="flex-1">
                            <LabeledTextInput
                                label="Bairro"
                                value={formData.addressNeighborhood}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, addressNeighborhood: text }))}
                            />
                        </View>
                    </View>

                    <View className="flex-row gap-3">
                        <View className="flex-1">
                            <LabeledTextInput
                                label="Cidade"
                                value={formData.addressCity}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, addressCity: text }))}
                            />
                        </View>
                        <View className="flex-1">
                            <LabeledTextInput
                                label="Estado"
                                value={formData.addressState}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, addressState: text }))}
                            />
                        </View>
                    </View>

                    <LabeledTextInput
                        label="Complemento"
                        value={formData.addressComplement}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, addressComplement: text }))}
                    />

                    <LabeledTextInput
                        label="Referencia"
                        value={formData.addressReference}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, addressReference: text }))}
                    />
                </View>

                <View className="mt-10 mb-12">
                    {isSaving ? (
                        <View className="py-4 rounded-2xl items-center" style={{ backgroundColor: colors.primary }}>
                            <ActivityIndicator color="#fff" />
                        </View>
                    ) : (
                        <ButtonSalvar
                            title="Salvar alteracoes"
                            onPress={handleSave}
                            bgColor={colors.primary}
                        />
                    )}
                </View>
            </ScrollView>

            <Modal visible={imageModal} transparent animationType="fade" onRequestClose={() => setImageModal(false)}>
                <View className="flex-1 items-center justify-center bg-black/60 px-8">
                    <View className="w-full rounded-2xl p-6" style={{ backgroundColor: colors.card }}>
                        <Text className="text-lg font-bold mb-4" style={{ color: colors.text }}>
                            Escolha a imagem
                        </Text>

                        <TouchableOpacity
                            className="py-3 rounded-xl mb-3"
                            style={{ backgroundColor: colors.primary }}
                            onPress={() => pickImage('camera')}
                        >
                            <Text className="text-center text-white font-semibold">Camera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="py-3 rounded-xl mb-3"
                            style={{ backgroundColor: colors.primary }}
                            onPress={() => pickImage('gallery')}
                        >
                            <Text className="text-center text-white font-semibold">Galeria</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="py-3 rounded-xl border"
                            style={{ borderColor: colors.border }}
                            onPress={() => setImageModal(false)}
                        >
                            <Text className="text-center font-semibold" style={{ color: colors.text }}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={socialIssueModal} transparent animationType="fade" onRequestClose={() => setSocialIssueModal(false)}>
                <View className="flex-1 items-center justify-center bg-black/60 px-8">
                    <View className="w-full rounded-2xl p-6" style={{ backgroundColor: colors.card }}>
                        <Text className="text-lg font-bold mb-4" style={{ color: colors.text }}>
                            Selecione a causa social
                        </Text>

                        {isSocialIssueLoading ? (
                            <View className="py-8 items-center">
                                <ActivityIndicator color={colors.primary} />
                            </View>
                        ) : (
                            <ScrollView className="max-h-80">
                                {socialIssues.map((issue) => (
                                    <TouchableOpacity
                                        key={issue.id}
                                        onPress={() => {
                                            setFormData(prev => ({ ...prev, socialIssueId: issue.id }));
                                            setSocialIssueModal(false);
                                        }}
                                        className="py-3 border-b"
                                        style={{ borderColor: colors.border }}
                                    >
                                        <Text style={{ color: colors.text }}>{issue.title}</Text>
                                        <Text className="text-xs mt-1" style={{ color: colors.text + 'AA' }}>{issue.description}</Text>
                                    </TouchableOpacity>
                                ))}
                                {socialIssues.length === 0 && (
                                    <Text style={{ color: colors.text }}>Nenhuma causa encontrada.</Text>
                                )}
                            </ScrollView>
                        )}

                        <TouchableOpacity
                            className="py-3 rounded-xl border mt-4"
                            style={{ borderColor: colors.border }}
                            onPress={() => setSocialIssueModal(false)}
                        >
                            <Text className="text-center font-semibold" style={{ color: colors.text }}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

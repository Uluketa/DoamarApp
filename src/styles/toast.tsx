import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './colors';

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'transparent',
        backgroundColor: colors.palette[5],
        borderColor: colors.palette[1],
        borderWidth: 3,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}
      contentContainerStyle={{
        paddingHorizontal: 10,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: colors.palette[0],
      }}
      text2Style={{
        fontSize: 14,
        color: colors.palette[0],
      }}
      renderLeadingIcon={() => (
        <Ionicons name="checkmark-circle" size={24} color={colors.palette[0]} style={{ marginRight: 10 }} />
      )}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: 'transparent',
        backgroundColor: '#FF3B30',
        borderColor: '#D32F2F',
        borderWidth: 3,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}
      contentContainerStyle={{
        paddingHorizontal: 10,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
      }}
      text2Style={{
        fontSize: 14,
        color: '#fff',
      }}
      renderLeadingIcon={() => (
        <Ionicons name="close-circle" size={24} color="#fff" style={{ marginRight: 10 }} />
      )}
    />
  ),

  warning: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'transparent',
        backgroundColor: '#FFA500',
        borderColor: '#FF8C00',
        borderWidth: 3,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}
      contentContainerStyle={{
        paddingHorizontal: 10,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
      }}
      text2Style={{
        fontSize: 14,
        color: '#fff',
      }}
      renderLeadingIcon={() => (
        <Ionicons name="alert-circle" size={24} color="#fff" style={{ marginRight: 10 }} />
      )}
    />
  ),
};

export default toastConfig;

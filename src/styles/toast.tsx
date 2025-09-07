import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './colors';

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'transparent',
        backgroundColor: '#fff',
        borderColor: '#f0f0f0',
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
        color: '#111',
      }}
      text2Style={{
        fontSize: 14,
        color: '#333',
      }}
      renderLeadingIcon={() => (
        <Ionicons name="checkmark-circle" size={24} color={colors.palette[5]} style={{ marginRight: 10 }} />
      )}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: 'transparent',
        backgroundColor: '#fff',
        borderColor: '#f0f0f0',
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
        color: '#111',
      }}
      text2Style={{
        fontSize: 14,
        color: '#333',
      }}
      renderLeadingIcon={() => (
        <Ionicons name="close-circle" size={24} color="#FF3B30" style={{ marginRight: 10 }} />
      )}
    />
  ),

  warning: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'transparent',
        backgroundColor: '#fff',
        borderColor: '#f0f0f0',
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
        color: '#111',
      }}
      text2Style={{
        fontSize: 14,
        color: '#333',
      }}
      renderLeadingIcon={() => (
        <Ionicons name="alert-circle" size={24} color="#FFA500" style={{ marginRight: 10 }} />
      )}
    />
  ),
};

export default toastConfig;

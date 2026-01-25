import { SafeAreaView } from 'react-native-safe-area-context';

type ContainerProps = {
  children: React.ReactNode;
};

export const Container = ({ children }: ContainerProps) => {
  return <SafeAreaView className="flex flex-1 p-6">{children}</SafeAreaView>;
};

import { SafeAreaView } from 'react-native';

type PROPS = {
  children: React.ReactNode;
};

export const Container = ({ children }: PROPS) => {
  return <SafeAreaView className="flex flex-1 p-6">{children}</SafeAreaView>;
};

import { ScrollView, Text } from "react-native";

export function PrivacyPolicy() {
  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-black mb-3">
        Política de Privacidade - Doamar APP
      </Text>

      <Text className="text-base text-gray-700 mb-3 text-justify leading-7">
        A sua privacidade é importante para nós. O Doamar APP respeita a sua
        privacidade e protege as informações pessoais que você compartilha
        conosco.
      </Text>

      <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
        Coleta de informações
      </Text>
      <Text className="text-base text-gray-700 mb-3 text-justify leading-7">
        Solicitamos apenas os dados necessários para fornecer nossos serviços,
        como informações de contato e informações básicas para gerenciamento de
        doações. Coletamos essas informações de forma justa e com seu consentimento.
      </Text>

      <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
        Uso das informações
      </Text>
      <Text className="text-base text-gray-700 mb-3 text-justify leading-7">
        As informações coletadas são usadas exclusivamente para permitir a
        comunicação com você, organizar doações e melhorar nossos serviços. Não
        realizamos transações financeiras ou processamos pagamentos.
      </Text>

      <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
        Compartilhamento de dados
      </Text>
      <Text className="text-base text-gray-700 mb-3 text-justify leading-7">
        Não compartilhamos informações pessoais com terceiros, exceto quando
        exigido por lei ou para proteger nossos direitos.
      </Text>

      <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
        Segurança
      </Text>
      <Text className="text-base text-gray-700 mb-3 text-justify leading-7">
        Protegemos suas informações usando métodos comercialmente aceitáveis
        para evitar perda, acesso não autorizado ou uso indevido.
      </Text>

      <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
        Links externos
      </Text>
      <Text className="text-base text-gray-700 mb-3 text-justify leading-7">
        Nosso aplicativo pode conter links para sites de terceiros. Não
        nos responsabilizamos pelas práticas de privacidade desses sites.
      </Text>

      <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
        Compromisso do usuário
      </Text>
      <Text className="text-base text-gray-700 mb-3 text-justify leading-7">
        Ao usar o Doamar APP, você concorda em utilizar o aplicativo de maneira
        ética e legal, não praticando atividades que possam prejudicar o serviço,
        seus usuários ou terceiros.
      </Text>

      <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
        Contato
      </Text>
      <Text className="text-base text-gray-700 mb-3 text-justify leading-7">
        Se tiver dúvidas sobre nossa política de privacidade, entre em contato
        conosco pelo email:{" "}
        <Text className="text-blue-500 underline">
          doamarapp@gmail.com
        </Text>
      </Text>

      <Text className="text-base text-gray-700 mb-10 text-justify leading-7">
        Esta política é efetiva a partir de 07 de Setembro de 2025.
      </Text>
    </ScrollView>
  );
}

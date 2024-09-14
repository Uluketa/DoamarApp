import React from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';
import NavBar from '~/components/Navbar';

export default function About() {

    return (
        <View className="flex-1 items-center">
            <Image
                className="absolute t-0 w-[100%] h-[200px] opacity-[0.3]"
                source={require('~/assets/rostos.jpg')}
                resizeMode="cover"
            />

            <Image
                className="w-[150px] h-[150px] my-[25px]"
                source={require('~/assets/logoDarkGreenA.png')}
                resizeMode="contain"
            />

            <View className="w-full p-5">
                <View>
                    <Text className="font-bold text-2xl text-gray-800 mb-2">Quem somos?</Text>
                    <Text style={{ textAlign: 'justify' }} className="text-gray-700 leading-7">
                        Somos um grupo de estudantes da Universidade Paulista, campus Alphaville, cursando Ciência da Computação. Nossa equipe está comprometida em aplicar nossos conhecimentos para criar soluções tecnológicas que façam a diferença na sociedade.
                    </Text>

                    <Text className="font-bold text-2xl text-gray-800 mt-6 mb-2">Nosso objetivo</Text>
                    <Text style={{ textAlign: 'justify' }} className="text-gray-700 leading-7">
                        Nosso principal objetivo é facilitar o controle e a gestão de doações, ajudando tanto a comunidade quanto as instituições. Queremos simplificar esse processo, tornando-o mais eficiente, acessível e agradável para todos os envolvidos.
                    </Text>

                    <Text className="font-bold text-2xl text-gray-800 mt-6 mb-2">Fonte de inspiração</Text>
                    <Text style={{ textAlign: 'justify' }} className="text-gray-700 leading-7">
                        Nosso modelo base foi inspirado nas necessidades e contribuições da PAZ Church Santana de Parnaíba. Através de conversas e feedbacks com a organização, ajustamos nosso sistema para atender aos requisitos e às expectativas da instituição.
                    </Text>
                </View>
            </View>

            <NavBar />
        </View>
    );
}

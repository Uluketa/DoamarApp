import { Image } from 'react-native';

export const Logo = () => {
    return (
        <Image
            className='mr-5'
            source={require("../assets/logoLightGreenB.png")}
            style={{ width: 30, height: 30 }}
        />
    );
};
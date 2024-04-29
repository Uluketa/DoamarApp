import React from 'react';
import { Image } from 'react-native';


const Logo: React.FC = () => {
    return (
        <Image
            className='mr-5'
            source={require("../assets/logoLightGreenB.png")}
            style={{ width: 30, height: 30 }}
        />
    );
};

export default Logo;
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { NavBar } from '~/components/ui/Navbar';
import { Header } from '~/components/ui/Header';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '~/store/modules/rootReducer';
import { setNavigationScreen } from '~/store/modules/navigation/actions';
import { ClientScreenType, InstitutionScreenType } from '~/types/Navigation';

// Client Screens
import ClientHome from '~/components/screens/Client/Home';
import ClientDonation from '~/components/screens/Client/Donation';
import ClientFavorites from '~/components/screens/Client/Favorites';
import ClientSettings from '~/components/screens/Client/Settings';

// Institution Screens
import DonationItemsStock from '~/components/screens/Institution/DonationItemsStock';
import ReceivedDonations from '~/components/screens/Institution/ReceivedDonations';
import InstitutionReports from '~/components/screens/Institution/Reports';
import InstitutionHome from '../screens/Institution/Home';

export const Layout = () => {
    const dispatch = useDispatch();
    const { screen } = useSelector((state: RootState) => state.navigation);
    const { userData } = useSelector((state: RootState) => state.user);
    const [searchText, setSearchText] = useState('');

    // Sincroniza estado de navegação com tipo de usuário quando app carrega
    useEffect(() => {
        if (userData.type === 'institution' && screen !== 'Dashboard' && screen !== 'Stock' && screen !== 'Orders' && screen !== 'Reports') {
            dispatch(setNavigationScreen({ screen: 'Dashboard' }));
        } else if (userData.type === 'client' && screen !== 'Home' && screen !== 'Donation' && screen !== 'Favorites' && screen !== 'Settings') {
            dispatch(setNavigationScreen({ screen: 'Home' }));
        }
    }, [userData.type, dispatch]);

    const handleChangeScreen = (screen: ClientScreenType | InstitutionScreenType) => {
        dispatch(setNavigationScreen({ screen }));
        // Limpar busca quando muda de tela
        setSearchText('');
    };

    const handleSearchChange = (text: string) => {
        setSearchText(text);
    };

    const renderScreen = () => {
        if (userData.type === 'client') {
            switch (screen) {
                case 'Home':
                    return <ClientHome searchText={searchText} />;
                case 'Donation':
                    return <ClientDonation />;
                case 'Favorites':
                    return <ClientFavorites />;
                case 'Settings':
                    return <ClientSettings />;
                default:
                    return <ClientHome searchText={searchText} />;
            }
        } else {
            switch (screen) {
                case 'Dashboard':
                    return <InstitutionHome />;
                case 'Stock':
                    return <DonationItemsStock />;
                case 'Orders':
                    return <ReceivedDonations />;
                case 'Reports':
                    return <InstitutionReports />;
                default:
                    return <InstitutionHome />;
            }
        }
    };

    return (
        <View className='flex-1'>
            <Header 
                userType={userData.type} 
                searchValue={searchText}
                onSearchChange={handleSearchChange}
            />

            <View className='flex-1'>
                {renderScreen()}
            </View>

            <NavBar
                activeScreen={screen}
                setActiveScreen={handleChangeScreen}
                userType={userData.type}
            />
        </View>
    );
};

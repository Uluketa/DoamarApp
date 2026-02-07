import React, { use, useEffect } from 'react';
import { View } from 'react-native';

import { NavBar } from '~/components/ui/Navbar';
import { Header } from '~/components/ui/Header';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '~/store/modules/rootReducer';
import { setNavigationScreen } from '~/store/modules/navigation/actions';
import { ClientScreenType, InstitutionScreenType } from '~/types/Navigation';

import ClientHome from '~/components/screens/Client/Home';
import ClientDonation from '~/components/screens/Client/Donation';
import ClientFavorites from '~/components/screens/Client/Favorites';
import ClientSettings from '~/components/screens/Client/Settings';

import InstitutionDashboard from '~/components/screens/Institution/Dashboard';
import DonationItemsStock from '~/components/screens/Institution/DonationItemsStock';
import ReceivedDonations from '~/components/screens/Institution/ReceivedDonations';
import InstitutionReports from '~/components/screens/Institution/Reports';

export const Layout = () => {
    const dispatch = useDispatch();
    const { screen } = useSelector((state: RootState) => state.navigation);
    const { userData } = useSelector((state: RootState) => state.user);

    const handleChangeScreen = (screen: ClientScreenType | InstitutionScreenType) => {
        dispatch(setNavigationScreen({ screen }));
    };

    const renderScreen = () => {
        if (userData.type === 'client') {
            switch (screen) {
                case 'Home':
                    return <ClientHome />;
                case 'Donation':
                    return <ClientDonation />;
                case 'Favorites':
                    return <ClientFavorites />;
                case 'Settings':
                    return <ClientSettings />;
                default:
                    return <ClientHome />;
            }
        } else {
            switch (screen) {
                case 'Dashboard':
                    return <InstitutionDashboard />;
                case 'Stock':
                    return <DonationItemsStock />;
                case 'Orders':
                    return <ReceivedDonations />;
                case 'Reports':
                    return <InstitutionReports />;
                default:
                    return <InstitutionDashboard />;
            }
        }
    };

    return (
        <View className='flex-1'>
            <Header userType={userData.type} />

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

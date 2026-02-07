import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getDonationsByInstitution } from '~/api';
import { RootState } from '~/store';
import { FiltersBar } from './components/FiltersBar';
import { DonationCard } from './components/DonationCard';
import { ReceivedChart } from './components/ReceivedChart';
import { DonationDetailsModal } from './components/DonationDetailsModal';
import { Donation } from '~/types/entities/Donation';
import { ORDER_TYPE_ID } from '~/constants/orderTypes';
import { OrderTypeFilterModal } from '~/components/OrderTypeFilterModal';

export default function ReceivedDonations() {
    const { userData, token } = useSelector((state: RootState) => state.user);
    const institutionId = userData.institution?.id ?? 0;

    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState(30);
    const [selectedOrderType, setSelectedOrderType] =
        useState<ORDER_TYPE_ID | null>(null);
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
    const [typeModalVisible, setTypeModalVisible] = useState(false);

    const fetchDonations = useCallback(async () => {
        if (!institutionId || !token) return;
        setLoading(true);
        const res = await getDonationsByInstitution(institutionId, token);
        if (res.ok === 'S' && res.data) {
            setDonations(Array.isArray(res.data) ? res.data : []);
        }
        setLoading(false);
    }, [institutionId, token]);

    useEffect(() => {
        fetchDonations();
    }, [fetchDonations]);

    const handleCloseModal = useCallback(() => {
        setSelectedDonation(null);
        fetchDonations();
    }, [fetchDonations]);

    const filteredDonations = donations.filter(donation => {
        if (!donation.created_at) return false;

        const donationDate = new Date(donation.created_at);
        const limitDate = new Date();
        limitDate.setDate(limitDate.getDate() - selectedPeriod);

        const matchesPeriod = donationDate >= limitDate;
        const orderTypeId = donation.order?.order_type?.id ?? donation.order?.orderType?.id;
        const matchesType = selectedOrderType
            ? orderTypeId === selectedOrderType
            : true;

        return matchesPeriod && matchesType;
    });

    return (
        <View className="flex-1 bg-gray-50 px-6 pt-8">
            <Text className="text-2xl font-bold mb-1">
                Recebidos
            </Text>

            <Text className="text-gray-500 mb-6">
                {filteredDonations.length} doações no período
            </Text>

            <FiltersBar
                selectedPeriod={selectedPeriod}
                selectedOrderType={selectedOrderType}
                onChangePeriod={setSelectedPeriod}
                onOpenTypeFilter={() => setTypeModalVisible(true)}
            />

            <ReceivedChart total={filteredDonations.length} />

            {loading ? (
                <ActivityIndicator size="large" className="flex-1 mt-8" />
            ) : (
                <FlatList
                    data={filteredDonations}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={fetchDonations} />
                    }
                    renderItem={({ item }) => (
                        <DonationCard
                            donation={item}
                            onPress={() => setSelectedDonation(item)}
                        />
                    )}
                />
            )}

            <DonationDetailsModal
                donation={selectedDonation}
                onClose={handleCloseModal}
                onStatusUpdated={fetchDonations}
            />

            <OrderTypeFilterModal
                visible={typeModalVisible}
                selectedType={selectedOrderType}
                onSelect={setSelectedOrderType}
                onClose={() => setTypeModalVisible(false)}
            />
        </View>
    );
}

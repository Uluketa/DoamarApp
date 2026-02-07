import { View, Text, FlatList } from 'react-native';
import { useState } from 'react';

import { mockDonations } from '~/mocks/donations.mock';
import { FiltersBar } from './components/FiltersBar';
import { DonationCard } from './components/DonationCard';
import { ReceivedChart } from './components/ReceivedChart';
import { DonationDetailsModal } from './components/DonationDetailsModal';
import { Donation } from '~/types/entities/Donation';
import { ORDER_TYPE_ID } from '~/constants/orderTypes';
import { OrderTypeFilterModal } from '~/components/OrderTypeFilterModal';

export default function ReceivedDonations() {
    const [donations] = useState(mockDonations);
    const [selectedPeriod, setSelectedPeriod] = useState(30);
    const [selectedOrderType, setSelectedOrderType] =
        useState<ORDER_TYPE_ID | null>(null);
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
    const [typeModalVisible, setTypeModalVisible] = useState(false);

    const filteredDonations = donations.filter(donation => {
        if (!donation.created_at) return null;

        const donationDate = new Date(donation.created_at);
        const limitDate = new Date();
        limitDate.setDate(limitDate.getDate() - selectedPeriod);

        const matchesPeriod = donationDate >= limitDate;
        const matchesType = selectedOrderType
            ? donation.order.order_type.id === selectedOrderType
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

            <FlatList
                data={filteredDonations}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <DonationCard
                        donation={item}
                        onPress={() => setSelectedDonation(item)}
                    />
                )}
            />

            <DonationDetailsModal
                donation={selectedDonation}
                onClose={() => setSelectedDonation(null)}
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

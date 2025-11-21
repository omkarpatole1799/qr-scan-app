import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import LogoutComponent from '@/components/LogoutComponent';
import { useSelector } from 'react-redux';
import { RootState } from '@/components/store/store';

const Profile = () => {
    const currentLoginDetails = useSelector(
        (state: RootState) => state.authSlice.currentLoggedinSlotData
    );

    const url = useSelector(
        (state: RootState) => state.authSlice.currentLoggedInProcessData.p_form_filling_site
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Profile</Text>

            <View style={styles.card}>
                <ProfileItem label="Username" value={currentLoginDetails?.user_name || 'NA'} />
                <ProfileItem label="Role" value={currentLoginDetails?.roll || 'NA'} />
                <ProfileItem
                    label="Slot & Time"
                    value={`Slot - ${currentLoginDetails?.slot?.ca_batch_slot} (${currentLoginDetails?.slot?.ca_batch_time})`}
                />
                <ProfileItem label="Exam Date" value={currentLoginDetails?.date || 'NA'} />
                <ProfileItem
                    label="Center"
                    value={`(${currentLoginDetails?.center?.ca_center_code}) ${currentLoginDetails?.center?.ca_center_name} `}
                />
                <ProfileItem label="Server URL" value={url || 'NA'} />
            </View>

            <View style={styles.logoutContainer}>
                <LogoutComponent />
            </View>
        </View>
    );
};

const ProfileItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.item}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
        padding: 20,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 20,
        alignSelf: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    item: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1a1a1a',
    },
    logoutContainer: {
        marginTop: 'auto',
        paddingTop: 30,
        alignItems: 'center',
    },
});

export default Profile;

'use client';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
// import CryptoJS from 'crypto-js';
import ProcessBannerImage from '@/components/ProcessBannerImage';
import BtnPrimary from '@/components/UI/BtnPrimary';
import { styles } from '@/constants/styles';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScanQrPage = () => {
    const [rollNumber, setRollNumber] = useState('');

    const handleSearchCandidate = () => {
        Keyboard.dismiss();
        if (rollNumber?.trim() == '' || !rollNumber) {
            Alert.alert('Info', 'Please enter valid roll number');
            return;
        }
        router.push(`/candidate-info/${rollNumber?.trim()}`);
    };

    return (
        <SafeAreaView
            edges={['bottom']}
            style={{
                padding: 10,
            }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ProcessBannerImage />
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}>
                    <View
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '120',
                            borderColor: 'blue',
                        }}>
                        <View
                            style={{
                                width: '100%',
                                marginTop: 40,
                                gap: 10,
                            }}>
                            <TextInput
                                value={rollNumber}
                                onChangeText={setRollNumber}
                                style={styles.input}
                                keyboardType="number-pad"
                                placeholder="Roll Number"
                            />
                            <BtnPrimary title={'Submit'} onPress={handleSearchCandidate} />
                        </View>

                        <Text>OR</Text>

                        <BtnPrimary
                            title={<MaterialIcons name="qr-code-scanner" size={75} color="white" />}
                            styleForWrapper={styles.scanQRButtonCenter}
                            styleForChildren={{
                                backgroundColor: 'transparent',
                            }}
                            onPress={() => {
                                router.push('/scan-camera');
                            }}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ScanQrPage;

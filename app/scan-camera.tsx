'use client';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

import CryptoJS from 'react-native-crypto-js';
const secretKey = 'form-filling-secret-key'; // Key for encryption/decryption

import { RootState } from '@/components/store/store';
import BtnSecondary from '@/components/UI/BtnSecondary';
import { styles } from '@/constants/styles';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const ScanCamera = () => {
    const [isPauseScanning, setIsPauseScanning] = useState(false);

    const currentSlotData = useSelector(
        (state: RootState) => state.authSlice.currentLoggedinSlotData
    );

    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    Please grant the necessary permissions to proceed.
                </Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to access the camera</Text>
                <BtnSecondary title={'Grant Permission'} onPress={requestPermission} />
            </View>
        );
    }

    const decrypt = async (encryptedData: string, secretKey: string) => {
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    };

    const handleBarcodeScan = async ({ data: qrData }: { data: string }) => {
        setIsPauseScanning(true);

        const decryptedData = await decrypt(qrData, secretKey);

        const parsedQrData = JSON.parse(decryptedData);

        console.log(parsedQrData, 'parsedQrADAta');
        console.log(currentSlotData, '-currentSlotData');

        if (currentSlotData?.slot?.ca_batch_slot != parsedQrData.slot) {
            Alert.alert('Info', 'No candidate found22', [
                {
                    text: 'ok',
                    onPress: () => {
                        router.replace('/tabs/scan');
                    },
                },
            ]);
        } else {
            router.replace(`/candidate-info/${parsedQrData.roll_no}`);
        }
    };

    return (
        <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
            <CameraView
                style={styles.camera}
                onBarcodeScanned={isPauseScanning ? undefined : handleBarcodeScan}></CameraView>
        </SafeAreaView>
    );
};

export default ScanCamera;

import { View, Text } from 'react-native';
import React from 'react';
import AttendanceCountComponent from '@/components/UI/AttendanceCount/AttendanceCountComponent';
import { SafeAreaView } from 'react-native-safe-area-context';

const count = () => {
    return (
        <SafeAreaView edges={['top', 'bottom']}>
            <AttendanceCountComponent />
        </SafeAreaView>
    );
};

export default count;

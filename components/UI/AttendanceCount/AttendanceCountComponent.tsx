import { RootState } from '@/components/store/store';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import Loading from '../Loading';

const AttendanceCountComponent = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [attendanceCount, setAttendanceCount] = useState({
        total_present_count: 0,
        total_student_count: 0,
    });

    const url = useSelector(
        (state: RootState) => state.authSlice.currentLoggedInProcessData.p_form_filling_site
    );

    const slot = useSelector(
        (state: RootState) => state.authSlice.currentLoggedinSlotData.slot.ca_batch_slot
    );

    const fetchAndSetAttendanceCount = useCallback(async () => {
        try {
            const _url = `${url}/api/get-attendance-count/${encodeURIComponent(slot)}`;
            const _resp = await fetch(_url);

            if (!_resp.ok) {
                throw new Error('Error while getting attendance count');
            }
            const _data = await _resp.json();

            setAttendanceCount(
                _data?.data[0] || {
                    total_present_count: 0,
                    total_student_count: 0,
                }
            );
        } catch (error) {
            return undefined;
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!url || !slot) return;
        // fetchAndSetAttendanceCount();

        const interval = setInterval(() => {
            fetchAndSetAttendanceCount();
        }, 5000);

        return () => clearInterval(interval);
    }, [url, slot]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Attendance</Text>
            <Text style={styles.count}>
                {attendanceCount.total_present_count} / {attendanceCount.total_student_count}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    label: {
        fontSize: 18,
        color: '#555',
        fontWeight: '500',
        marginBottom: 6,
    },
    count: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2b2b2b',
    },
});

export default AttendanceCountComponent;

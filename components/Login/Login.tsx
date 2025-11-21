import { setCurrentLoggedInProcessData } from '@/components/store/auth-slice';
import BtnPrimary from '@/components/UI/BtnPrimary';
import BtnSecondary from '@/components/UI/BtnSecondary';
import InputLabel from '@/components/UI/InputLabel';
import { styles } from '@/constants/styles';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Loading from '../UI/Loading';
import { cleanupUrl } from '../utils/help';
import { getProcessList } from './api';
import {
    CurrentLoggedInSlot,
    ExamCenterDetails,
    LoginFormData,
    ProcessData,
    SlotDetails,
} from './types';

const defaultLoginFormValue: LoginFormData = {
    username: '', // Set the dummy username
    password: '', // Set the dummy password
    processUrl: '',
    slot: {
        ca_batch_slot: '',
        ca_batch_time: '',
    },
    date: '',
    center: {
        ca_center_code: '',
        ca_center_name: '',
    },
};

export default function Login() {
    const inset = useSafeAreaInsets();

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [allotmentDetails, setAllotmentDetails] = useState([]);

    const [examDates, setExamDates] = useState([]);
    const [examCentersList, setExamCentersList] = useState<ExamCenterDetails[]>([]);
    const [examSlotsList, setExamSlotsList] = useState<SlotDetails[]>([]);
    const dispatch = useDispatch();
    const [processList, setProcessList] = useState<ProcessData[]>([]);

    async function getAndSetProcessList() {
        setIsLoading(true);
        const _data = await getProcessList();
        setProcessList(_data);
        setIsLoading(false);
    }

    useEffect(() => {
        getAndSetProcessList();
    }, []);

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset,
    } = useForm({
        defaultValues: defaultLoginFormValue,
    });

    const onSubmit = useCallback(async (formData: LoginFormData) => {
        try {
            const url = `${formData.processUrl}/api/login`;

            setIsLoading(true);

            const _resp = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!_resp.ok) {
                const errResp = await _resp.json();
                throw new Error(errResp?.errMsg || 'Not able to login');
            }

            const data = await _resp.json();

            let currentLoggedinSlotData: CurrentLoggedInSlot = data?.data?._loginDetails[0] || [];
            currentLoggedinSlotData.slot = formData.slot;

            currentLoggedinSlotData.date = formData.date;
            currentLoggedinSlotData.center = formData.center;

            const processData = data?.data?._processData[0] || [];

            dispatch(
                setCurrentLoggedInProcessData({
                    processData,
                    currentLoggedinSlotData,
                })
            );

            router.replace('/tabs/scan');
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Not able to login', [
                {
                    text: 'OK',
                    onPress: () => {},
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchAllotmentDetails = useCallback(async (url: string) => {
        try {
            setIsLoading(true);
            const _resp = await fetch(`${url}/api/get-allotment-info`);
            if (!_resp.ok) throw new Error('Unable to get allotment details');
            const jsonData = await _resp.json();
            if (jsonData.data) {
                setAllotmentDetails(jsonData.data);
            }
        } catch (err) {
            Alert.alert('Warning', err?.message || 'Try again after some time.', [
                {
                    text: 'OK',
                    onPress: () => {},
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getExamDates = useCallback(async (url: string) => {
        try {
            setIsLoading(true);
            const _resp = await fetch(`${url}/api/get-exam-dates`);
            if (!_resp.ok) throw new Error('Unable to get exam dates');
            const jsonData = await _resp.json();
            if (jsonData.data) {
                setExamDates(jsonData.data);
            }
        } catch (err) {
            console.log(1);
            Alert.alert('Warning', err?.message || 'Try again after some time.', [
                {
                    text: 'OK',
                    onPress: () => {},
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const watchProcessUrl = watch('processUrl');
    useEffect(() => {
        if (watchProcessUrl) {
            // fetchAllotmentDetails(watchProcessUrl);
            getExamDates(watchProcessUrl);
        }
    }, [watchProcessUrl, setValue]);

    const watchExamDateChange = watch('date');

    useEffect(() => {
        if (watchExamDateChange) {
            getCentersList(watchProcessUrl, watchExamDateChange);
        }
    }, [watchExamDateChange, setValue]);

    const getCentersList = useCallback(async (url: string, exam_date: string) => {
        try {
            setIsLoading(true);
            const _resp = await fetch(`${url}/api/get-centers-list?exam_date=${exam_date}`);
            if (!_resp.ok) throw new Error('Unable to get centers list');
            const jsonData = await _resp.json();
            console.log(jsonData.data, '-exam Center list');
            if (jsonData.data) {
                setExamCentersList(jsonData.data);
            }
        } catch (err) {
            console.log(2);
            Alert.alert('Warning', err?.message || 'Try again after some time.', [
                {
                    text: 'OK',
                    onPress: () => {},
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const watchCenterChange = watch('center');

    useEffect(() => {
        if (
            watchCenterChange &&
            watchCenterChange.ca_center_name &&
            watchCenterChange.ca_center_code
        ) {
            getSlotsList(watchProcessUrl, watchExamDateChange, watchCenterChange.ca_center_code);
        }
    }, [watchCenterChange, setValue]);

    const getSlotsList = useCallback(
        async (url: string, exam_date: string, center_code: string) => {
            try {
                setIsLoading(true);
                const _resp = await fetch(
                    `${url}/api/get-slots-list?exam_date=${exam_date}&center_code='${center_code}'`
                );
                if (!_resp.ok) throw new Error('Unable to get slots list');
                const jsonData = await _resp.json();
                if (jsonData.data) {
                    setExamSlotsList(jsonData.data);
                }
            } catch (err) {
                console.log(3);
                Alert.alert('Warning', err?.message || 'Try again after some time.', [
                    {
                        text: 'OK',
                        onPress: () => {},
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <SafeAreaView
            edges={['top', 'bottom']}
            style={{
                flex: 1,
                padding: 10,
            }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? inset.top + 80 : 100}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: inset.bottom + 160 }}
                style={{ flex: 1 }}>
                <ScrollView
                // contentContainerStyle={{ flexGrow: 1, paddingBottom: inset.bottom + 250 }}
                >
                    <Text style={styles.header}>Welcome</Text>
                    <Text style={styles.subHeader}>Biometric Attendance</Text>

                    <Controller
                        control={control}
                        name="processUrl"
                        rules={{ required: 'Select Exam' }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputContainer}>
                                <InputLabel>Select Exam</InputLabel>
                                <Picker
                                    style={styles.input}
                                    selectedValue={value}
                                    onValueChange={onChange}>
                                    <Picker.Item label="-- Select --" />
                                    {processList.map((process, idx) => {
                                        return (
                                            <Picker.Item
                                                key={idx}
                                                label={process.process_name}
                                                value={cleanupUrl(process.process_url)}
                                            />
                                        );
                                    })}
                                </Picker>

                                {errors.processUrl && (
                                    <Text style={styles.error}>{errors.processUrl.message}</Text>
                                )}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="date"
                        rules={{ required: 'Select Date' }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputContainer}>
                                <InputLabel>Select Date</InputLabel>
                                <Picker
                                    style={styles.input}
                                    selectedValue={value}
                                    onValueChange={onChange}>
                                    <Picker.Item label="-- Select --" />
                                    {examDates.map((_el, idx) => {
                                        return (
                                            <Picker.Item
                                                key={idx}
                                                // label={`${_el.ai_collage_name} : ${_el.ai_slot_time}`}
                                                label={`${_el.exam_date}`}
                                                value={_el.exam_date}
                                                style={{}}
                                            />
                                        );
                                    })}
                                </Picker>

                                {errors.date && (
                                    <Text style={styles.error}>{errors.date.message}</Text>
                                )}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="center"
                        rules={{ required: 'Select Center' }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputContainer}>
                                <InputLabel>Select Center</InputLabel>
                                <Picker
                                    style={styles.input}
                                    selectedValue={value}
                                    onValueChange={onChange}>
                                    <Picker.Item label="-- Select --" />
                                    {examCentersList.map((_el, idx) => {
                                        return (
                                            <Picker.Item
                                                key={idx}
                                                // label={`${_el.ai_collage_name} : ${_el.ai_slot_time}`}
                                                label={` (${_el.ca_center_code}) ${_el.ca_center_name}`}
                                                // value={_el.ca_center_code}
                                                value={_el}
                                                style={{}}
                                            />
                                        );
                                    })}
                                </Picker>

                                {errors.center && (
                                    <Text style={styles.error}>{errors.center.message}</Text>
                                )}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="slot"
                        rules={{ required: 'Select Slot' }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputContainer}>
                                <InputLabel>Select Slot</InputLabel>
                                <Picker
                                    style={styles.input}
                                    selectedValue={value}
                                    onValueChange={onChange}>
                                    <Picker.Item label="-- Select --" />
                                    {examSlotsList.map((_el, idx) => {
                                        return (
                                            <Picker.Item
                                                key={idx}
                                                label={`(Slot-${_el.ca_batch_slot}) ${_el.ca_batch_time}`}
                                                value={_el}
                                                // value={_el.ca_batch_slot}
                                                style={{}}
                                            />
                                        );
                                    })}
                                </Picker>

                                {errors.slot && (
                                    <Text style={styles.error}>{errors.slot.message}</Text>
                                )}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="username"
                        rules={{ required: 'Username is required' }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputContainer}>
                                <InputLabel>Username</InputLabel>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Username"
                                    onChangeText={onChange}
                                    value={value}
                                />
                                {errors.username && (
                                    <Text style={styles.error}>{errors.username.message}</Text>
                                )}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        rules={{ required: 'Password is required' }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputContainer}>
                                <InputLabel>Password</InputLabel>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    onChangeText={onChange}
                                    value={value}
                                />
                                {errors.username && (
                                    <Text style={styles.error}>{errors?.password?.message}</Text>
                                )}
                            </View>
                        )}
                    />
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 10,
                        }}>
                        <BtnPrimary title={'Login'} onPress={handleSubmit(onSubmit)} />

                        <BtnSecondary
                            title={'Refresh'}
                            onPress={() => {
                                reset(defaultLoginFormValue);
                                setExamSlotsList([]);
                                setExamCentersList([]);
                                setExamDates([]);
                                getAndSetProcessList();
                            }}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

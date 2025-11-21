// import axios from 'axios';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import * as FileSystem from 'expo-file-system';

import { RootState } from '@/components/store/store';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import CandidateProfilePhoto from '@/components/CandidateProfilePhoto';
import CandidateSignature from '@/components/CandidateSignature';
import BtnPrimary from '@/components/UI/BtnPrimary';
import BtnSecondary from '@/components/UI/BtnSecondary';
import Loading from '@/components/UI/Loading';
import { styles } from '@/constants/styles';
import { CandidateDataSliceInterface } from '@/types/candidateDataSliceInterface';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Button, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const initialState: CandidateDataSliceInterface = {
    qrData: {
        f_id: 0,
        r_id: 0,
        slot: 0,
        roll_no: 0,
    },
    candidateAllDetails: {
        ca: {
            id: 0,
            ub_aadhar_number: '',
            ub_alternative_number: '',
            ub_email_id: '',
            ub_first_name: '',
            ub_last_name: '',
            ub_middle_name: '',
            ub_mobile_number: '',
            ub_otp: '',
            ub_pan_card: '',
            ub_password: '',
        },
        ht: {
            id: 0,
            ca_reg_id: 0,

            ca_photo: '',
            ca_sign: '',
            ca_approved_photo: '',
            ca_is_approved: '',

            ca_alloted_lab_id: 0,
            exam_date: '',
            lab_name: '',
            department: '',
            ca_gender: '',
            ca_batch_time: '',
        },
        slot: {
            id: 0,
            entry_time: '',
            gate_close_time: '',
            slot: '',
            time: '',
        },
        s3BucketUrl: '',
    },
};

const CandidateInfo = () => {
    const inset = useSafeAreaInsets();
    const { rollNumber } = useLocalSearchParams();

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [candidateAllData, setCandidateAllData] =
        useState<CandidateDataSliceInterface>(initialState);

    const authSlice = useSelector((state: RootState) => state.authSlice);

    const processData = useSelector(
        (state: RootState) => state.authSlice.currentLoggedInProcessData
    );

    const currentLoggedInUserId = useSelector(
        (state: RootState) => state.authSlice.currentLoggedinSlotData.id
    );

    useEffect(() => {
        if (rollNumber) {
            getStudentByRollNumber(rollNumber);
        } else {
            router.replace('/tabs/scan');
        }

        return () => {
            resetStates();
        };
    }, [rollNumber]);

    async function resetStates() {
        await clearCameraCache();
    }

    async function clearCameraCache() {
        try {
            const cameraDir = FileSystem.cacheDirectory + 'Camera';
            const imageManupulatorDir = FileSystem.cacheDirectory + 'ImageManipulator';

            const cameraFiles = await FileSystem.readDirectoryAsync(cameraDir);
            const imageManipulatorFiles = await FileSystem.readDirectoryAsync(imageManupulatorDir);

            const contentsInCamDir = await FileSystem.readDirectoryAsync(cameraDir);
            const contentsInImageManipulatorDir = await FileSystem.readDirectoryAsync(
                imageManupulatorDir
            );

            if (contentsInCamDir.length !== 0) {
                for (let file of cameraFiles) {
                    console.log(`Clearing camera cache file: ${file}`);
                    await FileSystem.deleteAsync(cameraDir + '/' + file, { idempotent: true });
                }
            }

            if (contentsInImageManipulatorDir.length !== 0) {
                for (let file of imageManipulatorFiles) {
                    console.log(`Clearing image manipulator cache file: ${file}`);
                    await FileSystem.deleteAsync(imageManupulatorDir + '/' + file, {
                        idempotent: true,
                    });
                }
            }
        } catch (error) {
            console.error('Error clearing camera cache:', error);
        }
    }

    const { p: process, ca: candidate, ht: hallticket, slot, s3BucketUrl } = candidateAllData;

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    const [isPictureTaken, setIsPictureTaken] = useState(false);
    const [isTakingPicture, setIsTakingPicture] = useState(false);
    const [photoUri, setPhotoUri] = useState('');
    const cameraRef = useRef(null);

    const [isCandidateApproved, setIsCandidateApproved] = useState(false);
    const [isApproving, setIsApproving] = useState(false);

    let [justApproved, setJustApproved] = useState(false);

    const openCamera = useCallback(() => setIsCameraOpen(true), []);
    const closeCamera = useCallback(() => setIsCameraOpen(false), []);

    useEffect(() => {
        if (hallticket?.ca_is_approved && hallticket?.ca_approved_photo) {
            if (hallticket.ca_is_approved === 'NO') {
                setIsCandidateApproved(false);
                setPhotoUri('');
            } else {
                setIsCandidateApproved(true);
            }
        }
    }, [hallticket]);

    if (permission) {
        if (!permission.granted) {
            return (
                <View style={styles.container}>
                    <Text style={styles.message}>We need your permission to show the camera</Text>
                    <Button onPress={requestPermission} title="Grant Permission" />
                </View>
            );
        }
    }

    const handleTakePicture = async () => {
        setJustApproved(false);
        setIsTakingPicture(true);
        setIsCandidateApproved(false);
        try {
            if (cameraRef.current) {
                const data = await cameraRef.current.takePictureAsync({
                    shutterSound: false,
                    // skipProcessing: true,
                    quality: 0.2, // Adjust the quality as needed
                });

                const fileinfo = await FileSystem.getInfoAsync(data.uri);

                if (!fileinfo.exists) {
                    throw new Error('File does not exist');
                }
                setPhotoUri(data.uri);
                setIsPictureTaken(true);
                closeCamera();
            }
        } catch (error) {
            Alert.alert('Info', 'Unable to take picture, try again later', [
                {
                    text: 'OK',
                    onPress: () => {
                        setIsTakingPicture(false);
                        closeCamera();
                    },
                },
            ]);
        } finally {
            setIsTakingPicture(false);
        }
    };

    const compressImage = async (uri, maxWidth = 800, maxHeight = 800, quality = 20) => {
        try {
            const result = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: maxWidth, height: maxHeight } }],
                { compress: quality / 100, format: ImageManipulator.SaveFormat.JPEG }
            );
            return result.uri;
        } catch (error) {
            throw new Error('Image compression failed');
        }
    };

    async function readFile(uri) {
        try {
            const fileContent = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64, // You can choose the encoding as needed
            });

            return fileContent; // You can send this base64 content to your server if necessary
        } catch (error) {
            Alert.alert('Info', 'File read');
        }
    }

    const handleApprove = async () => {
        if (isApproving) return;
        try {
            setIsApproving(true);
            if (!photoUri) {
                throw new Error('Please capture candidate photo');
            }

            const sendData = new FormData();

            const { ca_roll_number, id, ca_reg_id } = hallticket;

            sendData.set('rollNo', ca_roll_number);
            sendData.set('f_id', id);
            sendData.set('r_id', ca_reg_id);
            sendData.set('approved_by_user_id', `${currentLoggedInUserId}`);

            const compressedPhotoUri = await compressImage(photoUri);
            const fileBase64 = (await readFile(compressedPhotoUri)) as string;

            const base64Data = fileBase64.replace(/^data:image\/(jpeg|jpg|png);base64,/, '');

            sendData.set('candidatePhoto', base64Data);

            let url = `${processData.p_form_filling_site}/api/save-approval-details`;
            const _resp = await fetch(url, {
                method: 'POST',
                body: sendData,
            });

            if (!_resp.ok) {
                const jsonResp = await _resp.json()
                throw new Error(jsonResp?.errMsg || 'Error while approving');
            }

            setJustApproved(true);
        } catch (err) {
            console.log(err, '-err==========');
            Alert.alert('Info', err?.message || 'Unable to approve candidate, try again later', [
                {
                    text: 'ok',
                    onPress: () => {},
                },
            ]);
            setIsApproving(false);
        } finally {
            setIsApproving(false);
        }
    };

    const getStudentByRollNumber = async (rollNumber: string | number | undefined) => {
        try {
            if (!rollNumber) {
                throw new Error('Invalid roll no');
            }

            const url = `${authSlice.currentLoggedInProcessData.p_form_filling_site}/api/get-ht-details-by-roll-no?roll_no=${rollNumber}`;

            const _resp = await fetch(url);
            const jsonData = await _resp.json();

            if (!_resp.ok) {
                throw new Error(jsonData?.errMsg || 'No candidate found1');
            }

            if (authSlice?.currentLoggedinSlotData.slot != jsonData?.data?.slot?.slot || 0) {
                throw new Error('No candidate found2');
            } else {
                setCandidateAllData(jsonData?.data || []);
            }
            setIsLoading(false);
        } catch (error) {
            console.log(error, '=err=============');
            Alert.alert('Info', error?.message || 'No candidate found3', [
                {
                    text: 'OK',
                    onPress: () => {
                        setIsLoading(false);
                        router.replace('/tabs/scan');
                    },
                },
            ]);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <SafeAreaView
            edges={['bottom']}
            style={{
                flex: 1,
                // padding: 10,
                paddingBottom: inset.bottom,
            }}>
            {/* <View style={styles.container}> */}

            <CapturePhoto
                isTakingPicture={isTakingPicture}
                isCameraOpen={isCameraOpen}
                cameraRef={cameraRef}
                handleTakePicture={handleTakePicture}
                closeCamera={closeCamera}
            />

            {!isCameraOpen && (
                <>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.ticket}>
                            <View style={styles.photoAndSignContainer}>
                                {/* User Photo */}

                                <CandidateProfilePhoto
                                    s3BucketUrl={s3BucketUrl}
                                    photo={hallticket?.ca_photo || ''}
                                />

                                <TouchableOpacity onPress={openCamera}>
                                    {/* Caputred image Image */}

                                    {isCandidateApproved || isPictureTaken ? (
                                        <Image
                                            style={styles.photo}
                                            source={{
                                                // uri: isPictureTaken ? photoUri : captureImagePlaceholder,
                                                uri:
                                                    photoUri ||
                                                    `${
                                                        processData.p_form_filling_site
                                                    }/assets/images/qr-captures/${encodeURIComponent(
                                                        hallticket?.ca_approved_photo
                                                    )}`,
                                            }}
                                        />
                                    ) : (
                                        <View style={[styles.photo]}>
                                            <AntDesign
                                                name="camera"
                                                size={44}
                                                color="black"
                                                style={{
                                                    color: '#00bc7d',
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%,-50%)',
                                                }}
                                            />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>

                            <CandidateSignature
                                s3BucketUrl={s3BucketUrl}
                                sign={hallticket?.ca_sign || ''}
                            />

                            <View
                                style={{
                                    // backgroundColor: '#cefafe',
                                    padding: 8,
                                    borderRadius: 8,
                                    gap: 8,
                                    marginBottom: 5,
                                }}>
                                <Text
                                    style={{
                                        backgroundColor: '#009689',
                                        padding: 8,
                                        borderRadius: 5,
                                        color: '#fff',
                                        fontWeight: 700,
                                        letterSpacing: 0.5,
                                    }}>
                                    {`${candidate?.ub_first_name} ${candidate?.ub_middle_name} ${candidate?.ub_last_name}`}
                                </Text>
                                <Text style={{ fontSize: 15, fontWeight: 600 }}>
                                    Allotment details
                                </Text>

                                <Text
                                    style={{
                                        backgroundColor: '#009689',
                                        padding: 8,
                                        borderRadius: 5,
                                        color: '#fff',
                                        fontWeight: 500,
                                        letterSpacing: 0.5,
                                    }}>
                                    Center : {hallticket?.ca_center_name || 'N/A'}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        gap: 5,
                                    }}>
                                    <Text
                                        style={{
                                            backgroundColor: '#009689',
                                            padding: 8,
                                            borderRadius: 5,
                                            color: '#fff',
                                            fontWeight: 500,
                                            letterSpacing: 0.5,
                                        }}>
                                        Department : {hallticket?.department || 'N/A'}
                                    </Text>

                                    <Text
                                        style={{
                                            backgroundColor: '#009689',
                                            padding: 8,
                                            borderRadius: 5,
                                            color: '#fff',
                                            fontWeight: 500,
                                            letterSpacing: 0.5,
                                        }}>
                                        Lab : {hallticket?.lab_name || 'N/A'}
                                    </Text>
                                    <Text
                                        style={{
                                            backgroundColor: '#009689',
                                            padding: 8,
                                            borderRadius: 5,
                                            color: '#fff',
                                            fontWeight: 500,
                                            letterSpacing: 0.5,
                                        }}>
                                        Floor : {hallticket?.floor || 'N/A'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.details}>
                                <DetailRow label="Seat Number" value={hallticket?.ca_roll_number} />
                                <DetailRow label="Form Number" value={hallticket?.id} />
                                <DetailRow
                                    label="Post Name"
                                    value={hallticket?.ca_post_name?.toUpperCase()}
                                />
                                <DetailRow
                                    label="Gender"
                                    value={hallticket?.ca_gender?.toUpperCase()}
                                />
                                <DetailRow label="Exam Date" value={`${hallticket?.exam_date}`} />
                                <DetailRow label="Exam Time" value={`${slot?.time}`} />
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.buttonWrapper}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                width: '100%',
                            }}>
                            <BtnPrimary
                                styleForChildren={{
                                    backgroundColor:
                                        isCandidateApproved || justApproved ? 'green' : '#007595',
                                    opacity: isApproving ? 0.5 : 1,
                                }}
                                title={
                                    isApproving
                                        ? 'Approving...'
                                        : isCandidateApproved || justApproved
                                        ? 'Present'
                                        : 'Approve'
                                }
                                disabled={isApproving || isCandidateApproved || justApproved}
                                onPress={handleApprove}
                            />

                            <BtnSecondary
                                title={!photoUri ? 'Take Snap' : 'Retake Snap'}
                                onPress={openCamera}
                            />
                        </View>
                    </View>
                </>
            )}
            {/* </View> */}
        </SafeAreaView>
    );
};

const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const CapturePhoto = ({
    isTakingPicture,
    isCameraOpen,
    cameraRef,
    handleTakePicture,
    closeCamera,
}: {
    isTakingPicture: boolean;
    isCameraOpen: boolean;
    cameraRef: any;
    handleTakePicture: () => {};
    closeCamera: () => void;
}) => {
    return (
        <>
            {isCameraOpen && (
                <CameraView style={styles.fullScreenCamera} ref={cameraRef}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.snapButton,
                                styles.buttonPrimary,
                                isTakingPicture && { opacity: 0.5 },
                            ]}
                            onPress={handleTakePicture}
                            disabled={isTakingPicture}>
                            <Text style={[styles.text, styles.scannerButtonText]}>
                                {isTakingPicture && (
                                    <AntDesign name="loading1" size={34} color="white" />
                                )}
                                {!isTakingPicture && (
                                    <Feather name="camera" size={34} color="white" />
                                )}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.closeButton, styles.buttonDanger]}
                            onPress={closeCamera}>
                            <Text style={[styles.text, styles.scannerButtonText]}>
                                <Fontisto name="close" size={34} color="white" />
                            </Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            )}
        </>
    );
};

export default CandidateInfo;

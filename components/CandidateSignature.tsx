import { View, Text, Image } from 'react-native';
import React, { memo, useState } from 'react';
import { styles } from '@/constants/styles';
import AntDesign from '@expo/vector-icons/AntDesign';

interface CandidateProfilePhotoPropsInterface {
    s3BucketUrl: string;
    sign: string;
}

const CandidateSignature: React.FC<CandidateProfilePhotoPropsInterface> = ({
    s3BucketUrl,
    sign,
}) => {
    const [isImageLoading, setIsImageLoading] = useState(false);

    return (
        <>
            <View style={styles.signContainer}>
                <View style={styles.signWrapper}>
                    <Image
                        style={styles.signPhoto}
                        source={{
                            uri: `${s3BucketUrl}/${sign}?t=${Date.now()}`,
                        }}
                        onLoadStart={() => setIsImageLoading(true)}
                        onLoadEnd={() => setIsImageLoading(false)}
                    />

                    {isImageLoading && (
                        <AntDesign
                            name="loading1"
                            size={24}
                            color="black"
                            style={{
                                color: '#00bc7d',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%,-50%)',
                            }}
                        />
                    )}
                </View>
            </View>
        </>
    );
};

export default memo(CandidateSignature);

import { View, Text, Image } from 'react-native';
import React, { memo, useState } from 'react';
import { styles } from '@/constants/styles';
import AntDesign from '@expo/vector-icons/AntDesign';

interface CandidateProfilePhotoPropsInterface {
    s3BucketUrl: string;
    photo: string;
}

const CandidateProfilePhoto: React.FC<CandidateProfilePhotoPropsInterface> = ({
    s3BucketUrl,
    photo,
}) => {
    const [isImageLoading, setIsImageLoading] = useState(false);

    return (
        <>
            <View style={[styles.photo]}>
                <Image
                    style={styles.photo}
                    source={{
                        uri: `${s3BucketUrl}${photo}?t=${Date.now()}`,
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
        </>
    );
};

export default memo(CandidateProfilePhoto);

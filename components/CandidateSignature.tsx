import { View, Image } from 'react-native';
import React, { memo, useMemo, useState } from 'react';
import { styles } from '@/constants/styles';
import AntDesign from '@expo/vector-icons/AntDesign';

interface CandidateSignaturePropsInterface {
    s3BucketUrl: string;
    sign: string;
    cacheKey?: string | number;
}

const CandidateSignature: React.FC<CandidateSignaturePropsInterface> = ({
    s3BucketUrl,
    sign,
    cacheKey,
}) => {
    const [isImageLoading, setIsImageLoading] = useState(false);

    const signUrl = useMemo(() => {
        if (!s3BucketUrl || !sign) {
            return '';
        }

        const baseUrl = s3BucketUrl.replace(/\/+$/, '');
        const signName = sign.replace(/^\/+/, '');

        const url = `${baseUrl}/${signName}`;

        return cacheKey ? `${url}?t=${cacheKey}` : url;
    }, [s3BucketUrl, sign, cacheKey]);

    console.log('CandidateSignature URL:', signUrl);

    if (!signUrl) {
        return null;
    }

    return (
        <View style={styles.signContainer}>
            <View style={styles.signWrapper}>
                <Image
                    style={styles.signPhoto}
                    source={{
                        uri: signUrl,
                    }}
                    resizeMode="contain"
                    onLoadStart={() => setIsImageLoading(true)}
                    onLoad={() => {
                        setIsImageLoading(false);
                        console.log('Candidate signature loaded');
                    }}
                    onLoadEnd={() => setIsImageLoading(false)}
                    onError={(error) => {
                        setIsImageLoading(false);
                        console.log(
                            'Candidate signature error:',
                            error.nativeEvent,
                        );
                    }}
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
                            transform: [
                                { translateX: -12 },
                                { translateY: -12 },
                            ],
                        }}
                    />
                )}
            </View>
        </View>
    );
};

export default memo(CandidateSignature);
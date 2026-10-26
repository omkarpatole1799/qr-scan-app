// import { View, Text, Image } from 'react-native';
// import React, { memo, useState } from 'react';
// import { styles } from '@/constants/styles';
// import AntDesign from '@expo/vector-icons/AntDesign';

// interface CandidateProfilePhotoPropsInterface {
//     s3BucketUrl: string;
//     photo: string;
// }

// const CandidateProfilePhoto: React.FC<CandidateProfilePhotoPropsInterface> = ({
//     s3BucketUrl,
//     photo,
// }) => {
//     const [isImageLoading, setIsImageLoading] = useState(false);

//     return (
//         <>
//             <View style={[styles.photo]}>
//                     <Image
//                         style={styles.photo}
//                         source={{
//                         uri: `${s3BucketUrl}${photo}?t=${Date.now()}`,
//                         }}
//                         onLoadStart={() => setIsImageLoading(true)}
//                         onLoadEnd={() => setIsImageLoading(false)}
//                     />

//                 {isImageLoading && (
//                     <AntDesign
//                         name="loading1"
//                         size={24}
//                         color="black"
//                         style={{
//                             color: '#00bc7d',
//                             position: 'absolute',
//                             top: '50%',
//                             left: '50%',
//                             transform: 'translate(-50%,-50%)',
//                         }}
//                     />
//                 )}
//             </View>
//         </>
//     );
// };

// export default memo(CandidateProfilePhoto);



import { View, Image } from 'react-native';
import React, { memo, useMemo, useState } from 'react';
import { styles } from '@/constants/styles';
import AntDesign from '@expo/vector-icons/AntDesign';

interface CandidateProfilePhotoPropsInterface {
    s3BucketUrl: string;
    photo: string;
    cacheKey?: string | number;
}

const CandidateProfilePhoto: React.FC<CandidateProfilePhotoPropsInterface> = ({
    s3BucketUrl,
    photo,
    cacheKey,
}) => {
    const [isImageLoading, setIsImageLoading] = useState(false);

    const photoUrl = useMemo(() => {
        if (!s3BucketUrl || !photo) {
            return '';
        }

        const baseUrl = s3BucketUrl.replace(/\/+$/, '');
        const photoName = photo.replace(/^\/+/, '');

        const url = `${baseUrl}/${photoName}`;

        return cacheKey ? `${url}?t=${cacheKey}` : url;
    }, [s3BucketUrl, photo, cacheKey]);

    console.log('CandidateProfilePhoto URL:', photoUrl);

    if (!photoUrl) {
        return (
            <View style={styles.photo}>
                <AntDesign
                    name="picture"
                    size={40}
                    color="#00bc7d"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: [{ translateX: -20 }, { translateY: -20 }],
                    }}
                />
            </View>
        );
    }

    return (
        <View style={styles.photo}>
            <Image
                style={styles.photo}
                source={{
                    uri: photoUrl,
                }}
                resizeMode="cover"
                onLoadStart={() => setIsImageLoading(true)}
                onLoad={() => {
                    setIsImageLoading(false);
                    console.log('Candidate profile image loaded');
                }}
                onLoadEnd={() => setIsImageLoading(false)}
                onError={(error) => {
                    setIsImageLoading(false);
                    console.log(
                        'Candidate profile image error:',
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
                        transform: [{ translateX: -12 }, { translateY: -12 }],
                    }}
                />
            )}
        </View>
    );
};

export default memo(CandidateProfilePhoto);
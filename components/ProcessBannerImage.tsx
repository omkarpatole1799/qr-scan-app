import React from 'react';
import { Image, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

const ProcessBannerImage = () => {
    const processUrl = useSelector(
        (state: RootState) => state.authSlice.currentLoggedInProcessData.p_form_filling_site
    );

    console.log(`${processUrl}/assets/images/brand-name.jpg`, '-banner=========');
    return (
        <>
            {processUrl && (
                <View
                    style={{
                        height: 100,
                        width: '100%',
                        borderRadius: 10,
                        overflow: 'hidden',
                    }}>
                    <Image
                        style={{
                            height: '100%',
                            width: '100%',
                            resizeMode: 'stretch',
                        }}
                        source={{
                            uri: `${processUrl}/assets/images/brand-name.jpg`,
                        }}
                    />
                </View>
            )}
        </>
    );
};

export default ProcessBannerImage;

import React, { memo } from 'react';
import { Image, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

const ProcessBannerImage = () => {
    const headerUrl = useSelector(
        (state: RootState) => state.authSlice.currentLoggedInProcessData.headerUrl,
    );

    return (
        <>
            {headerUrl && (
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
                            uri: `${headerUrl}`,
                        }}
                    />
                </View>
            )}
        </>
    );
};

export default memo(ProcessBannerImage);

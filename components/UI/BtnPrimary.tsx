import { styles } from '@/constants/styles';
import React from 'react';
import { Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface BtnPrimaryPropsInterface {
    title: string | React.ReactNode;
    onPress: () => void;
    styleForWrapper?: ViewStyle;
    styleForChildren?: TextStyle | {};
    disabled?: boolean;
}

const BtnPrimary: React.FC<BtnPrimaryPropsInterface> = ({
    title,
    onPress,
    styleForWrapper,
    styleForChildren,
    disabled,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[{ borderRadius: 5 }, styleForWrapper, disabled ? styles.disabledButton : '']}
            disabled={disabled}>
            <Text style={[styles.buttonBase, styles.buttonPrimary, styleForChildren]}>{title}</Text>
        </TouchableOpacity>
    );
};

export default BtnPrimary;

import { View, Text } from 'react-native';
import React from 'react';
import { styles } from '@/constants/styles';

const InputLabel = ({ children }: { children: React.ReactNode }) => {
	return <Text style={styles.inputLabel}>{children}</Text>;
};

export default InputLabel;

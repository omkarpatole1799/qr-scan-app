import { UTTIRNA_URL } from '@/constants/Colors';
import { Alert } from 'react-native';

export async function getProcessList() {
    try {
        const url = `${UTTIRNA_URL}/api/get-process-list`;
        const _resp = await fetch(url);
        const _data = await _resp.json();
        return JSON.parse(_data.data) || [];
    } catch (error) {
        Alert.alert('Error', 'Unable to get exam list', [
            {
                text: 'ok',
                onPress: () => {},
            },
        ]);
        console.log(error);
    }
}

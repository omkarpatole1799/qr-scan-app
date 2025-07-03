import { createSlice } from '@reduxjs/toolkit';

interface AuthSliceInterface {
    isAuth: boolean;
    currentLoggedInProcessData: {
        p_form_filling_site: string;
    };
    currentLoggedinSlotData: {
        id: number;
        password: string;
        processUrl: string;
        roll: string;
        slot: string;
        user_name: string;
    };
}

const initialState: AuthSliceInterface = {
    isAuth: false,
    currentLoggedInProcessData: {
        p_form_filling_site: '',
    },
    currentLoggedinSlotData: {
        // This is current logged in user details (i.e. slot)
        id: 0,
        password: '',
        processUrl: '',
        roll: '',
        slot: '',
        user_name: '',
    },
};

// const initialState: AuthSliceInterface = {
//     isAuth: true,
//     currentLoggedInProcessData: {
//         p_form_filling_site: 'http://192.168.1.7:3001',
//     },
//     currentLoggedinSlotData: {
//         // This is current logged in user details (i.e. slot)
//         id: 0,
//         user_name: 'test',
//         password: 'test',
//         processUrl: 'http://192.168.1.7:3001',
//         roll: 'BIOMETRIC',
//         slot: '09:00 AM TO 11:00 AM',
//     },
// };

const authSlice = createSlice({
    name: 'auth-slice',
    initialState,
    reducers: {
        setCurrentLoggedInProcessData: (state, action) => {
            state.currentLoggedInProcessData = action.payload.processData;
            state.currentLoggedinSlotData = action.payload.currentLoggedinSlotData;
        },

        resetAuthState: (state) => {
            state.isAuth = false;
            state.currentLoggedInProcessData = initialState.currentLoggedInProcessData;
            state.currentLoggedinSlotData = initialState.currentLoggedinSlotData;
        },
    },
});

export const { setCurrentLoggedInProcessData, resetAuthState } = authSlice.actions;
export default authSlice;

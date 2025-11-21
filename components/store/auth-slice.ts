import { createSlice } from '@reduxjs/toolkit';
import { AuthSliceInterface } from '../Login/types';

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
        slot: {
            ca_batch_slot: '',
            ca_batch_time: '',
        },
        date: '',
        center: {
            ca_center_code: '',
            ca_center_name: ' 2',
        },
        user_name: '',
    },
};

// const initialState: AuthSliceInterface = {
//     isAuth: true,
//     currentLoggedInProcessData: {
//         p_form_filling_site: 'http://192.168.1.24:3001',
//     },
//     currentLoggedinSlotData: {
//         // This is current logged in user details (i.e. slot)
//         id: 0,
//         user_name: 'test',
//         password: 'test',
//         processUrl: 'http://192.168.1.24:3001',
//         roll: 'ADMIN',
//         slot: {
//             ca_batch_slot: '1',
//             ca_batch_time: '04:00 PM TO 05:30 PM',
//         },
//         date: '02-12-2025',
//         center: {
//             ca_center_code: '102',
//             ca_center_name: 'Center 2',
//         },
//     },
// };

const authSlice = createSlice({
    name: 'auth-slice',
    initialState,
    reducers: {
        setCurrentLoggedInProcessData: (state, action) => {
            state.currentLoggedInProcessData = action.payload.processData;

            state.currentLoggedinSlotData = action.payload.currentLoggedinSlotData;
            console.log(state.currentLoggedinSlotData, 'currentLoggedinSlotData');
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

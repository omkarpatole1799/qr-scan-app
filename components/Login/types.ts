export interface LoginFormData {
    center: ExamCenterDetails;
    date: string;
    password: string;
    processUrl: string;
    slot: SlotDetails;
    username: string;
}

export interface CurrentLoggedInSlot {
    id: number;
    password: string;
    processUrl: string;
    roll: string;
    slot: SlotDetails;
    date: string;
    center: ExamCenterDetails;
    user_name: string;
}

export interface ExamCenterDetails {
    // {"ca_center_code": "102", "ca_center_name": "Center 2"}
    ca_center_code: string;
    ca_center_name: string;
}

export interface SlotDetails {
    ca_batch_slot: string;
    ca_batch_time: string;
}

export interface AuthSliceInterface {
    isAuth: boolean;
    currentLoggedInProcessData: {
        p_form_filling_site: string;
    };
    currentLoggedinSlotData: CurrentLoggedInSlot;
}

export interface ProcessData {
    id: number;
    process_name: string;
    process_url: string;
}

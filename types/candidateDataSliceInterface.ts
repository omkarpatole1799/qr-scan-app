export interface CandidateProcess {
    p_desc?: string;
    [key: string]: any;
}

export interface CandidateUserBasic {
    id?: number;
    ub_aadhar_number?: string | null;
    ub_alternative_number?: string;
    ub_email_id?: string;
    ub_first_name?: string;
    ub_last_name?: string;
    ub_middle_name?: string | null;
    ub_mobile_number?: string;
    ub_otp?: string | null;
    ub_pan_card?: string | null;
    ub_password?: string;
    [key: string]: any;
}

export interface CandidateHallTicket {
    id?: number;
    ca_reg_id?: number;
    ca_photo?: string;
    ca_photo_url?: string;
    ca_sign?: string;
    ca_sign_url?: string;
    ca_approved_photo?: string;
    ca_approved_photo_url?: string;
    ca_is_approved?: string;
    ca_alloted_lab_id?: number;
    exam_date?: string;
    lab_name?: string;
    department?: string;
    floor?: string;
    ca_gender?: string;
    ca_batch_time?: string;
    ca_center_name?: string;
    ca_roll_number?: string | number;
    ca_post_name?: string;
    [key: string]: any;
}

export interface CandidateSlot {
    id?: number;
    entry_time?: string;
    gate_close_time?: string;
    slot?: string;
    time?: string;
    ca_batch_slot?: string;
    [key: string]: any;
}

export interface CandidateDataSliceInterface {
    p?: any;
    ca?: CandidateUserBasic;
    ht?: CandidateHallTicket;
    slot?: CandidateSlot;
    s3BucketUrl?: string;
    [key: string]: any;
}

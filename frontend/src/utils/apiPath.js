export const BASE_URL = "https://vercel-backend-production-c6fa.up.railway.app"; // keep same if backend runs on 8000

export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/v1/auth/login",
        REGISTER: "/api/v1/auth/register",
        GET_USER_INFO: "/api/v1/auth/getUser",
        UPDATE_PROFILE: "/api/v1/auth/update-profile",
        FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
        RESET_PASSWORD: "/api/v1/auth/reset-password", // use with /:token

    },
    DASHBOARD: {
        GET_DATA: "/api/v1/dashboard",
    },
    WORKOUT: {
        ADD_WORKOUT: "/api/v1/workout/add",
        GET_ALL_WORKOUT: "/api/v1/workout/get",
        GET_SINGLE_WORKOUT: (id) => `/api/v1/workout/${id}`, // 👈 new
        UPDATE_WORKOUT: (id) => `/api/v1/workout/${id}`,
        DELETE_WORKOUT: (id) => `/api/v1/workout/${id}`,
    },

    NUTRITION: {
        ADD_NUTRITION: "/api/v1/nutrition/add",
        GET_ALL_NUTRITION: "/api/v1/nutrition/get",
        GET_SINGLE_NUTRITION: (id) => `/api/v1/nutrition/${id}`,
        UPDATE_NUTRITION: (id) => `/api/v1/nutrition/${id}`,
        DELETE_NUTRITION: (id) => `/api/v1/nutrition/${id}`,
    },

    IMAGE: {
        UPLOAD_IMAGE: "/api/v1/auth/upload-image",
    },
    NUTRITIONIX: {
        GET_NUTRITION_DATA: "/api/nutritionix",
    },
    TIMERLOG: {
        ADD_TIMER_LOG: "/api/v1/timerlog/add",
        GET_TIMER_LOGS: "/api/v1/timerlog/get",
    },
    FEEDBACK: {
        SUBMIT_FEEDBACK: "/api/v1/feedback/submit"
    }


};

export const APP_NAME = " Robust Auth App";
export const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;
export const ROUTES = {
    HOME :"/",
    LOGIN:"/login",
    SIGNUP:"/signup",
    DASHBOARD:"/dashboard",
    ADMIN:"/admin"
} as const

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;
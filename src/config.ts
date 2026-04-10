// src/data/mongo.ts

// Netlify Functions의 기본 경로
export const NETLIFY_FUNCTIONS_BASE = "/.netlify/functions";

export const MONGO_ENDPOINTS = {
    POSTS: `${NETLIFY_FUNCTIONS_BASE}/posts`,
    DICT: `${NETLIFY_FUNCTIONS_BASE}/posts?type=dict`,
} as const;

export const API_CONFIG = {
    NETLIFY_BASE: "/.netlify/functions",
} as const;

export const ENDPOINTS = {
    POSTS: `${API_CONFIG.NETLIFY_BASE}/posts`,
    POSTS_DICT: `${API_CONFIG.NETLIFY_BASE}/posts?type=dict`,
} as const;
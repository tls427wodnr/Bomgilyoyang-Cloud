import api from '../../api/axios.js';

const ADMIN_API = '/api/admin';

/**
 * 전체 사용자 조회
 */
export const getUsers = () => {
    return api.get(`${ADMIN_API}/users`);
};

/**
 * 탈퇴 사용자 조회
 */
export const getDeletedUsers = () => {
    return api.get(`${ADMIN_API}/users/deleted`);
};

/**
 * 사용자 상태 변경
 * @param {number} userId
 */
export const updateUserStatus = (userId) => {
    return api.patch(`${ADMIN_API}/users/${userId}/status`);
};
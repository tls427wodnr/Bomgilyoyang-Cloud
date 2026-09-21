import { useState } from 'react';

import {
    getUsers,
    getDeletedUsers,
    updateUserStatus,
} from '../../services/admin/adminService.js';

export const useAdminUsers = (handleAdminAuthError) => {
    const [users, setUsers] = useState([]);
    const [type, setType] = useState('all');
    const [loading, setLoading] = useState(false);

    const [allUserCount, setAllUserCount] = useState(0);
    const [deletedUserCount, setDeletedUserCount] = useState(0);

    /**
     * 초기 사용자 조회
     * - 전체 사용자 목록 출력
     * - 전체/탈퇴 사용자 수 동시 조회
     */
    const loadInitialUsers = async () => {
        try {
            setLoading(true);

            const [allResponse, deletedResponse] = await Promise.all([
                getUsers(),
                getDeletedUsers()
            ]);

            setUsers(allResponse.data);
            setType('all');

            setAllUserCount(allResponse.data.length);
            setDeletedUserCount(deletedResponse.data.length);

        } catch (error) {
            console.error('사용자 초기 조회 실패:', error);

            if (handleAdminAuthError(error)) {
                return;
            }

            alert('사용자 목록을 불러오지 못했습니다.');

        } finally {
            setLoading(false);
        }
    };

    /**
     * 전체 사용자 조회
     */
    const loadUsers = async () => {
        try {
            setLoading(true);

            const response = await getUsers();

            setUsers(response.data);
            setType('all');
            setAllUserCount(response.data.length);

        } catch (error) {
            console.error('전체 사용자 조회 실패:', error);

            if (handleAdminAuthError(error)) {
                return;
            }

            alert('전체 사용자 목록을 불러오지 못했습니다.');

        } finally {
            setLoading(false);
        }
    };

    /**
     * 탈퇴 사용자 조회
     */
    const loadDeletedUsers = async () => {
        try {
            setLoading(true);

            const response = await getDeletedUsers();

            setUsers(response.data);
            setType('deleted');
            setDeletedUserCount(response.data.length);

        } catch (error) {
            console.error('탈퇴 사용자 조회 실패:', error);

            if (handleAdminAuthError(error)) {
                return;
            }

            alert('탈퇴 사용자 목록을 불러오지 못했습니다.');

        } finally {
            setLoading(false);
        }
    };

    /**
     * 사용자 상태 변경
     */
    const handleUpdateUserStatus = async (userId) => {
        const confirmResult = window.confirm('사용자 상태를 변경하시겠습니까?');

        if (!confirmResult) {
            return;
        }

        try {
            await updateUserStatus(userId);

            alert('사용자 상태가 변경되었습니다.');

            await loadInitialUsers();

        } catch (error) {
            console.error('사용자 상태 변경 실패:', error);

            if (handleAdminAuthError(error)) {
                return;
            }

            alert('사용자 상태 변경에 실패했습니다.');
        }
    };

    return {
        users,
        type,
        loading,
        allUserCount,
        deletedUserCount,
        loadInitialUsers,
        loadUsers,
        loadDeletedUsers,
        handleUpdateUserStatus,
    };
};
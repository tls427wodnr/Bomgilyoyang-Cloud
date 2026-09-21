import { useNavigate } from 'react-router-dom';

export const useAdminAuthErrorHandler = () => {
    const navigate = useNavigate();

    const handleAdminAuthError = (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            alert('관리자 권한이 필요합니다.');
            navigate('/');
            return true;
        }

        return false;
    };

    return handleAdminAuthError;
};
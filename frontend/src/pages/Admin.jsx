import { useEffect, useState } from 'react';


import '../css/admin.css';

import { useAdminAuthErrorHandler } from '../hooks/admin/useAdminAuthErrorHandler.js';
import { useAdminUsers } from '../hooks/admin/useAdminUsers.js';
import { useAdminChatRooms } from '../hooks/admin/useAdminChatRooms.js';

import ChatRoomList from '../components/admin/ChatRoomList.jsx';
import ChatPopup from '../components/admin/ChatPopup.jsx';
import UserFilter from '../components/admin/UserFilter.jsx';
import UserTable from '../components/admin/UserTable.jsx';

function Admin() {

     const handleAdminAuthError = useAdminAuthErrorHandler();
     const {
        users,
        type,
        loading,
        allUserCount,
        deletedUserCount,
        loadInitialUsers,
        loadUsers,
        loadDeletedUsers,
        handleUpdateUserStatus,
    } = useAdminUsers(handleAdminAuthError);

    const {
        chatRooms,
        selectedRoom,
        chatOpen,
        loadChatRooms,
        openChatRoom,
        closeChatRoom,
    } = useAdminChatRooms(handleAdminAuthError);

    useEffect(() => {
        loadInitialUsers();
        loadChatRooms();
    }, []);


    return (
        <div className="admin-container">
            <div className="main-layout">
                <ChatRoomList
                    chatRooms={chatRooms}
                    onOpenChatRoom={openChatRoom}
                />

                <section className="content-area">
                    <ChatPopup
  chatOpen={chatOpen}
  selectedRoom={selectedRoom}
  onCloseChatRoom={closeChatRoom}
  variant="admin"
/>

                    <div className="user-container">
                        <div className="user-header">
                            <h2 className="user-title">
                                사용자 관리
                            </h2>

                            <p className="user-description">
                                회원 정보를 조회하고 관리할 수 있습니다.
                            </p>
                        </div>

                        <UserFilter
                            type={type}
                            allUserCount={allUserCount}
                            deletedUserCount={deletedUserCount}
                            onLoadUsers={loadUsers}
                            onLoadDeletedUsers={loadDeletedUsers}
                        />

                        <UserTable
                            users={users}
                            loading={loading}
                            onUpdateUserStatus={handleUpdateUserStatus}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Admin;
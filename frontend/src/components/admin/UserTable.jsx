function UserTable({
    users,
    loading,
    onUpdateUserStatus
    
}) {
    const formatDate = (dateTime) => {
    if (!dateTime) return "-";

    return dateTime.toString().substring(0, 10);
};
    const renderStatusBadge = (status) => {
        if (status === 'ACTIVE') {
            return <span className="status-active">활성</span>;
        }

        if (status === 'REMOVED') {
            return <span className="status-removed">탈퇴</span>;
        }

        if (status === 'INACTIVE') {
            return <span className="status-inactive">인증대기</span>;
        }

        return <span>-</span>;
    };

    return (
        <div className="user-table">
            <div className="table-header">
                <div>번호</div>
                <div>이름(아이디)</div>
                <div>이메일</div>
                <div>가입일</div>
                <div>상태</div>
                <div>게시글</div>
                <div>댓글</div>
                <div>관리</div>
            </div>

            {loading && (
                <div className="table-row">
                    <div>-</div>
                    <div>로딩 중...</div>
                    <div>-</div>
                    <div>-</div>
                    <div>-</div>
                    <div>0</div>
                    <div>0</div>
                    <div>-</div>
                </div>
            )}

            {!loading && users.length === 0 && (
                <div className="table-row">
                    <div>-</div>
                    <div>조회된 사용자가 없습니다.</div>
                    <div>-</div>
                    <div>-</div>
                    <div>-</div>
                    <div>0</div>
                    <div>0</div>
                    <div>-</div>
                </div>
            )}

            {!loading && users.map((user) => (
                <div
                    key={user.userId}
                    className="table-row"
                >
                    <div>{user.userId}</div>

                    <div>{user.name || '-'}</div>

                    <div>{user.email || '-'}</div>

                   <div>{formatDate(user.createdAt)}</div>

                    <div>
                        {renderStatusBadge(user.status)}
                    </div>

                    <div>{user.boardCount ?? 0}</div>

                    <div>{user.replyCount ?? 0}</div>

                    <div>
                        <button
                            type="button"
                            className="status-button"
                            onClick={() => onUpdateUserStatus(user.userId)}
                        >
                            상태변경
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default UserTable;
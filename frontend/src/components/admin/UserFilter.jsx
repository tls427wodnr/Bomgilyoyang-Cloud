function UserFilter({
    type,
    allUserCount,
    deletedUserCount,
    onLoadUsers,
    onLoadDeletedUsers
}) {
    return (
        <div className="user-manage">
            <button
                type="button"
                className={`manage-button ${type === 'all' ? 'active' : ''}`}
                onClick={onLoadUsers}
            >
                전체 사용자 ({allUserCount})
            </button>

            <button
                type="button"
                className={`manage-button ${type === 'deleted' ? 'active' : ''}`}
                onClick={onLoadDeletedUsers}
            >
                탈퇴 사용자 ({deletedUserCount})
            </button>
        </div>
    );
}

export default UserFilter;
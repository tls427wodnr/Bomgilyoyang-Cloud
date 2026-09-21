import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BoardAPI, ReplyAPI } from "../services/board/boardService";
import { BoardSidebar, Pagination } from "./BoardList";
import { useAuth } from "../hooks/auth/useAuth";
import ChatPopup from "../components/admin/ChatPopup.jsx";
import { startChatRoom } from "../services/chat/chatService.js";

function formatDateTime(str) {
    if (!str) return "";
    return str.toString().substring(0, 16).replace("T", " ");
}

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
function isImageFile(name = "") {
    return IMAGE_EXTS.some((ext) => name.toLowerCase().endsWith(ext));
}

// ── 댓글 한 줄 컴포넌트 ───────────────────────────────────
function ReplyItem({ reply, boardId, currentUserId, onUpdated, onDeleted }) {
    const [editing, setEditing]       = useState(false);
    const [editInput, setEditInput]   = useState(reply.content);
    const [loading, setLoading]       = useState(false);

     const replyUserId = reply?.userId ?? reply?.userid;

    const isReplyOwner =
        Number(replyUserId) === Number(currentUserId) || reply.owner || reply.isOwner;

    const handleUpdate = async () => {
        const content = editInput.trim();
        if (!content) { alert("내용을 입력해주세요."); return; }
        setLoading(true);
        try {
            await ReplyAPI.update(boardId, reply.replyId, content);
            setEditing(false);
            onUpdated();
        } catch (e) {
            alert("수정에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("댓글을 삭제하시겠습니까?")) return;
        try {
            await ReplyAPI.delete(boardId, reply.replyId);
            onDeleted();
        } catch (e) {
            alert("삭제에 실패했습니다.");
        }
    };

    return (
        <div className="flex gap-3 items-start py-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-[#2F6F42] font-bold text-sm flex-shrink-0">
                {reply.name?.substring(0, 1)}
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">{reply.name}</span>
                        <span className="text-xs text-gray-400">{formatDateTime(reply.createdAt)}</span>
                    </div>
                    {/* 본인 댓글만 수정/삭제 버튼 표시 */}
                   {isReplyOwner && !editing && (
                        <div className="flex gap-1.5">
                            <button onClick={() => { setEditing(true); setEditInput(reply.content); }}
                                className="text-xs text-gray-400 hover:text-[#2F6F42] border-0 bg-transparent cursor-pointer transition-colors">
                                수정
                            </button>
                            <span className="text-xs text-gray-200">|</span>
                            <button onClick={handleDelete}
                                className="text-xs text-gray-400 hover:text-red-400 border-0 bg-transparent cursor-pointer transition-colors">
                                삭제
                            </button>
                        </div>
                    )}
                </div>

                {/* 수정 모드 */}
                {editing ? (
                    <div className="flex gap-2 mt-1">
                        <input
                            type="text"
                            value={editInput}
                            onChange={(e) => setEditInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                            className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-400 transition-colors"
                            autoFocus
                        />
                        <button onClick={handleUpdate} disabled={loading}
                            className="px-3 py-1.5 bg-[#2F6F42] hover:bg-[#1a4a2e] text-white text-xs font-semibold rounded-lg border-0 cursor-pointer transition-colors disabled:bg-gray-300">
                            {loading ? "..." : "저장"}
                        </button>
                        <button onClick={() => setEditing(false)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded-lg border-0 cursor-pointer transition-colors">
                            취소
                        </button>
                    </div>
                ) : (
                    <p className="text-sm text-gray-700">{reply.content}</p>
                )}
            </div>
        </div>
    );
}

// ── BoardDetail 메인 ───────────────────────────────────────
export default function BoardDetail() {
    const { boardId } = useParams();
    const { isLoggedIn, user } = useAuth();

const currentUserId = user?.userId;

const getUserId = (item) => {
    return item?.userId ?? item?.userid;
};

    const [board, setBoard]               = useState(null);
    const [liked, setLiked]               = useState(false);
    const [likeCount, setLikeCount]       = useState(0);
    const [replies, setReplies]           = useState({ content: [], totalPages: 0, number: 0, totalElements: 0 });
    const [replyPage, setReplyPage]       = useState(0);
    const [replyInput, setReplyInput]     = useState("");
    const [replyLoading, setReplyLoading] = useState(false);
const [chatOpen, setChatOpen] = useState(false);
const [selectedRoom, setSelectedRoom] = useState(null);

const handleOpenChat = async () => {
    try {
        const response = await startChatRoom();

        setSelectedRoom(response.data);
        setChatOpen(true);
    } catch (error) {
        console.error("채팅방 시작 실패:", error);
        alert("채팅방을 시작할 수 없습니다.");
    }
};

const closeChatRoom = () => {
    setChatOpen(false);
    setSelectedRoom(null);
};
    const requireLogin = () => {
        alert("로그인이 필요한 서비스입니다.");
        window.location.href = "/login";
    };

    // 게시글 로드
    useEffect(() => {
        if (!boardId) return;
        BoardAPI.getOne(boardId)
            .then(({ data }) => {
                setBoard(data);
                setLiked(data.likedByMe ?? false);
                setLikeCount(data.likeCnt ?? 0);
            })
            .catch(console.error);
    }, [boardId]);

    // 댓글 로드
    const loadReplies = (pg = replyPage) => {
        ReplyAPI.getAll(boardId, pg)
            .then(({ data }) => setReplies(data))
            .catch(console.error);
    };

    useEffect(() => {
        if (!boardId) return;
        loadReplies(replyPage);
    }, [boardId, replyPage]);

    // 좋아요 토글
    const toggleLike = async () => {
        if (!isLoggedIn) { requireLogin(); return; }
        try {
            const { data } = await BoardAPI.toggleLike(boardId);
            setLiked(data.liked);
            setLikeCount((prev) => prev + (data.liked ? 1 : -1));
        } catch (e) { console.error(e); }
    };

    // 댓글 등록
    const submitReply = async () => {
        const content = replyInput.trim();
        if (!content) { alert("댓글을 입력해주세요."); return; }
        setReplyLoading(true);
        try {
            await ReplyAPI.create(boardId, content);
            setReplyInput("");
            setReplyPage(0);
            loadReplies(0);
            setBoard((prev) => prev ? { ...prev, replyCount: (prev.replyCount ?? 0) + 1 } : prev);
        } catch (e) {
            if (e.response?.status === 401) requireLogin();
            else alert("댓글 등록에 실패했습니다.");
        } finally {
            setReplyLoading(false);
        }
    };

    // 댓글 수정 후 재조회
    const handleReplyUpdated = () => loadReplies(replyPage);

    // 댓글 삭제 후 재조회 + 댓글 수 감소
    const handleReplyDeleted = () => {
        loadReplies(replyPage);
        setBoard((prev) => prev ? { ...prev, replyCount: Math.max(0, (prev.replyCount ?? 1) - 1) } : prev);
    };

    // 게시글 삭제
    const deleteBoard = async () => {
        if (!confirm("게시글을 삭제하시겠습니까?")) return;
        try {
            await BoardAPI.delete(boardId);
            alert("삭제되었습니다.");
            window.location.href = "/boards";
        } catch (e) {
            if (e.response?.status === 401) requireLogin();
            else alert("삭제에 실패했습니다.");
        }
    };

    if (!board) return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <p className="text-gray-400 text-sm">로딩 중...</p>
        </div>
    );
const isBoardOwner =
    Number(getUserId(board)) === Number(currentUserId) || board.owner || board.isOwner;
    return (
        <div className="bg-gray-100 text-gray-800 min-h-screen flex flex-col">
            <div className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">
                <div className="grid gap-5" style={{ gridTemplateColumns: "220px 1fr" }}>
                    <BoardSidebar onChatClick={handleOpenChat} />

                    <main className="bg-white rounded-xl p-8 shadow-sm flex flex-col gap-8">

                        {/* 상단 */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-base font-bold text-gray-400">게시글 상세</h2>
                                <p className="text-xs text-gray-400 mt-1">게시판 &gt; 게시글 상세</p>
                            </div>
                            <a href="/boards"
                                className="flex items-center gap-1.5 px-5 py-2 border border-gray-200 rounded-full text-sm text-gray-600 no-underline hover:border-green-400 hover:text-green-700 transition-colors">
                                ‹ 목록으로 돌아가기
                            </a>
                        </div>

                        {/* 제목 */}
                        <h1 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4">
                            {board.title}
                        </h1>

                        {/* 작성자 + 수정/삭제 */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="font-semibold text-gray-700">{board.name}</span>
                                <span>{formatDateTime(board.createdAt)}</span>
                                <span className="flex items-center gap-1">👁 {board.cnt}</span>
                            </div>
                            {isLoggedIn && isBoardOwner && (
                                <div className="flex gap-2">
                                    <button onClick={deleteBoard}
                                        className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-lg border-0 cursor-pointer transition-colors">
                                        삭제
                                    </button>
                                    <a href={`/boards/${boardId}/edit`}
                                        className="px-4 py-1.5 bg-[#2F6F42] hover:bg-[#1a4a2e] text-white text-sm rounded-lg no-underline transition-colors">
                                        수정
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* 본문 */}
                        <div className="min-h-[200px] text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border-b border-gray-100 py-6">
                            {board.content}
                        </div>

                        {/* 첨부파일 */}
                        {board.files?.length > 0 && (
                            <div className="flex flex-col gap-3 border-b border-gray-100 pb-6">
                                <h4 className="text-sm font-bold text-gray-600">첨부파일</h4>
                                {board.files.map((file) =>
                                    isImageFile(file.originalName) ? (
                                        <div key={file.fileid}>
                                            <img src={`/api/boards/files/${file.fileid}/preview`}
                                                alt={file.originalName}
                                                className="w-full rounded-xl object-cover max-h-[500px]" />
                                            <p className="text-xs text-gray-400 mt-1">{file.originalName}</p>
                                        </div>
                                    ) : (
                                        <div key={file.fileid}
                                            className="flex items-center gap-3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                                            <span className="text-lg">📎</span>
                                            <a href={`/api/boards/files/${file.fileid}`}
                                                className="text-sm text-[#2F6F42] hover:underline flex-1 truncate">
                                                {file.originalName}
                                            </a>
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                        {/* 좋아요 */}
                        <div className="flex items-center gap-2">
                            <button onClick={toggleLike}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm cursor-pointer transition-colors ${
                                    liked
                                        ? "bg-red-50 border-red-300 text-red-500"
                                        : "bg-white border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-400"
                                }`}>
                                <span>{liked ? "♥" : "♡"}</span>
                                <span>{likeCount}</span>
                            </button>
                        </div>

                        {/* 댓글 */}
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-2 items-center">
                                <h3 className="text-base font-bold">댓글</h3>
                                <span className="text-sm text-gray-400">{replies.totalElements ?? 0}</span>
                            </div>

                            {/* 댓글 입력 */}
                            {isLoggedIn ? (
                                <div className="flex gap-2">
                                    <input type="text" value={replyInput}
                                        onChange={(e) => setReplyInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && submitReply()}
                                        placeholder="댓글을 입력해주세요."
                                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-400 transition-colors" />
                                    <button onClick={submitReply} disabled={replyLoading}
                                        className="px-5 py-2.5 bg-[#2F6F42] hover:bg-[#1a4a2e] text-white text-sm font-semibold rounded-lg border-0 cursor-pointer transition-colors disabled:bg-gray-300">
                                        {replyLoading ? "..." : "등록"}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input type="text" readOnly onClick={requireLogin}
                                        placeholder="댓글을 작성하려면 로그인이 필요합니다."
                                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 cursor-pointer" />
                                    <button onClick={requireLogin}
                                        className="px-5 py-2.5 bg-[#2F6F42] hover:bg-[#1a4a2e] text-white text-sm font-semibold rounded-lg border-0 cursor-pointer transition-colors">
                                        등록
                                    </button>
                                </div>
                            )}

                            {/* 댓글 목록 */}
                            <div className="flex flex-col mt-2">
                                {replies.content.length === 0 ? (
                                    <p className="text-sm text-gray-400 text-center py-6">
                                        아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
                                    </p>
                                ) : (
                                    replies.content.map((reply) => (
                                       <ReplyItem
    key={reply.replyId}
    reply={reply}
    boardId={boardId}
    currentUserId={currentUserId}
    onUpdated={handleReplyUpdated}
    onDeleted={handleReplyDeleted}
/>
                                    ))
                                )}
                            </div>

                            <Pagination page={replies.number} totalPages={replies.totalPages}
                                onPageChange={(p) => setReplyPage(p)} />
                        </div>
                    </main>
                </div>
                       </div>

            <ChatPopup
                chatOpen={chatOpen}
                selectedRoom={selectedRoom}
                onCloseChatRoom={closeChatRoom}
                variant="board"
            />
        </div>
    );
}
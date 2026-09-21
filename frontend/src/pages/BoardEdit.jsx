import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { BoardAPI, ReplyAPI } from "../services/board/boardService";
import { BoardSidebar } from "./BoardList";
import { useAuth } from "../hooks/auth/useAuth";
import ChatPopup from "../components/admin/ChatPopup.jsx";
import { startChatRoom } from "../services/chat/chatService.js";

function formatSize(b) {
    if (b < 1024) return b + "B";
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + "KB";
    return (b / (1024 * 1024)).toFixed(1) + "MB";
}
function getFileIcon(name) {
    const ext = name.split(".").pop().toLowerCase();
    return { pdf:"📄", doc:"📝", docx:"📝", xls:"📊", xlsx:"📊", ppt:"📑", pptx:"📑", zip:"🗜", hwp:"📃", txt:"📋" }[ext] || "📎";
}

function FileDropZone({ files, onAdd, onRemove, inputId }) {
    const [dragOver, setDragOver] = useState(false);
    return (
        <div className="flex flex-col gap-3">
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); onAdd(Array.from(e.dataTransfer.files)); }}
                onClick={() => document.getElementById(inputId).click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    dragOver ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50 hover:border-green-400 hover:bg-green-50"
                }`}>
                <div className="text-3xl mb-2">📎</div>
                <p className="text-sm text-gray-500">
                    <span className="text-[#2F6F42] font-semibold">클릭</span>하거나 파일을 드래그해서 업로드하세요
                </p>
                <p className="text-xs text-gray-400 mt-1">이미지(jpg, png, gif), PDF, Word, Excel 등 · 파일당 최대 10MB · 최대 5개</p>
            </div>
            <input type="file" id={inputId} multiple
                accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.hwp"
                className="hidden"
                onChange={(e) => { onAdd(Array.from(e.target.files)); e.target.value = ""; }} />
            {files.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2.5 px-3 py-2 bg-white border border-gray-200 rounded-lg">
                    {file.type.startsWith("image/") ? (
                        <img src={URL.createObjectURL(file)} className="w-10 h-10 rounded-md object-cover flex-shrink-0" alt="" />
                    ) : (
                        <div className="w-10 h-10 rounded-md bg-green-50 flex items-center justify-center text-xl flex-shrink-0">
                            {getFileIcon(file.name)}
                        </div>
                    )}
                    <span className="text-xs text-gray-700 flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-gray-400">{formatSize(file.size)}</span>
                    <button onClick={() => onRemove(idx)}
                        className="text-gray-300 hover:text-red-400 text-lg border-0 bg-transparent cursor-pointer">✕</button>
                </div>
            ))}
        </div>
    );
}

export default function BoardEdit() {
    const { boardId } = useParams();  // ← useParams로 직접 꺼냄
    const {isLoggedIn} = useAuth();
    // 비로그인 차단
    if (isLoggedIn === false) {
        alert("로그인이 필요한 서비스입니다.");
        window.location.href = "/login";
        return null;
    }

    const [title, setTitle]                 = useState("");
    const [content, setContent]             = useState("");
    const [existingFiles, setExistingFiles] = useState([]);
    const [newFiles, setNewFiles]           = useState([]);
    const [submitting, setSubmitting]       = useState(false);
    const [loading, setLoading]             = useState(true);
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

    useEffect(() => {
        if (!boardId) return;
        BoardAPI.getOne(boardId)
            .then(({ data }) => {
                setTitle(data.title ?? "");
                setContent(data.content ?? "");
                setExistingFiles(data.files ?? []);
                setLoading(false);
            })
            .catch(() => {
                alert("게시글 정보를 불러오지 못했습니다.");
                window.location.href = "/boards";
            });
    }, [boardId]);

    const deleteExistingFile = async (fileId) => {
        if (!confirm("첨부파일을 삭제하시겠습니까?")) return;
        try {
            await BoardAPI.deleteFile(fileId);
            setExistingFiles((prev) => prev.filter((f) => f.fileid !== fileId));
        } catch (e) {
            if (e.response?.status === 401) {
                alert("로그인이 만료되었습니다."); window.location.href = "/login";
            } else {
                alert("파일 삭제에 실패했습니다.");
            }
        }
    };

    const addFiles = useCallback((incoming) => {
        setNewFiles((prev) => {
            const combined = [...prev];
            for (const file of incoming) {
                if (combined.length >= 5) { alert("파일은 최대 5개까지 첨부할 수 있습니다."); break; }
                if (file.size > 10 * 1024 * 1024) { alert(`${file.name}: 파일 크기가 10MB를 초과합니다.`); continue; }
                combined.push(file);
            }
            return combined;
        });
    }, []);

    const handleSubmit = async () => {
        if (!title.trim()) { alert("제목을 입력해주세요."); return; }
        if (!content.trim()) { alert("내용을 입력해주세요."); return; }
        setSubmitting(true);

        const formData = new FormData();
        formData.append("data", new Blob([JSON.stringify({ title: title.trim(), content: content.trim() })], { type: "application/json" }));
        newFiles.forEach((f) => formData.append("files", f));

        try {
            await BoardAPI.update(boardId, formData);
            alert("게시글이 수정되었습니다.");
            window.location.href = `/boards/${boardId}`;
        } catch (e) {
            if (e.response?.status === 401) {
                alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                window.location.href = "/login";
            } else {
                alert("수정 중 오류가 발생했습니다.");
                setSubmitting(false);
            }
        }
    };

    if (loading) return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <p className="text-gray-400 text-sm">로딩 중...</p>
        </div>
    );

    return (
        <div className="bg-gray-100 text-gray-800 min-h-screen flex flex-col">
            <div className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">
                <div className="grid gap-5" style={{ gridTemplateColumns: "220px 1fr" }}>
                   <BoardSidebar onChatClick={handleOpenChat} />

                    <main className="bg-white rounded-xl p-8 shadow-sm">
                        <div className="flex justify-between items-start mb-7">
                            <div>
                                <h2 className="text-xl font-bold">게시글 수정</h2>
                                <p className="text-xs text-gray-400 mt-1">게시판 &gt; 게시글 수정</p>
                            </div>
                            <a href={`/boards/${boardId}`}
                                className="flex items-center gap-1.5 px-5 py-2 border border-gray-200 rounded-full text-sm text-gray-600 no-underline hover:border-green-400 hover:text-green-700 transition-colors">
                                ‹ 돌아가기
                            </a>
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="grid items-start gap-4" style={{ gridTemplateColumns: "80px 1fr" }}>
                                <label className="text-base font-bold pt-2.5" htmlFor="edit-title">제목</label>
                                <input id="edit-title" type="text" maxLength={100} value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="제목을 입력해주세요."
                                    className="px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:border-green-400 transition-colors" />
                            </div>

                            <div className="grid items-start gap-4" style={{ gridTemplateColumns: "80px 1fr" }}>
                                <label className="text-base font-bold pt-2.5" htmlFor="edit-content">내용</label>
                                <textarea id="edit-content" rows={12} value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="내용을 입력해주세요."
                                    className="px-3.5 py-3 border border-gray-200 rounded-lg text-sm w-full resize-y leading-relaxed focus:outline-none focus:border-green-400 transition-colors" />
                            </div>

                            <div className="grid items-start gap-4" style={{ gridTemplateColumns: "80px 1fr" }}>
                                <label className="text-base font-bold pt-2.5">첨부파일</label>
                                <div className="flex flex-col gap-3">
                                    {existingFiles.length > 0 && (
                                        <div className="flex flex-col gap-2">
                                            <p className="text-xs text-gray-400 font-semibold">현재 첨부파일</p>
                                            {existingFiles.map((file) => (
                                                <div key={file.fileid}
                                                    className="flex items-center gap-3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                                                    <span className="text-2xl flex-shrink-0">📎</span>
                                                    <span className="text-xs text-gray-700 flex-1 truncate">{file.originalName}</span>
                                                    <button onClick={() => deleteExistingFile(file.fileid)}
                                                        className="text-gray-300 hover:text-red-400 text-lg border-0 bg-transparent cursor-pointer">✕</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <FileDropZone files={newFiles} onAdd={addFiles}
                                        onRemove={(idx) => setNewFiles((p) => p.filter((_, i) => i !== idx))}
                                        inputId="fileInput-edit" />
                                </div>
                            </div>

                            <div className="flex justify-center gap-3 mt-2">
                                <button onClick={() => (window.location.href = `/boards/${boardId}`)}
                                    className="px-10 py-2.5 border border-gray-200 bg-white text-gray-600 rounded-lg text-sm font-semibold cursor-pointer hover:border-gray-400 transition-colors">
                                    취소
                                </button>
                                <button onClick={handleSubmit} disabled={submitting}
                                    className="px-10 py-2.5 bg-[#2F6F42] hover:bg-[#1a4a2e] text-white rounded-lg text-sm font-bold cursor-pointer border-0 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                                    {submitting ? "수정 중..." : "수정하기"}
                                </button>
                            </div>
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
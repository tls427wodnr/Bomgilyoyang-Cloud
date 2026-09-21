import { useState, useEffect, useCallback } from "react";
import { BoardAPI, ReplyAPI } from "../services/board/boardService";
import { useAuth } from "../hooks/auth/useAuth";
import ChatPopup from "../components/admin/ChatPopup.jsx";
import { startChatRoom } from "../services/chat/chatService.js";
import rumiSearch from "../assets/images/characters/rumi-search.png";

function formatDate(str) {
  if (!str) return "-";
  return str.toString().substring(0, 10).replace(/-/g, ".");
}

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 0) return null;
  return (
    <div className="flex justify-center items-center gap-1.5 mt-7">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 text-sm hover:border-green-400 hover:text-green-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >‹</button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button key={i} onClick={() => onPageChange(i)}
          className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm transition-colors ${
            i === page
              ? "bg-[#2F6F42] text-white border-[#2F6F42] font-bold"
              : "border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-700"
          }`}
        >{i + 1}</button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 text-sm hover:border-green-400 hover:text-green-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >›</button>
    </div>
  );
}

export function BoardSidebar({ onChatClick }) {
  const {isLoggedIn} = useAuth();
  console.log(isLoggedIn);

  const requireLogin = () => {
    alert("로그인이 필요한 서비스입니다.");
    window.location.href = "/login";
  };

  return (
    <aside className="flex flex-col gap-4">
      <div className="bg-[#a8c5b5] rounded-xl p-5 relative overflow-hidden min-h-[160px]">
        <p className="text-sm font-bold text-[#1a4a2e] mb-2">봄길요양 커뮤니티</p>
        <p className="text-xs text-gray-600 leading-relaxed">
          시설 이용 정보와<br />다양한 소식을<br />함께 나눠요.
        </p>
        <img
            src={rumiSearch}
          alt="마스코트"
          className="absolute bottom-0 right-2 w-20"
          onError={(e) => (e.target.style.display = "none")}
        />
      </div>

      {isLoggedIn ? (
        <a href="/boards/new"
          className="block w-full py-3 bg-[#2F6F42] hover:bg-[#1a4a2e] text-white font-bold rounded-lg text-sm text-center no-underline transition-colors">
          ✏️ 글쓰기
        </a>
      ) : (
        <button onClick={requireLogin}
          className="w-full py-3 bg-[#2F6F42] hover:bg-[#1a4a2e] text-white font-bold rounded-lg text-sm cursor-pointer border-0 transition-colors">
          ✏️ 글쓰기
        </button>
      )}

      <div className="border border-gray-200 rounded-xl p-4"
        style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.22)", background: "rgba(255,255,255,0.35)" }}>
        <p className="text-sm font-bold mb-1.5">도움이 필요하신가요?</p>
        <p className="text-xs text-gray-500 leading-relaxed mb-3">
          관리자와 1:1 채팅으로<br />빠르게 문의해보세요.
        </p>
        <button
          onClick={isLoggedIn ? onChatClick : requireLogin}
          className="w-full py-2 bg-[#79a9ba] hover:bg-[#8fb3a0] text-white text-xs font-semibold rounded-md border-0 cursor-pointer transition-colors">
          채팅하기
        </button>
      </div>
    </aside>
  );
}

export default function BoardList() {
  const {isLoggedIn} = useAuth();

  const [boards, setBoards]           = useState({ content: [], totalPages: 0, number: 0 });
  const [sort, setSort]               = useState("recent");
  const [page, setPage]               = useState(0);
  const [keyword, setKeyword]         = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading]         = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
const [selectedRoom, setSelectedRoom] = useState(null);

  const requireLogin = () => {
    alert("로그인이 필요한 서비스입니다.");
    window.location.href = "/login";
  };

  const openUserChatRoom = async () => {
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

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (keyword)                 res = await BoardAPI.search(keyword, page);
      else if (sort === "cnt")     res = await BoardAPI.getByViews(page);
      else if (sort === "replies") res = await BoardAPI.getByReplies(page);
      else                         res = await BoardAPI.getAll(page);
      setBoards(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [sort, page, keyword]);

  useEffect(() => { fetchBoards(); }, [fetchBoards]);

  const handleSortChange = (newSort) => {
    setSort(newSort); setKeyword(""); setSearchInput(""); setPage(0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchInput.trim()); setSort("recent"); setPage(0);
  };

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">
        <div className="grid gap-5" style={{ gridTemplateColumns: "220px 1fr" }}>
          <BoardSidebar onChatClick={openUserChatRoom} />

          <main className="bg-white rounded-xl p-8 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-bold">전체 게시글</h2>
              <p className="text-xs text-gray-500 mt-1">봄길요양 이용자들과 정보를 나누고 소통해보세요.</p>
            </div>

            {/* 탭 + 검색 */}
            <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
              <div className="flex gap-2">
                {[{ key: "recent", label: "전체" }, { key: "cnt", label: "조회순" }, { key: "replies", label: "댓글순" }]
                  .map(({ key, label }) => (
                    <button key={key} onClick={() => handleSortChange(key)}
                      className={`px-4 py-1.5 rounded-full text-xs border cursor-pointer transition-colors ${
                        sort === key && !keyword
                          ? "bg-[#2F6F42] text-white border-[#2F6F42] font-semibold"
                          : "bg-white text-gray-500 border-gray-200 hover:border-green-400"
                      }`}>
                      {label}
                    </button>
                  ))}
              </div>

              <form onSubmit={handleSearch} className="flex gap-2 items-center">
                <select className="px-2 py-1.5 border border-gray-200 rounded-md text-xs bg-white focus:outline-none focus:border-green-400">
                  <option value="all">제목+내용</option>
                </select>
                <input
                  type="text" value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="검색어를 입력하세요."
                  className="px-3 py-1.5 border border-gray-200 rounded-md text-xs w-48 focus:outline-none focus:border-green-400"
                />
                <button type="submit"
                  className="px-3 py-1.5 bg-[#2F6F42] hover:bg-[#1a4a2e] text-white rounded-md text-sm border-0 cursor-pointer transition-colors">
                  🔍
                </button>
              </form>
            </div>

            {/* 테이블 */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-t-2 border-[#2F6F42] border-b border-gray-200">
                  <th className="py-3 px-2 text-xs text-gray-500 font-semibold text-center w-16">번호</th>
                  <th className="py-3 px-2 text-xs text-gray-500 font-semibold text-left">제목</th>
                  <th className="py-3 px-2 text-xs text-gray-500 font-semibold text-center w-24">작성자</th>
                  <th className="py-3 px-2 text-xs text-gray-500 font-semibold text-center w-28">작성일</th>
                  <th className="py-3 px-2 text-xs text-gray-500 font-semibold text-center w-16">조회수</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="py-16 text-center text-sm text-gray-400">로딩 중...</td></tr>
                ) : boards.content.length === 0 ? (
                  <tr><td colSpan={5} className="py-16 text-center text-sm text-gray-400">등록된 게시글이 없습니다.</td></tr>
                ) : (
                  boards.content.map((board) => (
                    <tr key={board.boardid} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-2 text-sm text-center text-gray-600">{board.boardid}</td>
                      <td className="py-3.5 px-2 text-sm text-left">
                        {isLoggedIn ? (
                          <a href={`/boards/${board.boardid}`}
                            className="text-gray-700 font-medium hover:text-[#2F6F42] transition-colors no-underline">
                            {board.title}
                          </a>
                        ) : (
                          <button onClick={requireLogin}
                            className="text-gray-700 font-medium hover:text-[#2F6F42] transition-colors bg-transparent border-0 cursor-pointer p-0 text-left">
                            {board.title}
                          </button>
                        )}
                        {board.replyCount > 0 && (
                          <span className="text-[#2F6F42] text-xs font-semibold ml-1">[{board.replyCount}]</span>
                        )}
                      </td>
                      <td className="py-3.5 px-2 text-sm text-center text-gray-600">{board.name}</td>
                      <td className="py-3.5 px-2 text-xs text-gray-400 text-center">{formatDate(board.createdAt)}</td>
                      <td className="py-3.5 px-2 text-sm text-center text-gray-600">{board.cnt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <Pagination page={boards.number} totalPages={boards.totalPages} onPageChange={setPage} />
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
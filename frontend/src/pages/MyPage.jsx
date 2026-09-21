import "../css/mypage-theme.css";
import { useState, useEffect } from "react";
import api from "../api/axios.js";
import { Link } from "react-router-dom";

export default function MyPage() {
    const [userInfo, setUserInfo] = useState({ name: "", email: "" });
    const [favoriteFacilities, setFavoriteFacilities] = useState([]);
    const [myPosts, setMyPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // 데이터 로드
    useEffect(() => {
        const fetchMyPageData = async () => {
            setIsLoading(true);
            try {
                // 1. 유저 정보 조회
                const userRes = await api.get("/api/auth/me");
                setUserInfo({
                    name: userRes.data.name,
                    email: userRes.data.email
                });

                // 2. 즐겨찾는 시설 조회
                const favRes = await api.get("/api/favorites/me");
                setFavoriteFacilities(favRes.data || []);

                // 3. 내가 작성한 글 조회
                const boardRes = await api.get("/api/boards/me");
                // Spring PageImpl 객체는 content 배열 하위에 데이터가 들어있음
                setMyPosts(boardRes.data.content || []);

            } catch (err) {
                console.error("마이페이지 데이터 조회 에러:", err);
                setError("데이터를 불러오는 중 문제가 발생했습니다. 로그인 세션을 확인해주세요.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyPageData();
    }, []);

    // 즐겨찾기 취소 핸들러
    const handleRemoveFavorite = async (facilityId) => {
        if (!window.confirm("즐겨찾기에서 이 시설을 해제하시겠습니까?")) {
            return;
        }
        try {
            await api.delete("/api/favorites/me", {
                data: { facilityId }
            });
            // 로컬 상태에서 해당 시설 제거
            setFavoriteFacilities(prev => prev.filter(item => item.facilityId !== facilityId));
        } catch (err) {
            console.error("즐겨찾기 삭제 실패:", err);
            alert("즐겨찾기를 삭제하는 도중 오류가 발생했습니다.");
        }
    };

    // 시설 별점 렌더링 헬퍼 (초록 나무 아이콘)
    const renderScore = (score) => {
        const trees = [];
        const maxScore = score || 5;
        for (let i = 0; i < maxScore; i++) {
            trees.push(<i key={i} className="fa-solid fa-tree"></i>);
        }
        return trees;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">마이페이지 데이터를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <main className="max-w-6xl mx-auto py-12 px-4">
                
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-2">마이페이지</h1>
                    <p className="text-sm text-gray-600">내 정보와 활동을 한눈에 확인해보세요</p>
                </div>

                <div className="bg-[#e6eee8] rounded-2xl p-8 flex items-center justify-between mb-12 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                안녕하세요 <span>{userInfo.name || "사용자"}</span> 님
                            </h2>
                            <p className="text-lg text-gray-500 font-medium">{userInfo.email || "이메일 없음"}</p>
                        </div>
                    </div>
                    {/* 설정 정보 수정 페이지 이동 */}
                    <Link to="/mypagechange" className="text-gray-500 hover:text-gray-700 transition-colors">
                        내 정보 수정
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* 즐겨찾는 시설 */}
                    <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-sm h-[600px] flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold mb-1">즐겨찾는 시설</h3>
                            <p className="text-sm text-gray-500">자주 찾는 시설을 한눈에 확인하세요.</p>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {favoriteFacilities.length === 0 ? (
                                <div className="text-center py-20 text-gray-400 text-sm font-medium">
                                    즐겨찾기한 요양 시설이 없습니다.
                                </div>
                            ) : (
                                favoriteFacilities.map((fav) => (
                                    <div key={fav.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex gap-4 relative shadow-sm hover:shadow-md transition-shadow">

                                        <div className="flex-1 py-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-gray-800 text-lg">
                                                    {fav.facility?.facilityName || "이름 없는 시설"}
                                                </h4>
                                                <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md">
                                                    {fav.facility?.categoryName || "요양시설"}
                                                </span>
                                            </div>

                                            <div className="text-[#5CB071] text-xs mb-3 flex gap-1">
                                                {renderScore(fav.facility?.facilityScore)}
                                            </div>

                                            <div className="text-xs text-gray-500 space-y-1.5">
                                                <p className="flex items-left gap-1.5">
                                                    {/*<i className="fa-solid fa-location-dot text-red-500 w-3"></i>*/}
                                                    <span>{fav.facility?.newAddress || fav.facility?.oldAddress || "주소 정보 없음"}</span>
                                                </p>
                                                <p className="flex items-left gap-1.5">
                                                    {/*<i className="fa-solid fa-phone text-gray-400 w-3"></i>*/}
                                                    <span>{fav.facility?.facilityTel || "전화번호 정보 없음"}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* 즐겨찾기 취소 버튼 */}
                                        <button onClick={() => handleRemoveFavorite(fav.facilityId)} className="absolute top-4 right-4 text-red-500 hover:text-red-600 transition-colors">
                                            <i className="fa-solid fa-heart text-2xl drop-shadow-sm"></i>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* 내가 작성한 게시글 */}
                    <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-sm h-[600px] flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold mb-1">내가 쓴 게시글</h3>
                            <p className="text-sm text-gray-500">내가 작성한 자유게시판 글을 확인해보세요.</p>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {myPosts.length === 0 ? (
                                <div className="text-center py-20 text-gray-400 text-sm font-medium">
                                    작성한 게시글이 없습니다.
                                </div>
                            ) : (
                                myPosts.map((post) => (
                                    <div key={post.boardId} className="bg-white border border-gray-200 rounded-2xl p-4 flex gap-4 relative shadow-sm hover:shadow-md transition-shadow">

                                        <div className="flex-1 py-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-gray-800 text-lg">
                                                    {post.title}
                                                </h4>
                                                <span className="text-xs text-gray-400">
                                                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                                                </span>
                                            </div>

                                            <div className="text-xs text-gray-500 line-clamp-2 mt-2">
                                                {post.content}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </>
    );
}
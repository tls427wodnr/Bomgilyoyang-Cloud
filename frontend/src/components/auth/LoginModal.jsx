export default function LoginModal({ msg }) {
    return (
        <>
            <div id="info-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                <div class="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-gray-100 flex flex-col items-center text-center animate-scale-up">
                    <div
                        class="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
                        <svg class="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2"
                            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">알림</h3>
                    <p class="text-gray-600 text-sm mb-6 leading-relaxed">{msg}</p>
                    <button onclick="document.getElementById('info-modal').style.display='none'"
                        class="w-full bg-[#5CA668] hover:bg-[#4A8A54] text-white font-medium py-3 rounded-xl transition duration-150 ease-in-out shadow-sm shadow-emerald-200/50">
                        확인
                    </button>
                </div>
            </div>
        </>
    );
}
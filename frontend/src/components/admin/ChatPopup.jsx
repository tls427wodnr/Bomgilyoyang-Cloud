function ChatPopup({
  chatOpen,
  selectedRoom,
  onCloseChatRoom,
  variant = "board",
}) {

    const partnerName = selectedRoom?.name || "관리자";

 const chatSrc =
        chatOpen && selectedRoom?.roomId
            ? `/chatrooms/${selectedRoom.roomId}/message?partnerName=${encodeURIComponent(partnerName)}`
            : "about:blank";

   return (
    <section className={`chat-popup chat-popup-${variant} ${chatOpen ? "active" : ""}`}>
      <div className="chat-header">
        <div className="chat-title">
          {partnerName}
        </div>

        <button
          type="button"
          className="chat-close-button"
          onClick={onCloseChatRoom}
        >
          ×
        </button>
      </div>

      <iframe
        key={chatSrc}
        className="chat-frame"
        src={chatSrc}
        title="채팅방"
      />
    </section>
  );
}

export default ChatPopup;

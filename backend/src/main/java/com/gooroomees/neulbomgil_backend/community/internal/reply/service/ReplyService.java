package com.gooroomees.neulbomgil_backend.community.internal.reply.service;

import com.gooroomees.neulbomgil_backend.identity.UserDirectory;
import com.gooroomees.neulbomgil_backend.community.internal.board.entity.Board;
import com.gooroomees.neulbomgil_backend.community.internal.board.mapper.BoardMapper;
import com.gooroomees.neulbomgil_backend.community.internal.reply.dto.ReplyRequestDTO;
import com.gooroomees.neulbomgil_backend.community.internal.reply.dto.ReplyResponseDTO;
import com.gooroomees.neulbomgil_backend.community.internal.reply.entity.Reply;
import com.gooroomees.neulbomgil_backend.community.internal.reply.mapper.ReplyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReplyService {
    private final ReplyMapper replyMapper;
    private final BoardMapper boardMapper;
    private final UserDirectory userDirectory;
    private static final int PAGE_SIZE = 5;

    //존재하지 않는 게시글
    private Board findBoard(Long boardId){
        return boardMapper.findById(boardId).orElseThrow(()
                -> new IllegalArgumentException("존재하지 않은 게시글입니다."));
    }
    //존재하지 않는 댓글
    private Reply findReply(Long replyId){
        return replyMapper.findById(replyId).orElseThrow(()
                -> new IllegalArgumentException("존재하지 않는 댓글입니다."));
    }

    //댓글 목록 조회
    public Page<ReplyResponseDTO> getReplies(Long boardId, int page, Long currentUserId) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("createdAt").descending());
        var content = replyMapper
                .findByBoardId(boardId, pageable.getOffset(), pageable.getPageSize())
                .stream()
                .map(reply -> new ReplyResponseDTO(
                        reply,
                        findUserName(reply.getUserId()),
                        currentUserId
                ))
                .toList();
        return new PageImpl<>(content, pageable, replyMapper.countByBoardId(boardId));
    }

    private String findUserName(Long userId) {
        return userDirectory.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."))
                .name();
    }

    //댓글 작성
    @Transactional
    public void createReply(Long boardId, ReplyRequestDTO dto, Long userId) {
        Board board = findBoard(boardId);
        Reply reply = Reply.create(board, userId, dto.getContent());
        replyMapper.insert(reply);
    }

    //댓글 수정
    @Transactional
    public void updateReply(Long boardId, Long replyId, ReplyRequestDTO dto, Long userId) {
        findBoard(boardId);
        Reply reply = findReply(replyId);//댓글 있는지 확인
        reply.validateOwner(userId);// 본인이 작성한 댓글 맞는지 확인
        reply.update(dto.getContent());// 위의 조건이 다 해당된다면 수정 가능
        replyMapper.update(reply);
    }
    //댓글 삭제
    @Transactional
    public void deleteReply(Long boardId, Long replyId, Long userId){
        findBoard(boardId);
        Reply reply = findReply(replyId);//댓글 있는지 확인
        reply.validateOwner(userId);// 본인이 작성한 댓글 맞는지 확인
        replyMapper.deleteById(replyId);
        }
    }

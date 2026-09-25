package com.gooroomees.neulbomgil_backend.community.internal.board.service;

import com.gooroomees.neulbomgil_backend.identity.UserDirectory;
import com.gooroomees.neulbomgil_backend.community.internal.board.dto.BoardRequestDTO;
import com.gooroomees.neulbomgil_backend.community.internal.board.dto.BoardResponseDTO;
import com.gooroomees.neulbomgil_backend.community.internal.board.entity.Board;
import com.gooroomees.neulbomgil_backend.community.internal.board.entity.BoardFile;
import com.gooroomees.neulbomgil_backend.community.internal.board.entity.BoardLike;
import com.gooroomees.neulbomgil_backend.community.internal.board.mapper.BoardFileMapper;
import com.gooroomees.neulbomgil_backend.community.internal.board.mapper.BoardLikeMapper;
import com.gooroomees.neulbomgil_backend.community.internal.board.mapper.BoardMapper;
import com.gooroomees.neulbomgil_backend.community.internal.reply.mapper.ReplyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(transactionManager = "communityTransactionManager", readOnly = true)
public class BoardService {

    private final BoardMapper boardMapper;
    private final BoardLikeMapper boardLikeMapper;
    private final ReplyMapper replyMapper;
    private final BoardFileMapper boardFileMapper;
    private final UserDirectory userDirectory;
    private static final int PAGE_SIZE = 15;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    //게시글 없으면 예외처리
    // 게시글 존재 여부 확인
    private Board findBoard(Long boardId) {
        return boardMapper.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));
    }

    // 댓글 수를 포함한 BoardResponse 변환
    private BoardResponseDTO toResponse(Board board) {
        long replyCount = replyMapper.countByBoardId(board.getBoardid());
        return new BoardResponseDTO(board, findUserName(board.getUserId()), replyCount);
    }

    private String findUserName(Long userId) {
        return userDirectory.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."))
                .name();
    }

    // 최신순 (디폴트)
    public Page<BoardResponseDTO> getAllBoards(int page) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("createdAt").descending());
        List<BoardResponseDTO> content = boardMapper
                .findAllOrderByCreatedAt(pageable.getOffset(), pageable.getPageSize())
                .stream()
                .map(this::toResponse)
                .toList();
        return new PageImpl<>(content, pageable, boardMapper.countAll());
    }

    // 조회수 높은순
    public Page<BoardResponseDTO> getBoardsByViews(int page) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE);
        List<BoardResponseDTO> content = boardMapper
                .findAllOrderByViewCount(pageable.getOffset(), pageable.getPageSize())
                .stream()
                .map(this::toResponse)
                .toList();
        return new PageImpl<>(content, pageable, boardMapper.countAll());
    }

    // 댓글 많은순
    public Page<BoardResponseDTO> getBoardsReplyCount(int page) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE);
        List<BoardResponseDTO> content = boardMapper
                .findAllOrderByReplyCount(pageable.getOffset(), pageable.getPageSize())
                .stream()
                .map(this::toResponse)
                .toList();
        return new PageImpl<>(content, pageable, boardMapper.countAll());
    }

    // 조회수 증가 + 좋아요 여부 + 첨부파일
    @Transactional(transactionManager = "communityTransactionManager")
    public BoardResponseDTO getOneBoard(Long boardId, Long currentUserId) {
        Board board = findBoard(boardId);
        board.increaseCnt();
        boardMapper.incrementViewCount(boardId);
        long replyCount = replyMapper.countByBoardId(boardId);
        boolean likedByMe = (currentUserId != null)
                && boardLikeMapper.existsByBoardIdAndUserId(boardId, currentUserId);
        List<BoardFile> files = boardFileMapper.findByBoardId(boardId);
        return new BoardResponseDTO(
                board,
                findUserName(board.getUserId()),
                replyCount,
                likedByMe,
                files,
                currentUserId
        );
        // ← currentUser 추가
    }

    //검색어 입력, 관련 글 가져오기
    public Page<BoardResponseDTO> searchBoard(String keyword, int page) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE);
        List<BoardResponseDTO> content = boardMapper
                .findByKeyword(keyword, pageable.getOffset(), pageable.getPageSize())
                .stream()
                .map(this::toResponse)
                .toList();
        return new PageImpl<>(content, pageable, boardMapper.countByKeyword(keyword));
    }

    // 글 작성
    @Transactional(transactionManager = "communityTransactionManager")
    public void createBoard(BoardRequestDTO dto, Long userId, List<MultipartFile> files) {
        Board board = Board.create(userId, dto.getTitle(), dto.getContent());
        boardMapper.insert(board);
        saveFiles(board, files);
    }

    // 글 수정
    @Transactional(transactionManager = "communityTransactionManager")
    public void updateBoard(BoardRequestDTO dto, Long boardId, Long userId,
                            List<MultipartFile> files) {
        Board board = findBoard(boardId);
        board.validateOwner(userId);
        board.update(dto.getTitle(), dto.getContent());
        boardMapper.update(board);
        saveFiles(board, files);
    }

    // 글 삭제
    @Transactional(transactionManager = "communityTransactionManager")
    public void deleteBoard(Long boardId, Long userId) {
        Board board = findBoard(boardId);
        board.validateOwner(userId);

        // 첨부파일 실제 파일 삭제
        List<BoardFile> files = boardFileMapper.findByBoardId(boardId);
        for (BoardFile file : files) {
            try {
                Files.deleteIfExists(Paths.get(file.getFilePath()));
            } catch (IOException e) {
                throw new RuntimeException("파일 삭제 중 오류가 발생했습니다.", e);
            }
        }
        boardFileMapper.deleteByBoardId(boardId);
        boardLikeMapper.deleteByBoardId(boardId);
        replyMapper.deleteByBoardId(boardId);
        boardMapper.deleteById(boardId);
    }

    // 좋아요 토글 (눌렀으면 취소, 안 눌렀으면 추가)
    @Transactional(transactionManager = "communityTransactionManager")
    public boolean toggleLike(Long boardId, Long userId) {
        Board board = findBoard(boardId);
        Optional<BoardLike> existing = boardLikeMapper.findByBoardIdAndUserId(boardId, userId);

        if (existing.isPresent()) {
            boardLikeMapper.deleteById(existing.get().getId());
            board.decreaseLikeCnt();
            boardMapper.updateLikeCount(boardId, board.getLikeCnt());
            return false;
        } else {
            boardLikeMapper.insert(BoardLike.create(board, userId));
            board.increaseLikeCnt();
            boardMapper.updateLikeCount(boardId, board.getLikeCnt());
            return true;
        }
    }
    //파일 개별 삭제 (수정 화면에서)
    @Transactional(transactionManager = "communityTransactionManager")
    public void deleteFile(Long fileId, Long userId) {
        BoardFile file = boardFileMapper.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("파일이 존재하지 않습니다."));
        file.getBoard().validateOwner(userId);
        try {
            Files.deleteIfExists(Paths.get(file.getFilePath()));
        } catch (IOException e) {
            throw new RuntimeException("파일 삭제 중 오류가 발생했습니다.", e);
        }
        boardFileMapper.deleteById(fileId);
    }

    //파일 다운로드
    public Resource downloadFile(Long fileId) throws MalformedURLException {
        BoardFile boardFile = boardFileMapper.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("파일이 존재하지 않습니다."));
        Path filePath = Paths.get(boardFile.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists()) throw new IllegalArgumentException("파일을 찾을 수 없습니다.");
        return resource;
    }

    public String getOriginalFileName(Long fileId) {
        return boardFileMapper.findById(fileId)
                .map(BoardFile::getOriginName)
                .orElse("file");
    }

    public String getFilePath(Long fileId) {
        return boardFileMapper.findById(fileId)
                .map(BoardFile::getFilePath)
                .orElseThrow(() -> new IllegalArgumentException("파일이 존재하지 않습니다."));
    }

    // 파일 저장 내부 메서드
    private void saveFiles(Board board, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) return;
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;
                String originalName = file.getOriginalFilename();
                String savedName = UUID.randomUUID() + "_" + originalName;
                Path savePath = uploadPath.resolve(savedName);
                file.transferTo(savePath.toAbsolutePath().toFile());
                boardFileMapper.insert(
                        BoardFile.create(board, originalName, savedName,
                                savePath.toString(), file.getSize())
                );
            }
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 중 오류가 발생했습니다.", e);
        }
    }

    public Page<BoardResponseDTO> getMyBoards(Long userId, int page) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("createdAt").descending());
        List<BoardResponseDTO> content = boardMapper
                .findByUserId(userId, pageable.getOffset(), pageable.getPageSize())
                .stream()
                .map(this::toResponse)
                .toList();
        return new PageImpl<>(content, pageable, boardMapper.countByUserId(userId));
    }
}

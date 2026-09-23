package com.gooroomees.neulbomgil_backend.community.internal.reply.mapper;

import com.gooroomees.neulbomgil_backend.community.internal.reply.entity.Reply;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface ReplyMapper {

    int insert(Reply reply);

    Optional<Reply> findById(@Param("replyId") Long replyId);

    List<Reply> findByBoardId(
            @Param("boardId") Long boardId,
            @Param("offset") long offset,
            @Param("size") int size
    );

    long countByBoardId(@Param("boardId") Long boardId);

    long countByUserId(@Param("userId") Long userId);

    int update(Reply reply);

    int deleteById(@Param("replyId") Long replyId);

    int deleteByBoardId(@Param("boardId") Long boardId);
}

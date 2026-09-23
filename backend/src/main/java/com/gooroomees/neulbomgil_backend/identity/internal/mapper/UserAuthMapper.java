package com.gooroomees.neulbomgil_backend.identity.internal.mapper;

import com.gooroomees.neulbomgil_backend.identity.internal.entity.Role;
import com.gooroomees.neulbomgil_backend.identity.internal.entity.Status;
import com.gooroomees.neulbomgil_backend.identity.internal.entity.UserAuth;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserAuthMapper {

    int insert(UserAuth user);

    Optional<UserAuth> findById(@Param("userId") Long userId);

    Optional<UserAuth> findByEmail(@Param("email") String email);

    boolean existsByEmail(@Param("email") String email);

    List<UserAuth> findByStatus(@Param("status") Status status);

    List<UserAuth> findByRole(@Param("role") Role role);

    int updateName(@Param("user") UserAuth user);

    int updatePassword(@Param("user") UserAuth user);

    int updateStatus(@Param("user") UserAuth user);
}

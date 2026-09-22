package com.gooroomees.neulbomgil_backend.domain.chat.repository;

import com.gooroomees.neulbomgil_backend.domain.auth.entity.UserAuth;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatUserRepository extends JpaRepository<UserAuth, Long> {
}

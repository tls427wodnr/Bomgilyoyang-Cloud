package com.gooroomees.neulbomgil_backend.identity.internal.mapper;

import com.gooroomees.neulbomgil_backend.facility.internal.service.FacilityDataInitService;
import com.gooroomees.neulbomgil_backend.facility.internal.service.ParkDataInitService;
import com.gooroomees.neulbomgil_backend.identity.internal.entity.Role;
import com.gooroomees.neulbomgil_backend.identity.internal.entity.Status;
import com.gooroomees.neulbomgil_backend.identity.internal.entity.UserAuth;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class UserAuthMapperTest {

    @Autowired
    private UserAuthMapper userAuthMapper;

    @MockitoBean
    private ParkDataInitService parkDataInitService;

    @MockitoBean
    private FacilityDataInitService facilityDataInitService;

    @Test
    @DisplayName("사용자 Mapper의 등록, 조회, 수정 SQL이 정상 동작한다")
    void crud() {
        UserAuth user = UserAuth.builder()
                .email("mapper@example.com")
                .password("encoded-password")
                .name("사용자")
                .role(Role.USER)
                .status(Status.ACTIVE)
                .build();

        int insertedCount = userAuthMapper.insert(user);

        assertThat(insertedCount).isOne();
        assertThat(user.getUserId()).isNotNull();
        assertThat(userAuthMapper.existsByEmail("mapper@example.com")).isTrue();

        Optional<UserAuth> found = userAuthMapper.findByEmail("mapper@example.com");
        assertThat(found).isPresent();
        assertThat(found.orElseThrow().getRole()).isEqualTo(Role.USER);
        assertThat(found.orElseThrow().getStatus()).isEqualTo(Status.ACTIVE);
        assertThat(found.orElseThrow().getCreatedAt()).isNotNull();

        assertThat(userAuthMapper.findById(user.getUserId())).isPresent();
        assertThat(userAuthMapper.findByRole(Role.USER)).hasSize(1);
        assertThat(userAuthMapper.findByStatus(Status.ACTIVE)).hasSize(1);

        user.updateName("수정된 사용자");
        user.changePassword("new-encoded-password");
        user.changeStatus(Status.INACTIVE);

        assertThat(userAuthMapper.updateName(user)).isOne();
        assertThat(userAuthMapper.updatePassword(user)).isOne();
        assertThat(userAuthMapper.updateStatus(user)).isOne();

        UserAuth updated = userAuthMapper.findById(user.getUserId()).orElseThrow();
        assertThat(updated.getName()).isEqualTo("수정된 사용자");
        assertThat(updated.getPassword()).isEqualTo("new-encoded-password");
        assertThat(updated.getStatus()).isEqualTo(Status.INACTIVE);
        assertThat(updated.getModifiedAt()).isNotNull();
    }
}

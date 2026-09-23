package com.gooroomees.neulbomgil_backend.identity.internal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAuth implements UserDetails {

    private Long userId;

    private String email;

    private String password;

    private String name;

    private Role role;

    private Status status;

    public void activate() {
        this.status = Status.ACTIVE;
    }

    public void updateName(String name) {
        this.name = name;
        this.modifiedAt = LocalDateTime.now();
    }

    public void updatePassword(String password) {
        this.password = password;
    }

    private LocalDateTime createdAt;

    private LocalDateTime modifiedAt;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status.equals(Status.ACTIVE);
    }

    public void changeStatus(Status status) {
        this.status = status;
    }

    public void changePassword(String newPassword) {
        this.password = newPassword;
    }

    public void deleteUser() {
        this.status = Status.REMOVED;
    }
}

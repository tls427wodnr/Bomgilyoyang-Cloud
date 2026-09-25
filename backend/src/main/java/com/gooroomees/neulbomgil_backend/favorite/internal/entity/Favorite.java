package com.gooroomees.neulbomgil_backend.favorite.internal.entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorite {

    private Long id;

    private Long userId;

    private String facilityId;
}

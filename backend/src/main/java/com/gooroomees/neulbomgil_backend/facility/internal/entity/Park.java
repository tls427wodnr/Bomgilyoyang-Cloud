package com.gooroomees.neulbomgil_backend.facility.internal.entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Park {

    private Long id;

    private String name; // 공원명

    private String category; // 공원구분

    private String lotAddress; // 소재지지번주소

    private Double latitude; // 위도

    private Double longitude; // 경도

    private Double area; // 공원면적
}

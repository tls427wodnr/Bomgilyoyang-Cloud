package com.gooroomees.neulbomgil_backend.community;

public interface CommunityStatistics {

    CommunityActivityCount countByUserId(Long userId);
}

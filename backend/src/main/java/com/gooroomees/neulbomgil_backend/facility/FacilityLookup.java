package com.gooroomees.neulbomgil_backend.facility;

import java.util.Collection;
import java.util.Map;
import java.util.Optional;

public interface FacilityLookup {

    Optional<FacilitySummary> findById(String facilityId);

    Map<String, FacilitySummary> findAllByIds(Collection<String> facilityIds);
}

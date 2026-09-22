package com.gooroomees.neulbomgil_backend.facility.internal.service;

import com.gooroomees.neulbomgil_backend.facility.FacilityLookup;
import com.gooroomees.neulbomgil_backend.facility.FacilitySummary;
import com.gooroomees.neulbomgil_backend.facility.internal.entity.Facility;
import com.gooroomees.neulbomgil_backend.facility.internal.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
class FacilityLookupService implements FacilityLookup {

    private final FacilityRepository facilityRepository;

    @Override
    public Optional<FacilitySummary> findById(String facilityId) {
        return facilityRepository.findById(facilityId)
                .map(this::toSummary);
    }

    @Override
    public Map<String, FacilitySummary> findAllByIds(Collection<String> facilityIds) {
        return facilityRepository.findAllById(facilityIds).stream()
                .map(this::toSummary)
                .collect(Collectors.toMap(
                        FacilitySummary::id,
                        Function.identity()
                ));
    }

    private FacilitySummary toSummary(Facility facility) {
        return new FacilitySummary(
                facility.getId(),
                facility.getFacilityName(),
                facility.getFacilityTel(),
                facility.getCategoryName(),
                facility.getOldAddress(),
                facility.getNewAddress(),
                facility.getLongitude(),
                facility.getLatitude(),
                facility.getFacilityScore(),
                facility.getFacilityImage(),
                facility.getCapacityCnt(),
                facility.getCurrentCnt()
        );
    }
}

package com.gooroomees.neulbomgil_backend.facility.internal.initialization;

import com.gooroomees.neulbomgil_backend.facility.internal.service.FacilityDataInitService;
import com.gooroomees.neulbomgil_backend.facility.internal.service.ParkDataInitService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
class FacilityDataInitializer implements ApplicationRunner {

    private final ParkDataInitService parkDataInitService;
    private final FacilityDataInitService facilityDataInitService;

    @Override
    public void run(ApplicationArguments args) {
        parkDataInitService.initParkData();
        facilityDataInitService.refreshFacilities();
    }
}

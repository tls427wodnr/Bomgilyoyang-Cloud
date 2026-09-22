package com.gooroomees.neulbomgil_backend;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;

class ModulithArchitectureTest {

    @Test
    void verifiesModuleBoundaries() {
        ApplicationModules modules =
                ApplicationModules.of(NeulbomgilBackendApplication.class);

        modules.verify();
    }
}
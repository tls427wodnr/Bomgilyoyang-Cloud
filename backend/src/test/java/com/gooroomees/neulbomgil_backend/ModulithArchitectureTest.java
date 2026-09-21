package com.gooroomees.neulbomgil_backend;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;

class ModulithArchitectureTest {

    @Disabled("Modulith 구조 전환 전: domain-global 순환 의존성 제거 후 활성화")
    @Test
    void verifiesModuleBoundaries() {
        ApplicationModules modules =
                ApplicationModules.of(NeulbomgilBackendApplication.class);

        modules.verify();
    }
}
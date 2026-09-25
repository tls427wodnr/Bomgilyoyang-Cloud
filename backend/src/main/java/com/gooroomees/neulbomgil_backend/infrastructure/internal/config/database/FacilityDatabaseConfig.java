package com.gooroomees.neulbomgil_backend.infrastructure.internal.config.database;

import org.apache.ibatis.session.SqlSessionFactory;
import org.flywaydb.core.Flyway;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.autoconfigure.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@Configuration
@MapperScan(
        basePackages = "com.gooroomees.neulbomgil_backend.facility.internal.mapper",
        sqlSessionTemplateRef = "facilitySqlSessionTemplate"
)
class FacilityDatabaseConfig {

    @Bean
    @ConfigurationProperties("app.datasource.facility")
    DataSourceProperties facilityDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    DataSource facilityDataSource() {
        return facilityDataSourceProperties().initializeDataSourceBuilder().build();
    }

    @Bean(initMethod = "migrate")
    Flyway facilityFlyway() {
        return ModuleDatabaseSupport.flyway(
                facilityDataSource(),
                "classpath:db/migration/facility"
        );
    }

    @Bean
    SqlSessionFactory facilitySqlSessionFactory() throws Exception {
        return ModuleDatabaseSupport.sqlSessionFactory(
                facilityDataSource(),
                "classpath*:mapper/facility/**/*.xml"
        );
    }

    @Bean
    SqlSessionTemplate facilitySqlSessionTemplate() throws Exception {
        return ModuleDatabaseSupport.sqlSessionTemplate(facilitySqlSessionFactory());
    }

    @Bean
    PlatformTransactionManager facilityTransactionManager() {
        return ModuleDatabaseSupport.transactionManager(facilityDataSource());
    }
}

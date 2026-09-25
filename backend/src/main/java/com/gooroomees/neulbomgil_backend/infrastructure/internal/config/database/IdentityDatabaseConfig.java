package com.gooroomees.neulbomgil_backend.infrastructure.internal.config.database;

import org.apache.ibatis.session.SqlSessionFactory;
import org.flywaydb.core.Flyway;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.autoconfigure.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@Configuration
@MapperScan(
        basePackages = "com.gooroomees.neulbomgil_backend.identity.internal.mapper",
        sqlSessionTemplateRef = "identitySqlSessionTemplate"
)
class IdentityDatabaseConfig {

    @Bean
    @Primary
    @ConfigurationProperties("app.datasource.identity")
    DataSourceProperties identityDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @Primary
    DataSource identityDataSource() {
        return identityDataSourceProperties().initializeDataSourceBuilder().build();
    }

    @Bean(initMethod = "migrate")
    Flyway identityFlyway() {
        return ModuleDatabaseSupport.flyway(
                identityDataSource(),
                "classpath:db/migration/identity"
        );
    }

    @Bean
    @Primary
    SqlSessionFactory identitySqlSessionFactory() throws Exception {
        return ModuleDatabaseSupport.sqlSessionFactory(
                identityDataSource(),
                "classpath*:mapper/identity/**/*.xml"
        );
    }

    @Bean
    @Primary
    SqlSessionTemplate identitySqlSessionTemplate() throws Exception {
        return ModuleDatabaseSupport.sqlSessionTemplate(identitySqlSessionFactory());
    }

    @Bean
    @Primary
    PlatformTransactionManager identityTransactionManager() {
        return ModuleDatabaseSupport.transactionManager(identityDataSource());
    }
}

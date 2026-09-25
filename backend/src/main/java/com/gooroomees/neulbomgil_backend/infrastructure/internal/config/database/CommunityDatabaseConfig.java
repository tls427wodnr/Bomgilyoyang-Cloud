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
        basePackages = {
                "com.gooroomees.neulbomgil_backend.community.internal.board.mapper",
                "com.gooroomees.neulbomgil_backend.community.internal.reply.mapper"
        },
        sqlSessionTemplateRef = "communitySqlSessionTemplate"
)
class CommunityDatabaseConfig {

    @Bean
    @ConfigurationProperties("app.datasource.community")
    DataSourceProperties communityDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    DataSource communityDataSource() {
        return communityDataSourceProperties().initializeDataSourceBuilder().build();
    }

    @Bean(initMethod = "migrate")
    Flyway communityFlyway() {
        return ModuleDatabaseSupport.flyway(
                communityDataSource(),
                "classpath:db/migration/community"
        );
    }

    @Bean
    SqlSessionFactory communitySqlSessionFactory() throws Exception {
        return ModuleDatabaseSupport.sqlSessionFactory(
                communityDataSource(),
                "classpath*:mapper/community/**/*.xml"
        );
    }

    @Bean
    SqlSessionTemplate communitySqlSessionTemplate() throws Exception {
        return ModuleDatabaseSupport.sqlSessionTemplate(communitySqlSessionFactory());
    }

    @Bean
    PlatformTransactionManager communityTransactionManager() {
        return ModuleDatabaseSupport.transactionManager(communityDataSource());
    }
}

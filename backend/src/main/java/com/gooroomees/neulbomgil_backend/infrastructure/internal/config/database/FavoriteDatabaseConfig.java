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
        basePackages = "com.gooroomees.neulbomgil_backend.favorite.internal.mapper",
        sqlSessionTemplateRef = "favoriteSqlSessionTemplate"
)
class FavoriteDatabaseConfig {

    @Bean
    @ConfigurationProperties("app.datasource.favorite")
    DataSourceProperties favoriteDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    DataSource favoriteDataSource() {
        return favoriteDataSourceProperties().initializeDataSourceBuilder().build();
    }

    @Bean(initMethod = "migrate")
    Flyway favoriteFlyway() {
        return ModuleDatabaseSupport.flyway(
                favoriteDataSource(),
                "classpath:db/migration/favorite"
        );
    }

    @Bean
    SqlSessionFactory favoriteSqlSessionFactory() throws Exception {
        return ModuleDatabaseSupport.sqlSessionFactory(
                favoriteDataSource(),
                "classpath*:mapper/favorite/**/*.xml"
        );
    }

    @Bean
    SqlSessionTemplate favoriteSqlSessionTemplate() throws Exception {
        return ModuleDatabaseSupport.sqlSessionTemplate(favoriteSqlSessionFactory());
    }

    @Bean
    PlatformTransactionManager favoriteTransactionManager() {
        return ModuleDatabaseSupport.transactionManager(favoriteDataSource());
    }
}

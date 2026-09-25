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
        basePackages = "com.gooroomees.neulbomgil_backend.chat.internal.mapper",
        sqlSessionTemplateRef = "chatSqlSessionTemplate"
)
class ChatDatabaseConfig {

    @Bean
    @ConfigurationProperties("app.datasource.chat")
    DataSourceProperties chatDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    DataSource chatDataSource() {
        return chatDataSourceProperties().initializeDataSourceBuilder().build();
    }

    @Bean(initMethod = "migrate")
    Flyway chatFlyway() {
        return ModuleDatabaseSupport.flyway(chatDataSource(), "classpath:db/migration/chat");
    }

    @Bean
    SqlSessionFactory chatSqlSessionFactory() throws Exception {
        return ModuleDatabaseSupport.sqlSessionFactory(
                chatDataSource(),
                "classpath*:mapper/chat/**/*.xml"
        );
    }

    @Bean
    SqlSessionTemplate chatSqlSessionTemplate() throws Exception {
        return ModuleDatabaseSupport.sqlSessionTemplate(chatSqlSessionFactory());
    }

    @Bean
    PlatformTransactionManager chatTransactionManager() {
        return ModuleDatabaseSupport.transactionManager(chatDataSource());
    }
}

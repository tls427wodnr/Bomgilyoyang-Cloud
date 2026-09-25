package com.gooroomees.neulbomgil_backend.infrastructure.internal.config.database;

import org.apache.ibatis.session.SqlSessionFactory;
import org.flywaydb.core.Flyway;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

final class ModuleDatabaseSupport {

    private ModuleDatabaseSupport() {
    }

    static Flyway flyway(DataSource dataSource, String migrationLocation) {
        return Flyway.configure()
                .dataSource(dataSource)
                .locations(migrationLocation)
                .validateMigrationNaming(true)
                .outOfOrder(false)
                .cleanDisabled(true)
                .load();
    }

    static SqlSessionFactory sqlSessionFactory(DataSource dataSource, String mapperLocation)
            throws Exception {
        org.apache.ibatis.session.Configuration configuration =
                new org.apache.ibatis.session.Configuration();
        configuration.setMapUnderscoreToCamelCase(true);

        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        factoryBean.setConfiguration(configuration);
        factoryBean.setMapperLocations(
                new PathMatchingResourcePatternResolver().getResources(mapperLocation)
        );
        return factoryBean.getObject();
    }

    static SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }

    static PlatformTransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}

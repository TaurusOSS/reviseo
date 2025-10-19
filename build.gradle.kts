plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.spring)
    alias(libs.plugins.spring.boot)
    alias(libs.plugins.spring.dependency.management)
    alias(libs.plugins.spotless)
    alias(libs.plugins.kotest)
}

group = "pl.taurus"
version = "0.0.1-SNAPSHOT"
description = "Reviseo - automatic code review"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(libs.spring.boot.starter.actuator)
    implementation(libs.spring.boot.starter.data.jdbc)
    implementation(libs.spring.boot.starter.jdbc)
    implementation(libs.spring.boot.starter.web)
    implementation(libs.jackson.module.kotlin)
    implementation(libs.flyway.core)
    implementation(libs.kotlin.reflect)
    implementation(libs.spring.modulith.starter.core)
    implementation(libs.spring.modulith.starter.jdbc)
    runtimeOnly(libs.h2)
    runtimeOnly(libs.spring.modulith.actuator)
    runtimeOnly(libs.spring.modulith.observability)
    testImplementation(libs.spring.boot.starter.test)
    testImplementation(libs.kotlin.test.junit5)
    testImplementation(libs.spring.modulith.starter.test)
    testImplementation(libs.kotest.framework.engine)
    testImplementation(libs.kotest.runner.junit5)
    testImplementation(libs.kotest.extensions.spring)
    testRuntimeOnly(libs.junit.platform.launcher)
}

dependencyManagement {
    imports {
        mavenBom("org.springframework.modulith:spring-modulith-bom:${libs.versions.spring.modulith.get()}")
    }
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
}

spotless {
    kotlin {
        ktlint(libs.versions.ktlint.get())
    }
    kotlinGradle {
        ktlint(libs.versions.ktlint.get())
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.withType<Test>().configureEach {
    useJUnitPlatform()
}

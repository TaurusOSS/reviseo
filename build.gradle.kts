plugins {
    application
    alias(libs.plugins.spring.boot)
    alias(libs.plugins.spring.dependency.management)
}

group = "pl.taurus"
version = "0.0.1-SNAPSHOT"
description = "Reviseo - automatic code review"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(25)
    }
}

application {
    mainClass.set("pl.taurus.reviseo.ReviseoApplicationKt")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(project("backend"))
    implementation(project("frontend"))
}

dependencyManagement {
    imports {
        mavenBom("org.springframework.modulith:spring-modulith-bom:${libs.versions.spring.modulith.get()}")
    }
}
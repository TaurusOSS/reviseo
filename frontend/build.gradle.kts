import com.github.gradle.node.npm.task.NpmTask

plugins {
    `java-library`
    alias(libs.plugins.gradle.node)
}

node {
    download = true
    version = "24.13.0"
}

tasks.register<NpmTask>("npmBuild") {
    description = "Builds the frontend"
    group = "build"

    dependsOn(tasks.npmInstall)
    args.set(listOf("run", "build"))
    inputs.dir(project.fileTree("src"))
    inputs.dir(project.fileTree("public"))
    inputs.files(
        fileTree("src") { include("**/*") },
        fileTree("public") { include("**/*") },
        "package.json",
        "package-lock.json",
        "vite.config.ts",
        "tsconfig.json",
        "index.html"
    )
    outputs.dir(project.layout.buildDirectory.dir("dist"))
    outputs.cacheIf { true }
}

tasks.register<NpmTask>("npmDev") {
    description = "Runs Vite dev server"
    group = "application"
    dependsOn(tasks.npmInstall)
    args.set(listOf("run", "dev"))
    outputs.upToDateWhen { false }
}
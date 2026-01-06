package pl.taurus.reviseo.persona

import com.tngtech.archunit.core.importer.ClassFileImporter
import com.tngtech.archunit.core.importer.ImportOption
import com.tngtech.archunit.library.Architectures.layeredArchitecture
import io.kotest.core.spec.style.ShouldSpec

private const val INCOMING_ADAPTERS = "Incoming adapters"
private const val OUTGOING_ADAPTERS = "Outgoing adapters"
private const val DOMAIN_MODELS = "Domain models"
private const val DOMAIN_SERVICES = "Domain services"
private const val INCOMING_PORT = "Incoming port"
private const val OUTGOING_PORT = "Outgoing port"
private const val BASE_PACKAGE = "pl.taurus.reviseo.persona"

class ArchitectureTest :
    ShouldSpec({

        should("Have valid hexagonal architecture") {
            val javaClasses =
                ClassFileImporter()
                    .withImportOption(ImportOption.DoNotIncludeTests())
                    .importPackages("pl.taurus.reviseo.persona")

            layeredArchitecture()
                .consideringOnlyDependenciesInLayers()
                .layer(INCOMING_ADAPTERS)
                .definedBy("$BASE_PACKAGE.adapter.incoming..")
                .layer(OUTGOING_ADAPTERS)
                .definedBy("$BASE_PACKAGE.adapter.outgoing..")
                .layer(DOMAIN_MODELS)
                .definedBy("$BASE_PACKAGE.application.domain.model..")
                .layer(DOMAIN_SERVICES)
                .definedBy("$BASE_PACKAGE.application.domain.service..")
                .layer(INCOMING_PORT)
                .definedBy("$BASE_PACKAGE.application.port.incoming..")
                .layer(OUTGOING_PORT)
                .definedBy("$BASE_PACKAGE.application.port.outgoing..")
                .whereLayer(INCOMING_ADAPTERS)
                .mayNotBeAccessedByAnyLayer()
                .whereLayer(OUTGOING_ADAPTERS)
                .mayNotBeAccessedByAnyLayer()
                .whereLayer(INCOMING_PORT)
                .mayOnlyBeAccessedByLayers(
                    DOMAIN_SERVICES,
                    INCOMING_ADAPTERS,
                ).whereLayer(OUTGOING_PORT)
                .mayOnlyBeAccessedByLayers(
                    DOMAIN_SERVICES,
                    OUTGOING_ADAPTERS,
                ).whereLayer(DOMAIN_MODELS)
                .mayNotAccessAnyLayer()
                .check(javaClasses)
        }
    })

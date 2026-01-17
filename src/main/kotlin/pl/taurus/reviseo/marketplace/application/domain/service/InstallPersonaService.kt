package pl.taurus.reviseo.marketplace.application.domain.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import pl.taurus.reviseo.marketplace.application.port.incoming.InstallPersonaUseCase
import pl.taurus.reviseo.marketplace.application.port.outgoing.FindMarketplacePersonaPort
import pl.taurus.reviseo.persona.application.port.incoming.CreatePersonaUseCase
import java.util.UUID

@Service
class InstallPersonaService(
    private val findMarketplacePersonaPort: FindMarketplacePersonaPort,
    private val createPersonaUseCase: CreatePersonaUseCase,
) : InstallPersonaUseCase {
    @Transactional
    override fun install(marketplacePersonaIdentifier: UUID) {
        val marketplacePersona =
            findMarketplacePersonaPort.findByIdentifier(marketplacePersonaIdentifier)
                ?: throw IllegalArgumentException("Marketplace persona not found: $marketplacePersonaIdentifier")

        createPersonaUseCase.createPersona(
            CreatePersonaUseCase.CreatePersonaCommand(
                name = marketplacePersona.name,
                description = marketplacePersona.description,
                customInstructions = marketplacePersona.customInstructions,
                checklist = marketplacePersona.checklist,
                keyAspects = marketplacePersona.keyAspects,
            ),
        )
    }
}

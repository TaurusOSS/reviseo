package pl.taurus.reviseo.marketplace.application.domain.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import pl.taurus.reviseo.marketplace.application.port.incoming.GetPersonasUseCase
import pl.taurus.reviseo.marketplace.application.port.incoming.MarketplacePersonaView
import pl.taurus.reviseo.marketplace.application.port.outgoing.FindAllMarketplacePersonasPort
import pl.taurus.reviseo.persona.application.port.incoming.GetAllPersonasUseCase

@Service
internal class GetPersonasService(
    private val findAllMarketplacePersonasPort: FindAllMarketplacePersonasPort,
    private val getAllPersonasUseCase: GetAllPersonasUseCase,
) : GetPersonasUseCase {
    @Transactional(readOnly = true)
    override fun getPersonas(): List<MarketplacePersonaView> {
        val installedPersonaNames = getAllPersonasUseCase.getAllPersonaNames()
        return findAllMarketplacePersonasPort.findAll().map {
            MarketplacePersonaView(
                identifier = it.identifier,
                name = it.name,
                description = it.description,
                customInstructions = it.customInstructions,
                checklist = it.checklist,
                keyAspects = it.keyAspects,
                isInstalled = installedPersonaNames.contains(it.name),
            )
        }
    }
}

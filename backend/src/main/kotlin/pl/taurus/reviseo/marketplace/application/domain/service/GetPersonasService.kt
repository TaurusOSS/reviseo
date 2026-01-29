package pl.taurus.reviseo.marketplace.application.domain.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import pl.taurus.reviseo.marketplace.application.domain.model.MarketplacePersona
import pl.taurus.reviseo.marketplace.application.port.incoming.GetPersonasUseCase
import pl.taurus.reviseo.marketplace.application.port.outgoing.FindAllMarketplacePersonasPort

@Service
internal class GetPersonasService(
    private val findAllMarketplacePersonasPort: FindAllMarketplacePersonasPort,
) : GetPersonasUseCase {
    @Transactional(readOnly = true)
    override fun getPersonas(): List<MarketplacePersona> = findAllMarketplacePersonasPort.findAll()
}

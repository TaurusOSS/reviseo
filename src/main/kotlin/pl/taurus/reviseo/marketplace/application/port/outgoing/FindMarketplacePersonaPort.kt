package pl.taurus.reviseo.marketplace.application.port.outgoing

import pl.taurus.reviseo.marketplace.application.domain.model.MarketplacePersona
import java.util.UUID

fun interface FindMarketplacePersonaPort {
    fun findByIdentifier(identifier: UUID): MarketplacePersona?
}

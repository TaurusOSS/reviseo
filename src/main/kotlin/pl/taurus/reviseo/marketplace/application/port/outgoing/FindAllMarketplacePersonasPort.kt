package pl.taurus.reviseo.marketplace.application.port.outgoing

import pl.taurus.reviseo.marketplace.application.domain.model.MarketplacePersona

fun interface FindAllMarketplacePersonasPort {
    fun findAll(): List<MarketplacePersona>
}

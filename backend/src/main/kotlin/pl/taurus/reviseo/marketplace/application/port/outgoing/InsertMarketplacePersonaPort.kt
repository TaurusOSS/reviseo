package pl.taurus.reviseo.marketplace.application.port.outgoing

import pl.taurus.reviseo.marketplace.application.domain.model.MarketplacePersona

fun interface InsertMarketplacePersonaPort {
    fun insertAll(marketplacePersonas: List<MarketplacePersona>)
}

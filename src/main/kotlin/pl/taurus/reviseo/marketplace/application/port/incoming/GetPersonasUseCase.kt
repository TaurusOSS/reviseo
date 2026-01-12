package pl.taurus.reviseo.marketplace.application.port.incoming

import pl.taurus.reviseo.marketplace.application.domain.model.MarketplacePersona

fun interface GetPersonasUseCase {
    fun getPersonas(): List<MarketplacePersona>
}

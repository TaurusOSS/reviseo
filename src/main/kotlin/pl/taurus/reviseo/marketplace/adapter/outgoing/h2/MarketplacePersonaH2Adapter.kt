package pl.taurus.reviseo.marketplace.adapter.outgoing.h2

import org.springframework.data.jdbc.core.JdbcAggregateTemplate
import org.springframework.stereotype.Component
import pl.taurus.reviseo.marketplace.application.domain.model.MarketplacePersona
import pl.taurus.reviseo.marketplace.application.port.outgoing.InsertMarketplacePersonaPort
import pl.taurus.reviseo.marketplace.application.port.outgoing.RemoveMarketplacePersonaPort

@Component
internal class MarketplacePersonaH2Adapter(
    private val repository: MarketplacePersonaRepository,
    private val jdbcAggregateTemplate: JdbcAggregateTemplate,
) : RemoveMarketplacePersonaPort,
    InsertMarketplacePersonaPort {
    override fun removeAll() {
        repository.deleteAll()
    }

    override fun insertAll(marketplacePersonas: List<MarketplacePersona>) {
        // jdbcAggregateTemplate is used here because id is self-generated in the application layer
        // so repository tries to do update instead of insert
        marketplacePersonas.map { toEntity(it) }.forEach { jdbcAggregateTemplate.insert(it) }
    }

    private fun toEntity(persona: MarketplacePersona): MarketplacePersonaEntity =
        MarketplacePersonaEntity(
            persona.identifier,
            persona.name,
            persona.description,
            persona.customInstructions,
            persona.checklist.toTypedArray(),
            persona.keyAspects.toTypedArray(),
        )
}

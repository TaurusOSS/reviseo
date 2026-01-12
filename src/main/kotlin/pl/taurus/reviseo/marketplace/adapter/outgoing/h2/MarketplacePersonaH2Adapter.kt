package pl.taurus.reviseo.marketplace.adapter.outgoing.h2

import org.springframework.data.jdbc.core.JdbcAggregateTemplate
import org.springframework.stereotype.Component
import pl.taurus.reviseo.marketplace.application.domain.model.MarketplacePersona
import pl.taurus.reviseo.marketplace.application.port.outgoing.FindAllMarketplacePersonasPort
import pl.taurus.reviseo.marketplace.application.port.outgoing.InsertMarketplacePersonaPort
import pl.taurus.reviseo.marketplace.application.port.outgoing.RemoveMarketplacePersonaPort

@Component
internal class MarketplacePersonaH2Adapter(
    private val repository: MarketplacePersonaRepository,
    private val jdbcAggregateTemplate: JdbcAggregateTemplate,
) : RemoveMarketplacePersonaPort,
    InsertMarketplacePersonaPort,
    FindAllMarketplacePersonasPort {
    override fun removeAll() {
        repository.deleteAll()
    }

    override fun insertAll(marketplacePersonas: List<MarketplacePersona>) {
        // jdbcAggregateTemplate is used here because id is self-generated in the application layer
        // so repository tries to do update instead of insert
        marketplacePersonas.map { toEntity(it) }.forEach { jdbcAggregateTemplate.insert(it) }
    }

    override fun findAll(): List<MarketplacePersona> = repository.findAll().map { fromEntity(it) }

    private fun toEntity(persona: MarketplacePersona): MarketplacePersonaEntity =
        MarketplacePersonaEntity(
            persona.identifier,
            persona.name,
            persona.description,
            persona.customInstructions,
            persona.checklist.toTypedArray(),
            persona.keyAspects.toTypedArray(),
        )

    private fun fromEntity(entity: MarketplacePersonaEntity): MarketplacePersona =
        MarketplacePersona(
            entity.identifier,
            entity.name,
            entity.description,
            entity.customInstructions,
            entity.checklist.toList(),
            entity.keyAspects.toList(),
        )
}

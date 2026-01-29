package pl.taurus.reviseo.marketplace.adapter.outgoing.h2

import org.springframework.data.repository.ListCrudRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
internal interface MarketplacePersonaRepository : ListCrudRepository<MarketplacePersonaEntity, UUID>

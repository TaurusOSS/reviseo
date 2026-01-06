package pl.taurus.reviseo.marketplace.application.domain.model

import java.util.UUID

data class MarketplacePersona(
    val identifier: UUID,
    val name: String,
    val description: String,
    val customInstructions: String,
    val checklist: List<String>,
    val keyAspects: List<String>,
)

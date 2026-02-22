package pl.taurus.reviseo.marketplace.application.port.incoming

import java.util.UUID

fun interface GetPersonasUseCase {
    fun getPersonas(): List<MarketplacePersonaView>
}

data class MarketplacePersonaView(
    val identifier: UUID,
    val name: String,
    val description: String,
    val customInstructions: String,
    val checklist: List<String>,
    val keyAspects: List<String>,
    val isInstalled: Boolean,
)

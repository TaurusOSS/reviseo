package pl.taurus.reviseo.marketplace.application.port.incoming

import java.util.UUID

fun interface InstallPersonaUseCase {
    fun install(marketplacePersonaIdentifier: UUID)
}

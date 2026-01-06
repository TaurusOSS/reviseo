package pl.taurus.reviseo.marketplace.application.domain.service

import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import pl.taurus.reviseo.marketplace.application.port.incoming.ReloadMarketplaceUseCase
import pl.taurus.reviseo.marketplace.application.port.outgoing.DownloadMarketplacePersonaPort
import pl.taurus.reviseo.marketplace.application.port.outgoing.InsertMarketplacePersonaPort
import pl.taurus.reviseo.marketplace.application.port.outgoing.RemoveMarketplacePersonaPort

@Service
internal class ReloadMarketplaceService(
    private val removeMarketplacePersonaPort: RemoveMarketplacePersonaPort,
    private val downloadMarketplacePersonaPort: DownloadMarketplacePersonaPort,
    private val insertMarketplacePersonaPort: InsertMarketplacePersonaPort,
) : ReloadMarketplaceUseCase {
    private val logger = KotlinLogging.logger {}

    @Transactional
    override fun reload() {
        logger.info { "Reloading marketplace personas" }
        removeMarketplacePersonaPort.removeAll()

        val marketplacePersonas = downloadMarketplacePersonaPort.downloadAll()

        insertMarketplacePersonaPort.insertAll(marketplacePersonas)
        logger.info { "Marketplace personas reloaded. Total count of personas: ${marketplacePersonas.size}" }
    }
}

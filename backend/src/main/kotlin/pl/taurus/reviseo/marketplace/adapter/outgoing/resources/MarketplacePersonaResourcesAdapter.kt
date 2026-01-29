package pl.taurus.reviseo.marketplace.adapter.outgoing.resources

import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.core.io.support.PathMatchingResourcePatternResolver
import org.springframework.stereotype.Component
import pl.taurus.reviseo.marketplace.application.domain.model.MarketplacePersona
import pl.taurus.reviseo.marketplace.application.port.outgoing.DownloadMarketplacePersonaPort
import tools.jackson.databind.ObjectMapper

@Component
class MarketplacePersonaResourcesAdapter(
    private val objectMapper: ObjectMapper,
) : DownloadMarketplacePersonaPort {
    private val logger = KotlinLogging.logger {}

    override fun downloadAll(): List<MarketplacePersona> {
        val resolver = PathMatchingResourcePatternResolver()

        return resolver.getResources("classpath:/personas/**/*.json").toList().map { resource ->
            logger.info { "Loading persona from resource: ${resource.filename}" }
            resource.inputStream.use { inputStream ->
                objectMapper.readValue(inputStream, MarketplacePersona::class.java)
            }
        }
    }
}

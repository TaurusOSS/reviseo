package pl.taurus.reviseo.marketplace.adapter.incoming.web

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController
import pl.taurus.reviseo.marketplace.application.port.incoming.GetPersonasUseCase
import pl.taurus.reviseo.marketplace.application.port.incoming.InstallPersonaUseCase
import pl.taurus.reviseo.marketplace.application.port.incoming.MarketplacePersonaView
import pl.taurus.reviseo.marketplace.application.port.incoming.ReloadMarketplaceUseCase
import java.util.UUID

@RestController
class PersonaMarketplaceRestController(
    private val reloadMarketplaceUseCase: ReloadMarketplaceUseCase,
    private val getPersonasUseCase: GetPersonasUseCase,
    private val installPersonaUseCase: InstallPersonaUseCase,
) {
    @PostMapping("/api/marketplace/personas/reload")
    fun reloadMarketplace(): ResponseEntity<Unit> {
        reloadMarketplaceUseCase.reload()
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/api/marketplace/personas")
    fun getPersonas(): GetPersonasResponse = GetPersonasResponse(getPersonasUseCase.getPersonas())

    @PostMapping("/api/marketplace/personas/{identifier}/install")
    fun installPersona(
        @PathVariable identifier: UUID,
    ): ResponseEntity<Unit> {
        installPersonaUseCase.install(identifier)
        return ResponseEntity.noContent().build()
    }

    data class GetPersonasResponse(
        val personas: List<MarketplacePersonaView>,
    )
}

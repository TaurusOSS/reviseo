package pl.taurus.reviseo.marketplace.adapter.incoming.web

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController
import pl.taurus.reviseo.marketplace.application.port.incoming.ReloadMarketplaceUseCase

@RestController
class PersonaMarketplaceRestController(
    private val reloadMarketplaceUseCase: ReloadMarketplaceUseCase,
) {
    @PostMapping("/api/marketplace/personas/reload")
    fun reloadMarketplace(): ResponseEntity<Unit> {
        reloadMarketplaceUseCase.reload()
        return ResponseEntity.noContent().build()
    }
}

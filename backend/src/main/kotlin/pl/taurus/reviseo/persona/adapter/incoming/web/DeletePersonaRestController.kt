package pl.taurus.reviseo.persona.adapter.incoming.web

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController
import pl.taurus.reviseo.persona.application.port.incoming.DeletePersonaUseCase
import java.util.UUID

@RestController
class DeletePersonaRestController(
    private val deletePersonaUseCase: DeletePersonaUseCase,
) {
    @DeleteMapping("/api/personas/{personaIdentifier}")
    fun deletePersona(
        @PathVariable personaIdentifier: UUID,
    ): ResponseEntity<Unit> {
        deletePersonaUseCase.delete(personaIdentifier)
        return ResponseEntity.noContent().build()
    }
}

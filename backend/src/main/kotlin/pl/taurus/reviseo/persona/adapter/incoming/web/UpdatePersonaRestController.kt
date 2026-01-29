package pl.taurus.reviseo.persona.adapter.incoming.web

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import pl.taurus.reviseo.persona.application.port.incoming.UpdatePersonaUseCase
import java.util.UUID

@RestController
class UpdatePersonaRestController(
    private val updatePersonaUseCase: UpdatePersonaUseCase,
) {
    @PutMapping("/api/personas/{identifier}")
    fun updatePersona(
        @PathVariable identifier: String,
        @RequestBody request: UpdatePersonaRequest,
    ): ResponseEntity<Unit> {
        val command =
            UpdatePersonaUseCase.UpdatePersonaCommand(
                UUID.fromString(identifier),
                request.name,
                request.description,
                request.customInstructions,
                request.checklist,
                request.keyAspects,
            )

        updatePersonaUseCase.update(command)

        return ResponseEntity.noContent().build()
    }

    data class UpdatePersonaRequest(
        val name: String,
        val description: String,
        val customInstructions: String,
        val checklist: List<String>,
        val keyAspects: List<String>,
    )
}

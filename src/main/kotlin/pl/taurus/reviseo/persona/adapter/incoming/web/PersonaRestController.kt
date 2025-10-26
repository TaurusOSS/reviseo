package pl.taurus.reviseo.persona.adapter.incoming.web

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import pl.taurus.reviseo.persona.application.port.incoming.CreatePersonaUseCase
import java.util.UUID

@RestController
class PersonaRestController(
    private val createPersonaUseCase: CreatePersonaUseCase,
) {
    @PostMapping("/api/personas")
    fun createPersona(
        @RequestBody request: CreatePersonaRequest,
    ): ResponseEntity<CreatePersonaResponse> {
        val command =
            CreatePersonaUseCase.CreatePersonaCommand(
                request.name,
                request.description,
                request.customInstructions,
                request.checklist,
                request.keyAspects,
            )

        val personaIdentifier = createPersonaUseCase.createPersona(command)

        return ResponseEntity.status(HttpStatus.CREATED).body(CreatePersonaResponse(personaIdentifier.value))
    }

    data class CreatePersonaRequest(
        val name: String,
        val description: String,
        val customInstructions: String,
        val checklist: List<String>,
        val keyAspects: List<String>,
    )

    data class CreatePersonaResponse(
        val personaIdentifier: UUID,
    )
}

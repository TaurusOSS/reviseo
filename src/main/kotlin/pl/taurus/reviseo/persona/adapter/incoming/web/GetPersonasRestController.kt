package pl.taurus.reviseo.persona.adapter.incoming.web

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import pl.taurus.reviseo.persona.application.port.incoming.GetAllPersonasUseCase
import java.util.UUID

@RestController
class GetPersonasRestController(
    private val getAllPersonasUseCase: GetAllPersonasUseCase,
) {
    @GetMapping("/api/personas")
    fun getAllPersonas(): ResponseEntity<Personas> {
        val personas =
            getAllPersonasUseCase
                .getAll()
                .map { persona ->
                    PersonaDto(
                        identifier = persona.identifier.value,
                        name = persona.name.value,
                        description = persona.description.value,
                        customInstructions = persona.customInstructions.value,
                        checklist = persona.checklist.value,
                        keyAspects = persona.keyAspects.value,
                    )
                }
        return ResponseEntity.ok().body(Personas(personas))
    }

    data class Personas(
        val personas: List<PersonaDto>,
    )

    data class PersonaDto(
        val identifier: UUID,
        val name: String,
        val description: String,
        val customInstructions: String,
        val checklist: List<String>,
        val keyAspects: List<String>,
    )
}

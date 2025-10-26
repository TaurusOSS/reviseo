package pl.taurus.reviseo.persona.application.port.incoming

import pl.taurus.reviseo.persona.application.domain.model.PersonaIdentifier

fun interface CreatePersonaUseCase {
    fun createPersona(command: CreatePersonaCommand): PersonaIdentifier

    data class CreatePersonaCommand(
        val name: String,
        val description: String,
        val customInstructions: String,
        val checklist: List<String>,
        val keyAspects: List<String>,
    )
}

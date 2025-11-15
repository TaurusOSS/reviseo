package pl.taurus.reviseo.persona.application.port.incoming

import java.util.UUID

fun interface UpdatePersonaUseCase {
    fun update(command: UpdatePersonaCommand)

    data class UpdatePersonaCommand(
        val identifier: UUID,
        val name: String,
        val description: String,
        val customInstructions: String,
        val checklist: List<String>,
        val keyAspects: List<String>,
    )
}

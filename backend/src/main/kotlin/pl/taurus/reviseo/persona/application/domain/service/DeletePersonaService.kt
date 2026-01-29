package pl.taurus.reviseo.persona.application.domain.service

import io.github.oshai.kotlinlogging.KotlinLogging
import pl.taurus.reviseo.persona.application.domain.model.PersonaIdentifier
import pl.taurus.reviseo.persona.application.port.incoming.DeletePersonaUseCase
import pl.taurus.reviseo.persona.application.port.outgoing.DeletePersonaPort
import java.util.UUID

private val logger = KotlinLogging.logger {}

class DeletePersonaService(
    private val deletePersonaPort: DeletePersonaPort,
) : DeletePersonaUseCase {
    override fun delete(identifier: UUID) {
        logger.info { "Deleting persona with id: $identifier" }

        deletePersonaPort.delete(PersonaIdentifier(identifier))

        logger.info { "Persona deleted with id: $identifier" }
    }
}

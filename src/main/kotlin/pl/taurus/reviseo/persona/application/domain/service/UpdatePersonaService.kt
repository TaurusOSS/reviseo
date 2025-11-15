package pl.taurus.reviseo.persona.application.domain.service

import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.transaction.annotation.Transactional
import pl.taurus.reviseo.persona.application.domain.model.Checklist
import pl.taurus.reviseo.persona.application.domain.model.CustomInstructions
import pl.taurus.reviseo.persona.application.domain.model.KeyAspects
import pl.taurus.reviseo.persona.application.domain.model.PersonaDescription
import pl.taurus.reviseo.persona.application.domain.model.PersonaIdentifier
import pl.taurus.reviseo.persona.application.domain.model.PersonaName
import pl.taurus.reviseo.persona.application.port.incoming.UpdatePersonaUseCase
import pl.taurus.reviseo.persona.application.port.outgoing.FindPersonaPort
import pl.taurus.reviseo.persona.application.port.outgoing.UpdatePersonaPort

private val logger = KotlinLogging.logger {}

open class UpdatePersonaService(
    private val findPersonaPort: FindPersonaPort,
    private val updatePersonaPort: UpdatePersonaPort,
) : UpdatePersonaUseCase {
    @Transactional
    override fun update(command: UpdatePersonaUseCase.UpdatePersonaCommand) {
        logger.info { "Updating persona with identifier: ${command.identifier}" }

        val personaIdentifier = PersonaIdentifier(command.identifier)
        val persona =
            findPersonaPort.byIdentifier(personaIdentifier) ?: throw PersonaNotFoundException(
                personaIdentifier,
            )

        val updatedPersona =
            persona.update(
                PersonaName(command.name),
                PersonaDescription(command.description),
                CustomInstructions(command.customInstructions),
                Checklist(command.checklist),
                KeyAspects(command.keyAspects),
            )

        updatePersonaPort.update(updatedPersona)

        logger.info { "Persona updated with identifier: ${command.identifier}" }
    }
}

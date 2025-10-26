package pl.taurus.reviseo.persona.application.domain.service

import org.springframework.transaction.annotation.Transactional
import pl.taurus.reviseo.persona.application.domain.model.Checklist
import pl.taurus.reviseo.persona.application.domain.model.CustomInstructions
import pl.taurus.reviseo.persona.application.domain.model.KeyAspects
import pl.taurus.reviseo.persona.application.domain.model.Persona
import pl.taurus.reviseo.persona.application.domain.model.PersonaDescription
import pl.taurus.reviseo.persona.application.domain.model.PersonaIdentifier
import pl.taurus.reviseo.persona.application.domain.model.PersonaName
import pl.taurus.reviseo.persona.application.port.incoming.CreatePersonaUseCase
import pl.taurus.reviseo.persona.application.port.outgoing.FindPersonaPort
import pl.taurus.reviseo.persona.application.port.outgoing.GeneratePersonaIdentifierPort
import pl.taurus.reviseo.persona.application.port.outgoing.InsertPersonaPort

open class CreatePersonaService(
    private val findPersonaPort: FindPersonaPort,
    private val generatePersonaIdentifierPort: GeneratePersonaIdentifierPort,
    private val insertPersonaPort: InsertPersonaPort,
) : CreatePersonaUseCase {
    @Transactional
    override fun createPersona(command: CreatePersonaUseCase.CreatePersonaCommand): PersonaIdentifier {
        if (findPersonaPort.byName(command.name) != null) {
            throw PersonaNameNotUniqueException(command.name)
        }

        val persona =
            Persona(
                generatePersonaIdentifierPort.generate(),
                PersonaName(command.name),
                PersonaDescription(command.description),
                CustomInstructions(command.customInstructions),
                Checklist(command.checklist),
                KeyAspects(command.keyAspects),
            )

        insertPersonaPort.insert(persona)

        return persona.identifier
    }
}

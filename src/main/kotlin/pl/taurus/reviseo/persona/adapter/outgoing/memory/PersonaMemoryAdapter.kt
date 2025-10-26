package pl.taurus.reviseo.persona.adapter.outgoing.memory

import org.springframework.stereotype.Component
import pl.taurus.reviseo.persona.application.domain.model.PersonaIdentifier
import pl.taurus.reviseo.persona.application.port.outgoing.GeneratePersonaIdentifierPort
import java.util.UUID

@Component
internal class PersonaMemoryAdapter : GeneratePersonaIdentifierPort {
    override fun generate(): PersonaIdentifier = PersonaIdentifier(UUID.randomUUID())
}

package pl.taurus.reviseo.persona.application.port.outgoing

import pl.taurus.reviseo.persona.application.domain.model.Persona
import pl.taurus.reviseo.persona.application.domain.model.PersonaIdentifier

interface FindPersonaPort {
    fun byName(name: String): Persona?

    fun byIdentifier(identifier: PersonaIdentifier): Persona?
}

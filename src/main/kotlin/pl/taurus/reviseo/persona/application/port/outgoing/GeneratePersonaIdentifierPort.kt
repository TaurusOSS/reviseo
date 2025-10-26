package pl.taurus.reviseo.persona.application.port.outgoing

import pl.taurus.reviseo.persona.application.domain.model.PersonaIdentifier

fun interface GeneratePersonaIdentifierPort {
    fun generate(): PersonaIdentifier
}

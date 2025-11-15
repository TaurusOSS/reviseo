package pl.taurus.reviseo.persona.application.domain.service

import pl.taurus.reviseo.persona.application.domain.model.PersonaIdentifier

class PersonaNotFoundException(
    identifier: PersonaIdentifier,
) : RuntimeException("Persona with ${identifier.value} identifier not found")

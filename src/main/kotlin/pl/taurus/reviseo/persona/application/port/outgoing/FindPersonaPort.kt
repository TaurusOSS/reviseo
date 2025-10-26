package pl.taurus.reviseo.persona.application.port.outgoing

import pl.taurus.reviseo.persona.application.domain.model.Persona

interface FindPersonaPort {
    fun byName(name: String): Persona?
}

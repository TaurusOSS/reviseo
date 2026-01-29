package pl.taurus.reviseo.persona.application.port.outgoing

import pl.taurus.reviseo.persona.application.domain.model.Persona

fun interface InsertPersonaPort {
    fun insert(persona: Persona)
}

package pl.taurus.reviseo.persona.application.port.outgoing

import pl.taurus.reviseo.persona.application.domain.model.Persona

fun interface FindAllPersonasPort {
    fun findAll(): List<Persona>
}

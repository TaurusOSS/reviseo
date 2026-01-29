package pl.taurus.reviseo.persona.application.port.incoming

import pl.taurus.reviseo.persona.application.domain.model.Persona

fun interface GetAllPersonasUseCase {
    fun getAll(): List<Persona>
}

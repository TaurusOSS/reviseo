package pl.taurus.reviseo.persona.application.port.incoming

import pl.taurus.reviseo.persona.application.domain.model.Persona

interface GetAllPersonasUseCase {
    fun getAll(): List<Persona>

    fun getAllPersonaNames(): List<String>
}

package pl.taurus.reviseo.persona.application.port.incoming

import java.util.UUID

fun interface DeletePersonaUseCase {
    fun delete(identifier: UUID)
}

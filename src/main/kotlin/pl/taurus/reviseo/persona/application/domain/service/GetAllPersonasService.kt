package pl.taurus.reviseo.persona.application.domain.service

import io.github.oshai.kotlinlogging.KotlinLogging
import pl.taurus.reviseo.persona.application.domain.model.Persona
import pl.taurus.reviseo.persona.application.port.incoming.GetAllPersonasUseCase
import pl.taurus.reviseo.persona.application.port.outgoing.FindAllPersonasPort

private val logger = KotlinLogging.logger {}

class GetAllPersonasService(
    private val findAllPersonasPort: FindAllPersonasPort,
) : GetAllPersonasUseCase {
    override fun getAll(): List<Persona> {
        logger.info { "Getting all personas" }

        val allPersonas = findAllPersonasPort.findAll()
        logger.debug { "Found ${allPersonas.size} personas" }
        return allPersonas.sortedBy { it.name.value }
    }
}

package pl.taurus.reviseo.persona.adapter.outgoing.h2

import org.springframework.data.jdbc.core.JdbcAggregateTemplate
import org.springframework.stereotype.Component
import pl.taurus.reviseo.persona.application.domain.model.Persona
import pl.taurus.reviseo.persona.application.domain.model.PersonaIdentifier
import pl.taurus.reviseo.persona.application.port.outgoing.DeletePersonaPort
import pl.taurus.reviseo.persona.application.port.outgoing.FindAllPersonasPort
import pl.taurus.reviseo.persona.application.port.outgoing.FindPersonaPort
import pl.taurus.reviseo.persona.application.port.outgoing.InsertPersonaPort
import pl.taurus.reviseo.persona.application.port.outgoing.UpdatePersonaPort

@Component
internal class PersonaH2Adapter(
    private val repository: PersonaRepository,
    private val jdbcAggregateTemplate: JdbcAggregateTemplate,
) : FindPersonaPort,
    FindAllPersonasPort,
    InsertPersonaPort,
    DeletePersonaPort,
    UpdatePersonaPort {
    override fun byName(name: String): Persona? = repository.findByName(name)?.toDomain()

    override fun byIdentifier(identifier: PersonaIdentifier): Persona? =
        repository
            .findById(identifier.value)
            .map {
                it.toDomain()
            }.orElse(null)

    override fun insert(persona: Persona) {
        val entity = toEntity(persona)

        // jdbcAggregateTemplate is used here because id is self-generated in the application layer
        // so repository tries to do update instead of insert
        jdbcAggregateTemplate.insert(entity)
    }

    override fun findAll(): List<Persona> =
        repository
            .findAll()
            .map { it.toDomain() }

    override fun delete(identifier: PersonaIdentifier) {
        repository.deleteById(identifier.value)
    }

    override fun update(persona: Persona) {
        repository.save(toEntity(persona))
    }

    private fun toEntity(persona: Persona): PersonaEntity =
        PersonaEntity(
            persona.identifier.value,
            persona.name.value,
            persona.description.value,
            persona.customInstructions.value,
            persona.checklist.value.toTypedArray(),
            persona.keyAspects.value.toTypedArray(),
        )
}

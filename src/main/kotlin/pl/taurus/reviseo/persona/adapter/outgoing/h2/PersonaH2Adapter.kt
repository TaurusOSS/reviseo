package pl.taurus.reviseo.persona.adapter.outgoing.h2

import org.springframework.data.jdbc.core.JdbcAggregateTemplate
import org.springframework.stereotype.Component
import pl.taurus.reviseo.persona.application.domain.model.Persona
import pl.taurus.reviseo.persona.application.port.outgoing.FindPersonaPort
import pl.taurus.reviseo.persona.application.port.outgoing.InsertPersonaPort

@Component
internal class PersonaH2Adapter(
    private val repository: PersonaRepository,
    private val jdbcAggregateTemplate: JdbcAggregateTemplate,
) : FindPersonaPort,
    InsertPersonaPort {
    override fun byName(name: String): Persona? = repository.findByName(name)?.toDomain()

    override fun insert(persona: Persona) {
        val entity = toEntity(persona)

        // jdbcAggregateTemplate is used here because id is self-generated in the application layer
        // so repository tries to do update instead of insert
        jdbcAggregateTemplate.insert(entity)
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

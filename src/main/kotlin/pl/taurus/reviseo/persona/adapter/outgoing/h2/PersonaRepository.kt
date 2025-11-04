package pl.taurus.reviseo.persona.adapter.outgoing.h2

import org.springframework.data.repository.ListCrudRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
internal interface PersonaRepository : ListCrudRepository<PersonaEntity, UUID> {
    fun findByName(name: String): PersonaEntity?
}

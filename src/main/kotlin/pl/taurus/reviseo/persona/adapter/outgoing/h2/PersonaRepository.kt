package pl.taurus.reviseo.persona.adapter.outgoing.h2

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
internal interface PersonaRepository : CrudRepository<PersonaEntity, UUID> {
    fun findByName(name: String): PersonaEntity?
}

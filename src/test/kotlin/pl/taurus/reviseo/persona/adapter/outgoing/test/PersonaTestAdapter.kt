package pl.taurus.reviseo.persona.adapter.outgoing.test

import pl.taurus.reviseo.persona.application.domain.model.Persona
import pl.taurus.reviseo.persona.application.domain.model.PersonaIdentifier
import pl.taurus.reviseo.persona.application.port.outgoing.FindPersonaPort
import pl.taurus.reviseo.persona.application.port.outgoing.GeneratePersonaIdentifierPort
import pl.taurus.reviseo.persona.application.port.outgoing.InsertPersonaPort
import java.util.UUID

class PersonaTestAdapter :
    FindPersonaPort,
    InsertPersonaPort,
    GeneratePersonaIdentifierPort {
    private val personas: MutableList<Persona> = mutableListOf()
    private val idsToGenerate = ArrayDeque<UUID>()

    override fun byName(name: String): Persona? = personas.firstOrNull { it.name.value == name }

    override fun insert(persona: Persona) {
        personas.add(persona)
    }

    override fun generate(): PersonaIdentifier = PersonaIdentifier(idsToGenerate.removeFirst())

    fun addIdToGenerate(id: UUID) {
        idsToGenerate.addLast(id)
    }

    fun removeAllPersonas() {
        personas.clear()
    }

    fun clearIds() {
        idsToGenerate.clear()
    }
}

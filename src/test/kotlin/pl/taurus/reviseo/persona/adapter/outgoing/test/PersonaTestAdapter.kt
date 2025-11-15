package pl.taurus.reviseo.persona.adapter.outgoing.test

import pl.taurus.reviseo.persona.application.domain.model.Persona
import pl.taurus.reviseo.persona.application.domain.model.PersonaIdentifier
import pl.taurus.reviseo.persona.application.port.outgoing.DeletePersonaPort
import pl.taurus.reviseo.persona.application.port.outgoing.FindAllPersonasPort
import pl.taurus.reviseo.persona.application.port.outgoing.FindPersonaPort
import pl.taurus.reviseo.persona.application.port.outgoing.GeneratePersonaIdentifierPort
import pl.taurus.reviseo.persona.application.port.outgoing.InsertPersonaPort
import pl.taurus.reviseo.persona.application.port.outgoing.UpdatePersonaPort
import java.util.UUID

class PersonaTestAdapter :
    FindPersonaPort,
    FindAllPersonasPort,
    InsertPersonaPort,
    GeneratePersonaIdentifierPort,
    DeletePersonaPort,
    UpdatePersonaPort {
    private val personas: MutableList<Persona> = mutableListOf()
    private val idsToGenerate = ArrayDeque<UUID>()

    override fun byName(name: String): Persona? = personas.firstOrNull { it.name.value == name }

    override fun byIdentifier(identifier: PersonaIdentifier): Persona? = personas.firstOrNull { it.identifier == identifier }

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

    override fun findAll(): List<Persona> = personas.toList()

    override fun delete(identifier: PersonaIdentifier) {
        personas.removeIf { it.identifier == identifier }
    }

    override fun update(persona: Persona) {
        personas.removeIf { it.identifier == persona.identifier }
        personas.add(persona)
    }
}

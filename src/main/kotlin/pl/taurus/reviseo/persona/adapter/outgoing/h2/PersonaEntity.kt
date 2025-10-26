package pl.taurus.reviseo.persona.adapter.outgoing.h2

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import pl.taurus.reviseo.persona.application.domain.model.Checklist
import pl.taurus.reviseo.persona.application.domain.model.CustomInstructions
import pl.taurus.reviseo.persona.application.domain.model.KeyAspects
import pl.taurus.reviseo.persona.application.domain.model.Persona
import pl.taurus.reviseo.persona.application.domain.model.PersonaDescription
import pl.taurus.reviseo.persona.application.domain.model.PersonaIdentifier
import pl.taurus.reviseo.persona.application.domain.model.PersonaName
import java.util.UUID

@Table("PERSONA")
internal data class PersonaEntity(
    @Id
    @Column("IDENTIFIER")
    val identifier: UUID,
    @Column("NAME")
    var name: String,
    @Column("DESCRIPTION")
    var description: String,
    @Column("CUSTOM_INSTRUCTIONS")
    var customInstructions: String,
    @Column("CHECKLIST")
    var checklist: Array<String>,
    @Column("KEY_ASPECTS")
    var keyAspects: Array<String>,
) {
    fun toDomain(): Persona =
        Persona(
            identifier = PersonaIdentifier(identifier),
            name = PersonaName(name),
            description = PersonaDescription(description),
            customInstructions = CustomInstructions(customInstructions),
            checklist = Checklist(checklist.toList()),
            keyAspects = KeyAspects(keyAspects.toList()),
        )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as PersonaEntity

        return identifier == other.identifier
    }

    override fun hashCode(): Int = identifier.hashCode()
}

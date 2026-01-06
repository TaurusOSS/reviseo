package pl.taurus.reviseo.marketplace.adapter.outgoing.h2

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import pl.taurus.reviseo.marketplace.application.domain.model.MarketplacePersona
import java.util.UUID

@Table("MARKETPLACE_PERSONA")
internal data class MarketplacePersonaEntity(
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
    fun toDomain(): MarketplacePersona =
        MarketplacePersona(
            identifier = identifier,
            name = name,
            description = description,
            customInstructions = customInstructions,
            checklist = checklist.toList(),
            keyAspects = keyAspects.toList(),
        )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as MarketplacePersonaEntity

        return identifier == other.identifier
    }

    override fun hashCode(): Int = identifier.hashCode()
}

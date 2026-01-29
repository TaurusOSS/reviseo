package pl.taurus.reviseo.persona.application.domain.model

import java.util.UUID

fun persona(block: PersonaBuilder.() -> Unit): Persona {
    val builder = PersonaBuilder()
    builder.block()
    return builder.build()
}

class PersonaBuilder {
    var identifier: UUID? = null
    var name: String? = null
    var description: String? = null
    var customInstructions: String? = null
    var checklist: List<String>? = null
    var keyAspects: List<String>? = null

    fun build(): Persona =
        Persona(
            identifier = PersonaIdentifier(identifier ?: UUID.randomUUID()),
            name = PersonaName(name ?: "Prompt engineer"),
            description = PersonaDescription(description ?: "Expert in crafting prompts for AI models"),
            customInstructions = CustomInstructions(customInstructions ?: "Use formal language"),
            checklist =
                Checklist(
                    checklist ?: listOf(
                        "Define clear objectives",
                        "Understand the AI model capabilities",
                    ),
                ),
            keyAspects = KeyAspects(keyAspects ?: listOf("Prompts", "Creativity")),
        )
}

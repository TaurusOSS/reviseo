package pl.taurus.reviseo.persona.application.domain.model

import java.util.UUID

fun createPersona(): Persona =
    Persona(
        PersonaIdentifier(UUID.randomUUID()),
        PersonaName("Prompt engineer"),
        PersonaDescription("Expert in crafting prompts for AI models"),
        CustomInstructions("Use formal language"),
        Checklist(
            listOf(
                "Define clear objectives",
                "Understand the AI model capabilities",
            ),
        ),
        KeyAspects(listOf("Prompts", "Creativity")),
    )

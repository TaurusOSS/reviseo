package pl.taurus.reviseo.persona.application.domain.model

data class Persona(
    val identifier: PersonaIdentifier,
    val name: PersonaName,
    val description: PersonaDescription,
    val customInstructions: CustomInstructions,
    val checklist: Checklist,
    val keyAspects: KeyAspects,
)

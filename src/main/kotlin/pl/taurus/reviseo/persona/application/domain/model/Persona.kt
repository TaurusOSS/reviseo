package pl.taurus.reviseo.persona.application.domain.model

data class Persona(
    val identifier: PersonaIdentifier,
    val name: PersonaName,
    val description: PersonaDescription,
    val customInstructions: CustomInstructions,
    val checklist: Checklist,
    val keyAspects: KeyAspects,
) {
    fun update(
        name: PersonaName,
        description: PersonaDescription,
        customInstructions: CustomInstructions,
        checklist: Checklist,
        keyAspects: KeyAspects,
    ): Persona =
        this.copy(
            name = name,
            description = description,
            customInstructions = customInstructions,
            checklist = checklist,
            keyAspects = keyAspects,
        )
}

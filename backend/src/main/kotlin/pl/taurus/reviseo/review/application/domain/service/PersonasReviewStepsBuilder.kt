package pl.taurus.reviseo.review.application.domain.service

import pl.taurus.reviseo.persona.application.domain.model.Persona

class PersonasReviewStepsBuilder {
    private val steps = mutableListOf<String>()

    fun addPersonas(personas: List<Persona>): PersonasReviewStepsBuilder {
        personas.forEach { addPersona(it) }
        return this
    }

    fun addPersona(persona: Persona): PersonasReviewStepsBuilder {
        val personaInstructions = StringBuilder()
        personaInstructions.append(persona.customInstructions.value)
        personaInstructions.append("\n")
        personaInstructions.append("Checklist:\n")
        persona.checklist.value.forEach { item -> personaInstructions.append("- $item\n") }

        return addStep(persona.name.value, personaInstructions.toString().removeSuffix("\n"))
    }

    fun addStep(
        title: String,
        instructions: String,
    ): PersonasReviewStepsBuilder {
        val newStepNumber = steps.size + 1
        steps.add("Step $newStepNumber: $title\n$instructions\n")
        return this
    }

    fun build(): String = steps.joinToString("\n").removeSuffix("\n")
}

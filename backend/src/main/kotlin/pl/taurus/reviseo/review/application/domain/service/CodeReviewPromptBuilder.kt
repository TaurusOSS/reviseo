package pl.taurus.reviseo.review.application.domain.service

import pl.taurus.reviseo.persona.application.domain.model.Persona

class CodeReviewPromptBuilder {
    private val generalInstructions = mutableListOf<String>()
    private val steps = mutableListOf<String>()

    fun addGeneralInstruction(instruction: String): CodeReviewPromptBuilder {
        generalInstructions.add(instruction)
        return this
    }

    fun addPersonas(personas: List<Persona>): CodeReviewPromptBuilder {
        personas.forEach { addPersona(it) }
        return this
    }

    fun addPersona(persona: Persona): CodeReviewPromptBuilder {
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
    ): CodeReviewPromptBuilder {
        val newStepNumber = steps.size + 1
        steps.add("Step $newStepNumber: $title\n$instructions\n")
        return this
    }

    fun build(): String {
        val joinedGeneralInstructions = generalInstructions.joinToString("\n")
        val joinedSteps = steps.joinToString("\n")
        return (joinedGeneralInstructions + "\n\n" + joinedSteps).trim()
    }
}

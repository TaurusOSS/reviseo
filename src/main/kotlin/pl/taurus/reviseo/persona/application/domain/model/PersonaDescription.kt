package pl.taurus.reviseo.persona.application.domain.model

@JvmInline
value class PersonaDescription(
    val value: String,
) {
    init {
        require(value.isNotBlank()) { "Persona description cannot be blank" }
        require(value.length <= 1000) { "Persona description cannot be longer than 1000 characters" }
    }
}

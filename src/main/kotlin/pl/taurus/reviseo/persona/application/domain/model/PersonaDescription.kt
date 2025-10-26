package pl.taurus.reviseo.persona.application.domain.model

@JvmInline
value class PersonaDescription(
    val value: String,
) {
    init {
        require(value.isNotBlank()) { "Persona description cannot be blank" }
        require(value.length <= 500) { "Persona description cannot be longer than 500 characters" }
    }
}

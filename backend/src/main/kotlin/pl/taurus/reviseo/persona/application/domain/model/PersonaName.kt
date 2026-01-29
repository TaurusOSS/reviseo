package pl.taurus.reviseo.persona.application.domain.model

@JvmInline
value class PersonaName(
    val value: String,
) {
    init {
        require(value.isNotBlank()) { "Persona name cannot be blank" }
        require(value.length <= 50) { "Persona name cannot be longer than 50 characters" }
    }
}

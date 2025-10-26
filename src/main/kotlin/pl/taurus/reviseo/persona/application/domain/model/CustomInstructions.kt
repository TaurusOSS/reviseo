package pl.taurus.reviseo.persona.application.domain.model

@JvmInline
value class CustomInstructions(
    val value: String,
) {
    init {
        require(value.isNotBlank()) { "Custom instructions cannot be blank" }
        require(value.length <= 500) { "Custom instructions cannot be longer than 500 characters" }
    }
}

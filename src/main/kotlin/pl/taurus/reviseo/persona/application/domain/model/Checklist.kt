package pl.taurus.reviseo.persona.application.domain.model

@JvmInline
value class Checklist(
    val value: List<String>,
) {
    init {
        require(value.isNotEmpty()) { "Checklist cannot be empty" }
        require(value.size <= 20) { "Checklist cannot have more than 20 items" }
        require(value.all { it.isNotBlank() }) { "Checklist cannot contain blank items" }
        require(value.distinct().size == value.size) { "Checklist cannot contain duplicate items" }
        require(value.none { it.length > 100 }) { "Checklist cannot contain items longer than 100 characters" }
    }
}

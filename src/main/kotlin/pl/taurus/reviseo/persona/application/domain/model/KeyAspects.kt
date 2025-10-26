package pl.taurus.reviseo.persona.application.domain.model

@JvmInline
value class KeyAspects(
    val value: List<String>,
) {
    init {
        require(value.isNotEmpty()) {
            "Key aspects cannot be empty"
        }
        require(value.size <= 10) {
            "Key aspects cannot have more than 10 items"
        }
        require(value.all { it.isNotBlank() }) {
            "Key aspects cannot contain blank items"
        }
        require(value.distinct().size == value.size) {
            "Key aspects cannot contain duplicate items"
        }
        require(value.none { it.length > 100 }) { "Key aspects cannot contain items longer than 100 characters" }
        require(value.none { it.contains("[^A-Za-z]".toRegex()) }) { "Key aspects cannot contain special characters" }
    }
}

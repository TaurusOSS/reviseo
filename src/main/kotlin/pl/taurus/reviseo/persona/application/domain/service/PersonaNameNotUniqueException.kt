package pl.taurus.reviseo.persona.application.domain.service

class PersonaNameNotUniqueException(
    private val name: String,
) : RuntimeException("Persona with name '$name' already exists")

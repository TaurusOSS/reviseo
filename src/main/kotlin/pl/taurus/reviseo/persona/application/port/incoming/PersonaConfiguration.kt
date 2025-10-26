package pl.taurus.reviseo.persona.application.port.incoming

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import pl.taurus.reviseo.persona.application.domain.service.CreatePersonaService
import pl.taurus.reviseo.persona.application.port.outgoing.FindPersonaPort
import pl.taurus.reviseo.persona.application.port.outgoing.GeneratePersonaIdentifierPort
import pl.taurus.reviseo.persona.application.port.outgoing.InsertPersonaPort

@Configuration
class PersonaConfiguration {
    @Bean
    fun createPersonaService(
        findPersonaPort: FindPersonaPort,
        generatePersonaIdentifierPort: GeneratePersonaIdentifierPort,
        insertPersonaPort: InsertPersonaPort,
    ): CreatePersonaService = CreatePersonaService(findPersonaPort, generatePersonaIdentifierPort, insertPersonaPort)
}

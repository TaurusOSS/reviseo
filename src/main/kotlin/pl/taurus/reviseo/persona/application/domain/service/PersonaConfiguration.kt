package pl.taurus.reviseo.persona.application.domain.service

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import pl.taurus.reviseo.persona.application.port.outgoing.DeletePersonaPort
import pl.taurus.reviseo.persona.application.port.outgoing.FindAllPersonasPort
import pl.taurus.reviseo.persona.application.port.outgoing.FindPersonaPort
import pl.taurus.reviseo.persona.application.port.outgoing.GeneratePersonaIdentifierPort
import pl.taurus.reviseo.persona.application.port.outgoing.InsertPersonaPort

@Configuration
internal class PersonaConfiguration {
    @Bean
    fun createPersonaService(
        findPersonaPort: FindPersonaPort,
        generatePersonaIdentifierPort: GeneratePersonaIdentifierPort,
        insertPersonaPort: InsertPersonaPort,
    ): CreatePersonaService = CreatePersonaService(findPersonaPort, generatePersonaIdentifierPort, insertPersonaPort)

    @Bean
    fun getAllPersonasService(findAllPersonasPort: FindAllPersonasPort): GetAllPersonasService = GetAllPersonasService(findAllPersonasPort)

    @Bean
    fun deletePersonaService(deletePersonaPort: DeletePersonaPort): DeletePersonaService = DeletePersonaService(deletePersonaPort)
}

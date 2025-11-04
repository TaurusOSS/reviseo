package pl.taurus.reviseo.persona.adapter.incoming.web

import io.kotest.core.extensions.ApplyExtension
import io.kotest.core.spec.style.BehaviorSpec
import io.kotest.extensions.spring.SpringExtension
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.json.JsonCompareMode
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import pl.taurus.reviseo.persona.adapter.outgoing.h2.PersonaRepository
import pl.taurus.reviseo.persona.application.domain.model.persona
import pl.taurus.reviseo.persona.application.port.outgoing.InsertPersonaPort
import pl.taurus.reviseo.testsupport.file.readFile
import java.util.UUID

@SpringBootTest
@ApplyExtension(SpringExtension::class)
@AutoConfigureMockMvc
internal class GetPersonasRestControllerModuleTest(
    insertPersonaPort: InsertPersonaPort,
    mockMvc: MockMvc,
    personaRepository: PersonaRepository,
) : BehaviorSpec({

        afterContainer {
            personaRepository.deleteAll()
        }

        Context("Should get persona") {
            Given("Persona in repository") {
                val persona =
                    persona {
                        identifier = UUID.fromString("7bfe3d0f-46b5-4266-bea0-37cd3e4aaaf0")
                    }
                insertPersonaPort.insert(persona)

                When("Get all personas") {
                    val resultActions = mockMvc.get("/api/personas")

                    Then("Persona is returned") {
                        resultActions.andExpect {
                            status { isOk() }
                            content {
                                json(
                                    readFile("testdata/persona/moduletest/expected_get_all_personas_response.json"),
                                    JsonCompareMode.STRICT,
                                )
                            }
                        }
                    }
                }
            }
        }
    })

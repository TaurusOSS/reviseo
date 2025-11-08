package pl.taurus.reviseo.persona.adapter.incoming.web

import io.kotest.core.extensions.ApplyExtension
import io.kotest.core.spec.style.BehaviorSpec
import io.kotest.extensions.spring.SpringExtension
import io.kotest.matchers.shouldBe
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import pl.taurus.reviseo.persona.adapter.outgoing.h2.PersonaRepository
import pl.taurus.reviseo.persona.application.domain.model.persona
import pl.taurus.reviseo.persona.application.port.outgoing.InsertPersonaPort

@SpringBootTest
@ApplyExtension(SpringExtension::class)
@AutoConfigureMockMvc
internal class DeletePersonaRestControllerModuleTest(
    mockMvc: MockMvc,
    personaRepository: PersonaRepository,
    insertPersonaPort: InsertPersonaPort,
) : BehaviorSpec({

        afterContainer {
            personaRepository.deleteAll()
        }

        Context("Should delete persona") {
            Given("Existing persona") {
                val persona = persona {}
                insertPersonaPort.insert(persona)

                When("Delete persona") {
                    val resultActions = mockMvc.delete("/api/personas/${persona.identifier.value}")

                    Then("Persona should not exist") {
                        resultActions.andExpect { status { isNoContent() } }

                        personaRepository.findAll().isEmpty() shouldBe true
                    }
                }
            }
        }
    })

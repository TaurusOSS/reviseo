package pl.taurus.reviseo.persona.adapter.incoming.web

import io.kotest.core.extensions.ApplyExtension
import io.kotest.core.spec.style.BehaviorSpec
import io.kotest.extensions.spring.SpringExtension
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import pl.taurus.reviseo.persona.adapter.outgoing.h2.PersonaRepository
import pl.taurus.reviseo.persona.application.domain.model.persona
import pl.taurus.reviseo.persona.application.port.outgoing.InsertPersonaPort

@SpringBootTest
@ApplyExtension(SpringExtension::class)
@AutoConfigureMockMvc
internal class UpdatePersonaRestControllerModuleTest(
    mockMvc: MockMvc,
    personaRepository: PersonaRepository,
    insertPersonaPort: InsertPersonaPort,
) : BehaviorSpec({

        afterContainer {
            personaRepository.deleteAll()
        }

        Context("Should update persona") {
            Given("Existing persona") {
                val persona = persona {}
                insertPersonaPort.insert(persona)

                val request =
                    """
                    {
                        "name": "Prompt engineer",
                        "description": "Updated description",
                        "customInstructions": "Act as senior prompt engineer",
                        "checklist": ["Define clear input and output", "Contains steps for complex prompts"],
                        "keyAspects": ["Prompts", "Creativity"]
                    }
                    """.trimIndent()

                When("Update persona") {
                    val resultActions =
                        mockMvc.perform(
                            put("/api/personas/{identifier}", persona.identifier.value).content(request).contentType("application/json"),
                        )

                    Then("Persona is updated") {
                        resultActions.andExpect(status().isNoContent())

                        personaRepository.count() shouldBe 1
                        val createdPersona = personaRepository.findByName("Prompt engineer")

                        createdPersona shouldNotBeNull {
                            name shouldBe "Prompt engineer"
                            description shouldBe "Updated description"
                            customInstructions shouldBe "Act as senior prompt engineer"
                            checklist shouldBe listOf("Define clear input and output", "Contains steps for complex prompts")
                            keyAspects shouldBe listOf("Prompts", "Creativity")
                        }
                    }
                }
            }
        }
    })

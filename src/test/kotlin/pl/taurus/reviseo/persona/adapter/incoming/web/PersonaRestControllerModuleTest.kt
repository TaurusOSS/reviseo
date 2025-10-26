package pl.taurus.reviseo.persona.adapter.incoming.web

import io.kotest.core.extensions.ApplyExtension
import io.kotest.core.spec.style.BehaviorSpec
import io.kotest.extensions.spring.SpringExtension
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import pl.taurus.reviseo.persona.adapter.outgoing.h2.PersonaRepository

@SpringBootTest
@ApplyExtension(SpringExtension::class)
@AutoConfigureMockMvc
internal class PersonaRestControllerModuleTest(
    mockMvc: MockMvc,
    personaRepository: PersonaRepository,
) : BehaviorSpec({

        Context("Should create persona") {
            Given("Request with valid parameters") {
                val request =
                    """
                    {
                        "name": "Prompt engineer",
                        "description": "Best for AI prompts",
                        "customInstructions": "Act as senior prompt engineer",
                        "checklist": ["Define clear input and output", "Contains steps for complex prompts"],
                        "keyAspects": ["Prompts", "Creativity"]
                    }
                    """.trimIndent()

                When("Create persona") {
                    val resultActions =
                        mockMvc.perform(
                            post("/api/personas").content(request).contentType("application/json"),
                        )

                    Then("Persona is created") {
                        resultActions.andExpect(status().isCreated())

                        personaRepository.count() shouldBe 1
                        val createdPersona = personaRepository.findByName("Prompt engineer")
                        createdPersona shouldNotBeNull {
                            name shouldBe "Prompt engineer"
                            description shouldBe "Best for AI prompts"
                            customInstructions shouldBe "Act as senior prompt engineer"
                            checklist shouldBe listOf("Define clear input and output", "Contains steps for complex prompts")
                            keyAspects shouldBe listOf("Prompts", "Creativity")
                        }
                    }
                }
            }
        }
    })

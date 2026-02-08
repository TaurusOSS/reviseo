package pl.taurus.reviseo.review.adapter.incoming.web

import io.kotest.core.extensions.ApplyExtension
import io.kotest.core.spec.style.BehaviorSpec
import io.kotest.extensions.spring.SpringExtension
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post
import pl.taurus.reviseo.marketplace.adapter.outgoing.h2.MarketplacePersonaRepository
import pl.taurus.reviseo.persona.adapter.outgoing.h2.PersonaRepository
import pl.taurus.reviseo.testsupport.file.readFile

@SpringBootTest
@ActiveProfiles("test")
@ApplyExtension(SpringExtension::class)
@AutoConfigureMockMvc
internal class GenerateCodeReviewRestControllerModuleTest(
    mockMvc: MockMvc,
    marketplacePersonaRepository: MarketplacePersonaRepository,
    personaRepository: PersonaRepository,
) : BehaviorSpec({

        afterContainer {
            marketplacePersonaRepository.deleteAll()
            personaRepository.deleteAll()
        }

        Given("Reloaded marketplace and Clean Code Expert persona installed") {
            mockMvc.post("/api/marketplace/personas/reload")
            val cleanCodeExpert =
                marketplacePersonaRepository
                    .findAll()
                    .find { it.name == "Clean Code Expert" }!!
            mockMvc.post("/api/marketplace/personas/${cleanCodeExpert.identifier}/install")

            val installedPersonaIdentifier = personaRepository.findByName("Clean Code Expert")!!.identifier

            When("User ask for prompt for code review which will use Clean Code Expert persona") {
                val request =
                    """
                    {
                        "pullRequestUrl": "https://github.com/taurus-software/reviseo/pull/1",
                        "personasIdentifiers": ["$installedPersonaIdentifier"]
                    }
                    """.trimIndent()

                val resultActions =
                    mockMvc.post("/api/reviews/prompt") {
                        contentType = MediaType.APPLICATION_JSON
                        content = request
                    }

                Then("Code review prompt is generated") {
                    val expectedPrompt = readFile("testdata/review/moduletest/expected_code_review_prompt.txt").replace("\r", "")

                    resultActions.andExpect {
                        status { isOk() }
                        content { jsonPath("$.prompt") { value(expectedPrompt) } }
                    }
                }
            }
        }
    })

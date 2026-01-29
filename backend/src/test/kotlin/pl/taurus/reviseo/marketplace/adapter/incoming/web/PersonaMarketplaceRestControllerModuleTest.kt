package pl.taurus.reviseo.marketplace.adapter.incoming.web

import io.kotest.core.extensions.ApplyExtension
import io.kotest.core.spec.style.BehaviorSpec
import io.kotest.extensions.spring.SpringExtension
import io.kotest.matchers.shouldBe
import org.hamcrest.Matchers.containsInAnyOrder
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import pl.taurus.reviseo.marketplace.adapter.outgoing.h2.MarketplacePersonaRepository
import pl.taurus.reviseo.persona.adapter.outgoing.h2.PersonaRepository

@SpringBootTest
@ApplyExtension(SpringExtension::class)
@AutoConfigureMockMvc
internal class PersonaMarketplaceRestControllerModuleTest(
    mockMvc: MockMvc,
    marketplacePersonaRepository: MarketplacePersonaRepository,
    personaRepository: PersonaRepository,
) : BehaviorSpec({

        afterContainer {
            marketplacePersonaRepository.deleteAll()
            personaRepository.deleteAll()
        }

        Context("Should reload marketplace") {
            When("Request is sent") {
                val resultActions = mockMvc.post("/api/marketplace/personas/reload")

                Then("Marketplace is reloaded") {
                    resultActions.andExpect { status { isNoContent() } }

                    marketplacePersonaRepository.count() shouldBe 11
                    marketplacePersonaRepository.findAll().map { it.name } shouldBe
                        listOf(
                            "Prompt Engineer",
                            "Hexagonal Architecture Expert",
                            "Modular Monolith Expert",
                            "Software Architect",
                            "Concurrency Expert",
                            "Clean Code Expert",
                            "Database Interaction Expert",
                            "Azure Pipelines Architect",
                            "Spring Batch Expert",
                            "Security Expert",
                            "Testing Expert",
                        )
                }
            }
        }

        Context("Should return marketplace personas") {
            Given("Reloaded marketplace") {
                mockMvc.post("/api/marketplace/personas/reload")

                When("Request is sent") {

                    val resultActions = mockMvc.get("/api/marketplace/personas")

                    Then("Marketplace personas are returned") {
                        resultActions.andExpect {
                            status { isOk() }
                            content {
                                jsonPath("$.personas.length()") { value(11) }
                                jsonPath("$.personas[*].name") {
                                    value(
                                        containsInAnyOrder(
                                            "Prompt Engineer",
                                            "Hexagonal Architecture Expert",
                                            "Modular Monolith Expert",
                                            "Software Architect",
                                            "Concurrency Expert",
                                            "Clean Code Expert",
                                            "Database Interaction Expert",
                                            "Azure Pipelines Architect",
                                            "Spring Batch Expert",
                                            "Security Expert",
                                            "Testing Expert",
                                        ),
                                    )
                                }
                                val cleanCodeExpert =
                                    marketplacePersonaRepository
                                        .findAll()
                                        .find { it.name == "Clean Code Expert" }!!
                                jsonPath("$.personas[?(@.name == 'Clean Code Expert')].identifier") {
                                    value(containsInAnyOrder(cleanCodeExpert.identifier.toString()))
                                }
                                jsonPath("$.personas[?(@.name == 'Clean Code Expert')].description") {
                                    value(containsInAnyOrder(cleanCodeExpert.description))
                                }
                                jsonPath("$.personas[?(@.name == 'Clean Code Expert')].customInstructions") {
                                    value(containsInAnyOrder(cleanCodeExpert.customInstructions))
                                }
                                jsonPath(
                                    "$.personas[?(@.name == 'Clean Code Expert')].checklist.length()",
                                ) { value(cleanCodeExpert.checklist.size) }
                                jsonPath("$.personas[?(@.name == 'Clean Code Expert')].checklist[*]") {
                                    value(containsInAnyOrder(*cleanCodeExpert.checklist))
                                }
                                jsonPath(
                                    "$.personas[?(@.name == 'Clean Code Expert')].keyAspects.length()",
                                ) { value(cleanCodeExpert.keyAspects.size) }
                                jsonPath("$.personas[?(@.name == 'Clean Code Expert')].keyAspects[*]") {
                                    value(containsInAnyOrder(*cleanCodeExpert.keyAspects))
                                }
                            }
                        }
                    }
                }
            }
        }

        Context("Should install marketplace persona") {
            Given("Reloaded marketplace") {
                mockMvc.post("/api/marketplace/personas/reload")
                val cleanCodeExpert =
                    marketplacePersonaRepository
                        .findAll()
                        .find { it.name == "Clean Code Expert" }!!

                When("Installation request is sent") {
                    val resultActions = mockMvc.post("/api/marketplace/personas/${cleanCodeExpert.identifier}/install")

                    Then("Persona is installed") {
                        resultActions.andExpect { status { isNoContent() } }

                        mockMvc.get("/api/personas").andExpect {
                            status { isOk() }
                            content {
                                jsonPath("$.personas.length()") { value(1) }
                                jsonPath("$.personas[0].name") { value(cleanCodeExpert.name) }
                                jsonPath("$.personas[0].description") { value(cleanCodeExpert.description) }
                                jsonPath("$.personas[0].customInstructions") { value(cleanCodeExpert.customInstructions) }
                                jsonPath("$.personas[0].checklist.length()") { value(cleanCodeExpert.checklist.size) }
                                jsonPath("$.personas[0].checklist[*]") {
                                    value(containsInAnyOrder(*cleanCodeExpert.checklist))
                                }
                                jsonPath("$.personas[0].keyAspects.length()") { value(cleanCodeExpert.keyAspects.size) }
                                jsonPath("$.personas[0].keyAspects[*]") {
                                    value(containsInAnyOrder(*cleanCodeExpert.keyAspects))
                                }
                            }
                        }
                    }
                }
            }
        }
    })

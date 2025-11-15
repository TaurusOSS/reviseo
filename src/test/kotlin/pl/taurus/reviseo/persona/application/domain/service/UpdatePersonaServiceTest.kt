package pl.taurus.reviseo.persona.application.domain.service

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.BehaviorSpec
import io.kotest.matchers.shouldBe
import pl.taurus.reviseo.persona.adapter.outgoing.test.PersonaTestAdapter
import pl.taurus.reviseo.persona.application.domain.model.persona
import pl.taurus.reviseo.persona.application.port.incoming.UpdatePersonaUseCase
import java.util.UUID

class UpdatePersonaServiceTest :
    BehaviorSpec({

        val personaTestAdapter = PersonaTestAdapter()

        val service = PersonaConfiguration().updatePersonaService(personaTestAdapter, personaTestAdapter)

        afterContainer {
            personaTestAdapter.removeAllPersonas()
        }

        Context("Should update persona") {
            Given("Existing persona") {
                val persona = persona {}
                personaTestAdapter.insert(persona)

                When("All properties are updated") {
                    service.update(
                        UpdatePersonaUseCase.UpdatePersonaCommand(
                            persona.identifier.value,
                            "new name",
                            "new description",
                            "new custom instructions",
                            listOf("new"),
                            listOf("new"),
                        ),
                    )

                    Then("Persona has updated properties") {
                        personaTestAdapter.byIdentifier(persona.identifier) shouldBe
                            persona {
                                identifier = persona.identifier.value
                                name = "new name"
                                description = "new description"
                                customInstructions = "new custom instructions"
                                checklist = listOf("new")
                                keyAspects = listOf("new")
                            }
                    }
                }
            }

            Given("Existing persona with only one field to change") {
                val persona = persona {}
                personaTestAdapter.insert(persona)

                When("Only one property is updated") {
                    service.update(
                        UpdatePersonaUseCase.UpdatePersonaCommand(
                            persona.identifier.value,
                            "Prompt engineer",
                            "Expert in crafting prompts for AI models",
                            "new custom instructions",
                            listOf("Define clear objectives", "Understand the AI model capabilities"),
                            listOf("Prompts", "Creativity"),
                        ),
                    )

                    Then("Only this property is updated") {
                        personaTestAdapter.byIdentifier(persona.identifier) shouldBe
                            persona {
                                identifier = persona.identifier.value
                                customInstructions = "new custom instructions"
                            }
                    }
                }
            }
        }

        Context("Should fail when persona doesn't exists") {
            Given("Not existing persona") {
                val notExistingPersonaIdentifier = UUID.randomUUID()

                When("Persona is updated") {
                    val exception =
                        shouldThrow<PersonaNotFoundException> {
                            service.update(
                                UpdatePersonaUseCase.UpdatePersonaCommand(
                                    notExistingPersonaIdentifier,
                                    "new name",
                                    "new description",
                                    "new custom instructions",
                                    listOf("new"),
                                    listOf("new"),
                                ),
                            )
                        }
                    Then("PersonaNotFoundException is thrown") {
                        exception.message shouldBe "Persona with $notExistingPersonaIdentifier identifier not found"
                    }
                }
            }
        }

        Context("Should fail when persona update is not valid") {
            Given("Existing persona") {
                val persona = persona {}
                personaTestAdapter.insert(persona)

                When("Persona is updated with invalid name") {
                    val exception =
                        shouldThrow<IllegalArgumentException> {
                            service.update(
                                UpdatePersonaUseCase.UpdatePersonaCommand(
                                    persona.identifier.value,
                                    " ",
                                    "Expert in crafting prompts for AI models",
                                    "new custom instructions",
                                    listOf("Define clear objectives", "Understand the AI model capabilities"),
                                    listOf("Prompts", "Creativity"),
                                ),
                            )
                        }

                    Then("IllegalArgumentException is thrown") {
                        exception.message shouldBe "Persona name cannot be blank"
                    }
                }
            }
        }
    })

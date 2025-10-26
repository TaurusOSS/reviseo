package pl.taurus.reviseo.persona.application.domain.service

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.BehaviorSpec
import io.kotest.datatest.withData
import io.kotest.matchers.shouldBe
import pl.taurus.reviseo.persona.adapter.outgoing.test.PersonaTestAdapter
import pl.taurus.reviseo.persona.application.domain.model.Checklist
import pl.taurus.reviseo.persona.application.domain.model.CustomInstructions
import pl.taurus.reviseo.persona.application.domain.model.KeyAspects
import pl.taurus.reviseo.persona.application.domain.model.Persona
import pl.taurus.reviseo.persona.application.domain.model.PersonaDescription
import pl.taurus.reviseo.persona.application.domain.model.PersonaIdentifier
import pl.taurus.reviseo.persona.application.domain.model.PersonaName
import pl.taurus.reviseo.persona.application.domain.model.createPersona
import pl.taurus.reviseo.persona.application.port.incoming.CreatePersonaUseCase
import pl.taurus.reviseo.persona.application.port.incoming.PersonaConfiguration
import java.util.UUID

class CreatePersonaServiceTest :
    BehaviorSpec({

        val personaTestAdapter = PersonaTestAdapter()

        val createPersonaService: CreatePersonaService =
            PersonaConfiguration().createPersonaService(
                personaTestAdapter,
                personaTestAdapter,
                personaTestAdapter,
            )

        val expectedIdentifier = UUID.randomUUID()

        afterContainer {
            personaTestAdapter.removeAllPersonas()
            personaTestAdapter.clearIds()
        }

        Context("Should create persona") {
            Given("Command with valid parameters") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val command =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        "Prompt engineer",
                        "Expert in crafting prompts for AI models",
                        "Use formal language",
                        listOf(
                            "Define clear objectives",
                            "Understand the AI model capabilities",
                        ),
                        listOf("Prompts", "Creativity"),
                    )

                When("persona is created") {
                    val personaIdentifier = createPersonaService.createPersona(command)

                    Then("Persona is created") {
                        personaIdentifier shouldBe PersonaIdentifier(expectedIdentifier)

                        personaTestAdapter.byName("Prompt engineer") shouldBe
                            Persona(
                                PersonaIdentifier(expectedIdentifier),
                                PersonaName("Prompt engineer"),
                                PersonaDescription("Expert in crafting prompts for AI models"),
                                CustomInstructions("Use formal language"),
                                Checklist(
                                    listOf(
                                        "Define clear objectives",
                                        "Understand the AI model capabilities",
                                    ),
                                ),
                                KeyAspects(listOf("Prompts", "Creativity")),
                            )
                    }
                }
            }
        }

        Context("Should create multiple personas with distinct identifiers") {
            Given("Two valid commands") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val id2 = UUID.randomUUID()
                personaTestAdapter.addIdToGenerate(id2)

                val command1 =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "Prompt engineer A",
                        description = "desc",
                        customInstructions = "instr",
                        checklist = listOf("one"),
                        keyAspects = listOf("a"),
                    )
                val command2 =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "Prompt engineer B",
                        description = "desc",
                        customInstructions = "instr",
                        checklist = listOf("one"),
                        keyAspects = listOf("a"),
                    )

                When("both are created") {
                    val personaId1 = createPersonaService.createPersona(command1)
                    val personaId2 = createPersonaService.createPersona(command2)

                    Then("Identifiers are returned and distinct, and both are stored") {
                        personaId1 shouldBe PersonaIdentifier(expectedIdentifier)
                        personaId2 shouldBe PersonaIdentifier(id2)
                        personaTestAdapter.byName("Prompt engineer A")!!.identifier shouldBe PersonaIdentifier(expectedIdentifier)
                        personaTestAdapter.byName("Prompt engineer B")!!.identifier shouldBe PersonaIdentifier(id2)
                    }
                }
            }
        }

        Context("Should not create persona when name already exists") {
            Given("Existing persona with the same name") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val existing = createPersona()
                personaTestAdapter.insert(existing)

                val command =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "Prompt engineer",
                        description = "New description",
                        customInstructions = "Use formal language",
                        checklist = listOf("Define clear objectives"),
                        keyAspects = listOf("Attention to detail"),
                    )

                When("create is invoked") {
                    Then("throws PersonaNameNotUniqueException") {
                        val exception =
                            shouldThrow<PersonaNameNotUniqueException> {
                                createPersonaService.createPersona(command)
                            }
                        exception.message shouldBe "Persona with name 'Prompt engineer' already exists"
                    }
                }
            }
        }

        Context("Should fail on name constraints") {
            Given("Empty persona name") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val command =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "",
                        description = "desc",
                        customInstructions = "instr",
                        checklist = listOf("one"),
                        keyAspects = listOf("a"),
                    )

                Then("throws IllegalArgumentException") {
                    val exception =
                        shouldThrow<IllegalArgumentException> {
                            createPersonaService.createPersona(command)
                        }
                    exception.message shouldBe "Persona name cannot be blank"
                }
            }

            Given("Name longer than 50 characters") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val command =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "x".repeat(51),
                        description = "desc",
                        customInstructions = "instr",
                        checklist = listOf("one"),
                        keyAspects = listOf("a"),
                    )

                Then("throws IllegalArgumentException") {
                    val exception =
                        shouldThrow<IllegalArgumentException> {
                            createPersonaService.createPersona(command)
                        }
                    exception.message shouldBe "Persona name cannot be longer than 50 characters"
                }
            }
        }

        Context("Should fail on description constraints") {
            Given("Blank description") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val command =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "Prompt engineer",
                        description = " ",
                        customInstructions = "instr",
                        checklist = listOf("one"),
                        keyAspects = listOf("a"),
                    )

                Then("throws IllegalArgumentException") {
                    val exception =
                        shouldThrow<IllegalArgumentException> {
                            createPersonaService.createPersona(command)
                        }
                    exception.message shouldBe "Persona description cannot be blank"
                }
            }

            Given("Description longer than 500 characters") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val command =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "Prompt engineer",
                        description = "a".repeat(501),
                        customInstructions = "instr",
                        checklist = listOf("one"),
                        keyAspects = listOf("a"),
                    )

                Then("throws IllegalArgumentException") {
                    val exception =
                        shouldThrow<IllegalArgumentException> {
                            createPersonaService.createPersona(command)
                        }
                    exception.message shouldBe "Persona description cannot be longer than 500 characters"
                }
            }
        }

        Context("Should fail on custom instructions constraints") {
            Given("Blank custom instructions") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val command =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "Prompt engineer",
                        description = "desc",
                        customInstructions = " ",
                        checklist = listOf("one"),
                        keyAspects = listOf("a"),
                    )

                Then("throws IllegalArgumentException") {
                    val exception =
                        shouldThrow<IllegalArgumentException> {
                            createPersonaService.createPersona(command)
                        }
                    exception.message shouldBe "Custom instructions cannot be blank"
                }
            }

            Given("Custom instructions longer than 500 characters") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val command =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "Prompt engineer",
                        description = "desc",
                        customInstructions = "a".repeat(501),
                        checklist = listOf("one"),
                        keyAspects = listOf("a"),
                    )

                Then("throws IllegalArgumentException") {
                    val exception =
                        shouldThrow<IllegalArgumentException> {
                            createPersonaService.createPersona(command)
                        }
                    exception.message shouldBe "Custom instructions cannot be longer than 500 characters"
                }
            }
        }

        Context("Should fail on checklist constraints") {
            Given("Empty checklist") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val command =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "Prompt engineer",
                        description = "desc",
                        customInstructions = "instr",
                        checklist = emptyList(),
                        keyAspects = listOf("a"),
                    )

                Then("throws IllegalArgumentException") {
                    val exception =
                        shouldThrow<IllegalArgumentException> {
                            createPersonaService.createPersona(command)
                        }
                    exception.message shouldBe "Checklist cannot be empty"
                }
            }

            Given("More than 20 checklist items") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val tooMany = List(21) { "i$it" }
                val command =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "Prompt engineer",
                        description = "desc",
                        customInstructions = "instr",
                        checklist = tooMany,
                        keyAspects = listOf("a"),
                    )

                Then("throws IllegalArgumentException") {
                    val exception =
                        shouldThrow<IllegalArgumentException> {
                            createPersonaService.createPersona(command)
                        }
                    exception.message shouldBe "Checklist cannot have more than 20 items"
                }
            }

            Given("Checklist contains a blank item") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val command =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "Prompt engineer",
                        description = "desc",
                        customInstructions = "instr",
                        checklist = listOf("one", " "),
                        keyAspects = listOf("a"),
                    )

                Then("throws IllegalArgumentException") {
                    val exception =
                        shouldThrow<IllegalArgumentException> {
                            createPersonaService.createPersona(command)
                        }
                    exception.message shouldBe "Checklist cannot contain blank items"
                }
            }

            Given("Checklist contains duplicate items") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val command =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "Prompt engineer",
                        description = "desc",
                        customInstructions = "instr",
                        checklist = listOf("one", "one"),
                        keyAspects = listOf("a"),
                    )

                Then("throws IllegalArgumentException") {
                    val exception =
                        shouldThrow<IllegalArgumentException> {
                            createPersonaService.createPersona(command)
                        }
                    exception.message shouldBe "Checklist cannot contain duplicate items"
                }
            }

            Given("Checklist contains an item longer than 100 characters") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val longItem = "a".repeat(101)
                val command =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "Prompt engineer",
                        description = "desc",
                        customInstructions = "instr",
                        checklist = listOf(longItem),
                        keyAspects = listOf("a"),
                    )

                Then("throws IllegalArgumentException") {
                    val exception =
                        shouldThrow<IllegalArgumentException> {
                            createPersonaService.createPersona(command)
                        }
                    exception.message shouldBe "Checklist cannot contain items longer than 100 characters"
                }
            }
        }

        Context("Should fail on key aspects constraints") {
            Given("Empty key aspects") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val command =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "Prompt engineer",
                        description = "desc",
                        customInstructions = "instr",
                        checklist = listOf("one"),
                        keyAspects = emptyList(),
                    )

                Then("throws IllegalArgumentException") {
                    val exception =
                        shouldThrow<IllegalArgumentException> {
                            createPersonaService.createPersona(command)
                        }
                    exception.message shouldBe "Key aspects cannot be empty"
                }
            }

            Given("More than 10 key aspects") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val tooMany = List(11) { "k$it" }
                val command =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "Prompt engineer",
                        description = "desc",
                        customInstructions = "instr",
                        checklist = listOf("one"),
                        keyAspects = tooMany,
                    )

                Then("throws IllegalArgumentException") {
                    val exception =
                        shouldThrow<IllegalArgumentException> {
                            createPersonaService.createPersona(command)
                        }
                    exception.message shouldBe "Key aspects cannot have more than 10 items"
                }
            }

            Given("Key aspects contains a blank item") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val command =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "Prompt engineer",
                        description = "desc",
                        customInstructions = "instr",
                        checklist = listOf("one"),
                        keyAspects = listOf("a", " "),
                    )

                Then("throws IllegalArgumentException") {
                    val exception =
                        shouldThrow<IllegalArgumentException> {
                            createPersonaService.createPersona(command)
                        }
                    exception.message shouldBe "Key aspects cannot contain blank items"
                }
            }

            Given("Key aspects contains duplicate items") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val command =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "Prompt engineer",
                        description = "desc",
                        customInstructions = "instr",
                        checklist = listOf("one"),
                        keyAspects = listOf("dup", "dup"),
                    )

                Then("throws IllegalArgumentException") {
                    val exception =
                        shouldThrow<IllegalArgumentException> {
                            createPersonaService.createPersona(command)
                        }
                    exception.message shouldBe "Key aspects cannot contain duplicate items"
                }
            }

            Given("Key aspects contains an item longer than 100 characters") {
                personaTestAdapter.addIdToGenerate(expectedIdentifier)

                val longItem = "a".repeat(101)
                val command =
                    CreatePersonaUseCase.CreatePersonaCommand(
                        name = "Prompt engineer",
                        description = "desc",
                        customInstructions = "instr",
                        checklist = listOf("one"),
                        keyAspects = listOf(longItem),
                    )

                Then("throws IllegalArgumentException") {
                    val exception =
                        shouldThrow<IllegalArgumentException> {
                            createPersonaService.createPersona(command)
                        }
                    exception.message shouldBe "Key aspects cannot contain items longer than 100 characters"
                }
            }

            withData("as,pect", "a.spect", "a spect", "a#spect", "a%spect", "a&spect", "a*spect", "a(spect", "a)spect") { invalidAspect ->
                Given("Key aspects contains an item with special characters: '$invalidAspect'") {
                    personaTestAdapter.addIdToGenerate(expectedIdentifier)

                    val command =
                        CreatePersonaUseCase.CreatePersonaCommand(
                            name = "Prompt engineer",
                            description = "desc",
                            customInstructions = "instr",
                            checklist = listOf("one"),
                            keyAspects = listOf(invalidAspect),
                        )

                    Then("throws IllegalArgumentException") {
                        val exception =
                            shouldThrow<IllegalArgumentException> {
                                createPersonaService.createPersona(command)
                            }
                        exception.message shouldBe "Key aspects cannot contain special characters"
                    }
                }
            }
        }
    })

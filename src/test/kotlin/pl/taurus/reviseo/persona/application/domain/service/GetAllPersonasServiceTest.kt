package pl.taurus.reviseo.persona.application.domain.service

import io.kotest.core.spec.style.BehaviorSpec
import io.kotest.matchers.shouldBe
import pl.taurus.reviseo.persona.adapter.outgoing.test.PersonaTestAdapter
import pl.taurus.reviseo.persona.application.domain.model.persona

class GetAllPersonasServiceTest :
    BehaviorSpec({

        val personaTestAdapter = PersonaTestAdapter()

        val getAllPersonasService = PersonaConfiguration().getAllPersonasService(personaTestAdapter)

        afterContainer {
            personaTestAdapter.removeAllPersonas()
        }

        Context("Should get all personas") {
            Given("2 personas in repository") {
                val cleanCodeExpert =
                    persona {
                        name = "Clean Code Expert"
                    }
                val kotlinExpert =
                    persona {
                        name = "Kotlin Expert"
                    }

                personaTestAdapter.insert(cleanCodeExpert)
                personaTestAdapter.insert(kotlinExpert)

                When("Get all personas") {
                    val personas = getAllPersonasService.getAll()

                    Then("Should return 2 personas in alphabetical order") {
                        personas.size shouldBe 2

                        personas[0] shouldBe
                            persona {
                                name = "Clean Code Expert"
                                identifier = cleanCodeExpert.identifier.value
                            }
                        personas[1] shouldBe
                            persona {
                                name = "Kotlin Expert"
                                identifier = kotlinExpert.identifier.value
                            }
                    }
                }
            }
        }

        Context("Should get empty list when no personas in repository") {
            Given("No personas in repository") {
                When("Get all personas") {
                    val personas = getAllPersonasService.getAll()
                    Then("Should return empty list") {
                        personas.size shouldBe 0
                    }
                }
            }
        }
    })

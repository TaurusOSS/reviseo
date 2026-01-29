package pl.taurus.reviseo.persona.application.domain.service

import io.kotest.core.spec.style.BehaviorSpec
import io.kotest.matchers.shouldBe
import pl.taurus.reviseo.persona.adapter.outgoing.test.PersonaTestAdapter
import pl.taurus.reviseo.persona.application.domain.model.persona
import java.util.UUID

class DeletePersonaServiceTest :
    BehaviorSpec({

        val personaTestAdapter = PersonaTestAdapter()

        val service = PersonaConfiguration().deletePersonaService(personaTestAdapter)

        afterContainer {
            personaTestAdapter.removeAllPersonas()
        }

        Context("Should delete persona") {
            Given("Existing persona") {
                val persona = persona {}
                personaTestAdapter.insert(persona)

                When("Persona is deleted") {
                    service.delete(persona.identifier.value)

                    Then("Persona should not exist") {
                        personaTestAdapter.findAll().isEmpty() shouldBe true
                    }
                }
            }

            Given("Multiple personas") {
                val persona1 = persona {}
                val persona2 = persona {}
                personaTestAdapter.insert(persona1)
                personaTestAdapter.insert(persona2)

                When("One persona is deleted") {
                    service.delete(persona1.identifier.value)

                    Then("Only the deleted persona should not exist") {
                        val remainingPersonas = personaTestAdapter.findAll()
                        remainingPersonas.size shouldBe 1
                        remainingPersonas[0].identifier shouldBe persona2.identifier
                    }
                }
            }
        }

        Context("Delete should be idempotent") {
            Given("No existing persona") {
                When("Persona is deleted") {
                    service.delete(UUID.randomUUID())

                    Then("Nothing should happen") {
                        personaTestAdapter.findAll().isEmpty() shouldBe true
                    }
                }
            }
        }
    })

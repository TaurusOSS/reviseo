package pl.taurus.reviseo.marketplace.adapter.incoming.web

import io.kotest.core.extensions.ApplyExtension
import io.kotest.core.spec.style.BehaviorSpec
import io.kotest.extensions.spring.SpringExtension
import io.kotest.matchers.shouldBe
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post
import pl.taurus.reviseo.marketplace.adapter.outgoing.h2.MarketplacePersonaRepository

@SpringBootTest
@ApplyExtension(SpringExtension::class)
@AutoConfigureMockMvc
internal class PersonaMarketplaceRestControllerModuleTest(
    mockMvc: MockMvc,
    marketplacePersonaRepository: MarketplacePersonaRepository,
) : BehaviorSpec({

        afterContainer { marketplacePersonaRepository.deleteAll() }

        Context("Should reload marketplace") {
            When("Request is sent") {
                val resultActions = mockMvc.post("/api/marketplace/personas/reload")

                Then("Marketplace is reloaded") {
                    resultActions.andExpect { status { isNoContent() } }

                    marketplacePersonaRepository.count() shouldBe 3
                    marketplacePersonaRepository.findAll().map { it.name } shouldBe
                        listOf("Software Architect", "Clean Code Expert", "Security Expert")
                }
            }
        }
    })

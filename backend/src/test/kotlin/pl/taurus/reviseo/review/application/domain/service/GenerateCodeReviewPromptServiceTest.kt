package pl.taurus.reviseo.review.application.domain.service

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.BehaviorSpec
import io.kotest.matchers.shouldBe
import io.mockk.every
import io.mockk.mockk
import pl.taurus.reviseo.persona.application.domain.model.persona
import pl.taurus.reviseo.persona.application.port.incoming.GetAllPersonasUseCase
import pl.taurus.reviseo.review.application.port.incoming.GenerateCodeReviewPromptUseCase
import pl.taurus.reviseo.testsupport.file.readFile
import java.util.UUID

class GenerateCodeReviewPromptServiceTest :
    BehaviorSpec({
        val getAllPersonasUseCase = mockk<GetAllPersonasUseCase>()
        val service = GenerateCodeReviewPromptService(getAllPersonasUseCase)

        given("a pull request url with 2 selected personas") {
            val persona1Id = UUID.randomUUID()
            val persona2Id = UUID.randomUUID()
            val persona1 =
                persona {
                    identifier = persona1Id
                    name = "Persona 1"
                    customInstructions = "Instructions for persona 1"
                    checklist = listOf("Item 1", "Item 2")
                }
            val persona2 =
                persona {
                    identifier = persona2Id
                    name = "Persona 2"
                    customInstructions = "Instructions for persona 2"
                    checklist = listOf("Item 3", "Item 4")
                }

            every { getAllPersonasUseCase.getAll() } returns listOf(persona1, persona2)

            `when`("generating a prompt") {
                val command =
                    GenerateCodeReviewPromptUseCase.Command(
                        pullRequestUrl = "https://github.com/test/pr/1",
                        personasIdentifiers = listOf(persona1Id, persona2Id),
                    )
                val result = service.generate(command)

                then("the prompt should match the expected content") {
                    result shouldBe readFile("testdata/review/expected_code_review_prompt.txt").replace("\r", "")
                }
            }
        }

        given("no personas found for identifiers") {
            val unknownId = UUID.randomUUID()
            every { getAllPersonasUseCase.getAll() } returns emptyList()

            `when`("generating a prompt") {
                val command =
                    GenerateCodeReviewPromptUseCase.Command(
                        pullRequestUrl = "https://github.com/test/pr/1",
                        personasIdentifiers = listOf(unknownId),
                    )

                then("it should throw an exception") {
                    val exception =
                        shouldThrow<IllegalArgumentException> {
                            service.generate(command)
                        }
                    exception.message shouldBe "No personas found for identifiers: [$unknownId]"
                }
            }
        }
    })

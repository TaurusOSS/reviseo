package pl.taurus.reviseo.review.application.domain.service

import org.springframework.stereotype.Service
import pl.taurus.reviseo.persona.application.port.incoming.GetAllPersonasUseCase
import pl.taurus.reviseo.review.application.port.incoming.GenerateCodeReviewPromptUseCase

@Service
class GenerateCodeReviewPromptService(
    private val getAllPersonasUseCase: GetAllPersonasUseCase,
    private val promptTemplateProvider: PromptTemplateProvider,
) : GenerateCodeReviewPromptUseCase {
    override fun generate(command: GenerateCodeReviewPromptUseCase.Command): String {
        val personas =
            getAllPersonasUseCase
                .getAll()
                .filter { it.identifier.value in command.personasIdentifiers }
                .toList()

        require(personas.isNotEmpty()) { "No personas found for identifiers: ${command.personasIdentifiers}" }

        return promptTemplateProvider.provide(
            "generic_code_review",
            mapOf(
                "pullRequestUrl" to command.pullRequestUrl,
                "personasSteps" to PersonasReviewStepsBuilder().addPersonas(personas).build(),
            ),
        )
    }
}

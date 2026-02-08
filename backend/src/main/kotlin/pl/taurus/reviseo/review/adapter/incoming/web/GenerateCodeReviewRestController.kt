package pl.taurus.reviseo.review.adapter.incoming.web

import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import pl.taurus.reviseo.review.application.port.incoming.GenerateCodeReviewPromptUseCase
import java.util.UUID

@RestController
class GenerateCodeReviewRestController(
    private val generateCodeReviewPromptUseCase: GenerateCodeReviewPromptUseCase,
) {
    @PostMapping("/api/reviews/prompt")
    fun generate(
        @RequestBody request: GenerateCodeReviewPromptRequest,
    ): GenerateCodeReviewPromptResponse {
        val command =
            GenerateCodeReviewPromptUseCase.Command(
                request.pullRequestUrl,
                request.personasIdentifiers,
            )

        val prompt = generateCodeReviewPromptUseCase.generate(command)

        return GenerateCodeReviewPromptResponse(prompt)
    }

    data class GenerateCodeReviewPromptRequest(
        val pullRequestUrl: String,
        val personasIdentifiers: List<UUID>,
    )

    data class GenerateCodeReviewPromptResponse(
        val prompt: String,
    )
}

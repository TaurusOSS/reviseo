package pl.taurus.reviseo.review.application.port.incoming

import java.util.UUID

fun interface GenerateCodeReviewPromptUseCase {
    fun generate(command: Command): String

    data class Command(
        val pullRequestUrl: String,
        val personasIdentifiers: List<UUID>,
    )
}

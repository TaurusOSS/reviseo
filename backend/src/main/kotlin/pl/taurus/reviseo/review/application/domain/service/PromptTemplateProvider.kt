package pl.taurus.reviseo.review.application.domain.service

import org.springframework.core.io.ResourceLoader
import org.springframework.stereotype.Component

@Component
class PromptTemplateProvider(
    private val resourceLoader: ResourceLoader,
) {
    fun provide(
        fileName: String,
        variables: Map<String, String>,
    ): String {
        var content = loadTemplate(fileName)

        for ((key, value) in variables) {
            content = content.replace("{{$key}}", value)
        }

        return content
    }

    private fun loadTemplate(fileName: String): String {
        val resource = resourceLoader.getResource("classpath:prompts/$fileName.md")
        return resource.inputStream.bufferedReader().use { it.readText() }
    }
}

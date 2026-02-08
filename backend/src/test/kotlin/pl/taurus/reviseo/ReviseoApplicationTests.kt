package pl.taurus.reviseo

import io.kotest.core.extensions.ApplyExtension
import io.kotest.core.spec.style.AnnotationSpec
import io.kotest.extensions.spring.SpringExtension
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

@SpringBootTest
@ActiveProfiles("test")
@ApplyExtension(SpringExtension::class)
class ReviseoApplicationTests : AnnotationSpec() {
    @Test
    fun contextLoads() {
    }
}

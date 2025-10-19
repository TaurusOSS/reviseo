package pl.taurus.reviseo

import io.kotest.core.extensions.ApplyExtension
import io.kotest.core.spec.style.AnnotationSpec
import io.kotest.extensions.spring.SpringExtension
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
@ApplyExtension(SpringExtension::class)
class ReviseoApplicationTests : AnnotationSpec() {
    @Test
    fun contextLoads() {
    }
}

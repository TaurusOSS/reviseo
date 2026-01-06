package pl.taurus.reviseo

import io.kotest.core.spec.style.ShouldSpec
import org.springframework.modulith.core.ApplicationModules
import org.springframework.modulith.docs.Documenter

class ModulithTest :
    ShouldSpec({

        should("have valid modules") {
            val applicationModules = ApplicationModules.of(ReviseoApplication::class.java)
            applicationModules.forEach { println(it) }
            applicationModules.verify()
        }

        should("document modules") {
            val applicationModules = ApplicationModules.of(ReviseoApplication::class.java)

            Documenter(applicationModules).writeModulesAsPlantUml()
        }
    })

package pl.taurus.reviseo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ReviseoApplication

fun main(args: Array<String>) {
    runApplication<ReviseoApplication>(*args)
}

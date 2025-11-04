package pl.taurus.reviseo.testsupport.file

fun readFile(fileName: String) = ClassLoader.getSystemResource(fileName).readText()

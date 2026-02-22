package pl.taurus.reviseo.review

import org.springframework.modulith.ApplicationModule

@ApplicationModule(allowedDependencies = ["persona :: api", "persona :: model"], displayName = "Code Review")
class ModuleMetadata

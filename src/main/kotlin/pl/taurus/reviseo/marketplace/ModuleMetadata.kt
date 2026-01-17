package pl.taurus.reviseo.marketplace

import org.springframework.modulith.ApplicationModule

@ApplicationModule(allowedDependencies = ["persona :: api"], displayName = "Persona Marketplace")
class ModuleMetadata

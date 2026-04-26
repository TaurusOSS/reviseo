import type { WebviewTab } from '../../WebviewTab';
import { getPersonasHtml } from './personasHtml';
import { getPersonaListScript } from './personaListScript';
import { getPersonaFormScript } from './personaFormScript';
import { getWizardScript } from './wizardScript';

export class PersonasTab implements WebviewTab {
    readonly id = 'personas';
    readonly label = 'Personas';

    html(): string {
        return getPersonasHtml();
    }

    script(): string {
        return [
            getPersonaListScript(),
            getPersonaFormScript(),
            getWizardScript(),
        ].join('\n\n');
    }
}

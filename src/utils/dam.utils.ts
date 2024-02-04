import { System } from "../models/dam/domainstory/Actor";
import { DomainStory } from "../models/dam/domainstory/DomainStory";


export const getSystemsFromDomainStory = (domainStory: DomainStory) => {
	return domainStory.actors.filter(actor => actor._class === 'io.github.dqualizer.dqlang.types.dam.domainstory.System') as System[];
}

export const getActivitiesForSystem = (domainStory: DomainStory, systemId?: string | null) => {
	return domainStory.activities.filter(activity => activity.initiators.find(initiator => initiator === systemId) || activity.targets.find(initiator => initiator === systemId))
}
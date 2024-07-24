import type { System } from "@/types/dam/domainstory/Actor";
import type { DomainStory } from "@/types/dam/domainstory/DomainStory";
import { WorkObjectType } from "@/types/dam/domainstory/WorkObjectType";

export const getSystemsFromDomainStory = (domainStory: DomainStory) => {
  return domainStory.actors.filter(
    (actor) => actor["@type"] === WorkObjectType.SYSTEM
  ) as System[];
};

export const getActivitiesForSystem = (
  domainStory: DomainStory,
  systemId?: string
) => {
  return domainStory.activities.filter(
    (activity) =>
      activity.initiators.find((initiator) => initiator === systemId) ||
      activity.targets.find((initiator) => initiator === systemId)
  );
};

export const getAllActivities = (domainStory: DomainStory) => {
  return domainStory.activities;
};

import { resourceById } from "../data/resources";
import { CRITICALITY_RANK, PROVIDERS } from "../types";
import type { Application, Criticality, Provider, Resource } from "../types";

export function applicationMembers(application: Application): Resource[] {
  return application.resourceIds.flatMap((id) => {
    const resource = resourceById.get(id);
    return resource ? [resource] : [];
  });
}

export function highestCriticality(
  members: Resource[],
): Criticality | undefined {
  return members.reduce<Criticality | undefined>(
    (highest, member) =>
      highest === undefined ||
      CRITICALITY_RANK[member.criticality] > CRITICALITY_RANK[highest]
        ? member.criticality
        : highest,
    undefined,
  );
}

export function usedProviders(members: Resource[]): Provider[] {
  return PROVIDERS.filter((provider) =>
    members.some((member) => member.provider === provider),
  );
}

export function missingMemberCount(application: Application): number {
  return application.resourceIds.filter((id) => !resourceById.has(id)).length;
}

export function totalOpenIssues(members: Resource[]): number {
  return members.reduce((total, member) => total + member.openIssues, 0);
}

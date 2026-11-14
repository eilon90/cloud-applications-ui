export const PROVIDERS = ["AWS", "GCP", "Azure"] as const;
export const ENVIRONMENTS = ["production", "staging", "development"] as const;
export const CRITICALITIES = ["low", "medium", "high", "critical"] as const;

export type Provider = (typeof PROVIDERS)[number];
export type Environment = (typeof ENVIRONMENTS)[number];
export type Criticality = (typeof CRITICALITIES)[number];

export interface Resource {
  id: string;
  name: string;
  /** Provider-specific resource type, e.g. "S3 Bucket", "IAM Role". */
  type: string;
  provider: Provider;
  region: string;
  environment: Environment;
  criticality: Criticality;
  owner: string;
  tags: string[];
  openIssues: number;
}

export interface Application {
  id: string;
  name: string;
  description?: string;
  resourceIds: string[];
}

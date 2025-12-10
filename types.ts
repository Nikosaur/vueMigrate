export interface MigrationResponse {
  migratedCode: string;
  explanation: string;
}

export enum MigrationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

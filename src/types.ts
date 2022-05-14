export interface AsyncHttpsResponse {
  statusCode: number;
  str: string;
}

export enum GrantType {
  Authorization = 'authorization_code',
  Refresh = 'refresh_token',
}

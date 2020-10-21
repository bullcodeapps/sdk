export enum UserLocationTypes {
  CREATE_REQUEST = '@user-location/CREATE_REQUEST',
}

export interface UserLocation {
  date: Date;
  latitude: number;
  longitude: number;
}

export interface PassengerProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  description: string;
  createdAt: string;
  nb_carpools_done: number;
  profile_picture: string;
}

export interface DriverProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  driver_id: number;
  description: string;
  createdAt: string;
  nb_carpools_done: number;
  profile_picture: string;
}

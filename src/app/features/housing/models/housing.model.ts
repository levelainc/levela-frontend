export interface HousingListing {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  images: string[]; // image URLs
  owner: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

export interface HousingCreatePayload {
  title: string;
  description: string;
  price: number;
  location: string;
  created_at: string;
  userType:string,
  customHouseType:string,
  houseType:string,
  nearbyHospitals:string[],
  nearbyPoliceStations:string[],
  nearbySchools:string [],
  max_ccupants:number,
  amenities:string[],
  additionalNote:string,
  images: File[];
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  created_at: string;
  user_type:string,
  custom_house_type:string,
  house_type:string,
  nearby_hospitals:string[],
  nearby_police_stations:string[],
  nearby_schools:string [],
  max_occupants:number,
  amenities:string[],
  additional_note:string
  images: {
    id: number;
    url: string;
  }[];
  current_occupants: number;
  is_open_for_roommates: boolean;
  listed_by_id: number;
  updated_at?: string | null;
}



export interface listingImages {
  id:number,
  url:string
}

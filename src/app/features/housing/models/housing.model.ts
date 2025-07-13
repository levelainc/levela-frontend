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
  city: string;
  images: File[];
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  created_at: string;
  images: {
    id: number;
    url: string;
  }[];
  current_occupants: number;
  max_occupants: number;
  is_open_for_roommates: boolean;
  listed_by_id: number;
  updated_at?: string | null;
}





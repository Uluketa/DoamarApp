export type DonationType = {
  id: number;
  name: string;
  description: string;
  has_limit: boolean;
  limit?: number | null;
  image_url: string;
  company_id: number;
  created_at: string;
  updated_at: string;
};

export type DonationHistoryType = {
  id: number;
  donation_id: number;
  company_id: number;
  client_id: number;
  created_at: string;
  updated_at: string;
};

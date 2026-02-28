export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          email: string | null;
          tokens: number;
        };
        Insert: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          tokens?: number;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          tokens?: number;
        };
      };
      token_purchases: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          stripe_payment_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          stripe_payment_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          stripe_payment_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};

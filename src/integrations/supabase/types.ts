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
          role: string;
          membership_id: string | null;
          membership_status: string;
          membership_tier: string;
          qr_code: string | null;
          payment_date: string | null;
          membership_expires: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          tokens?: number;
          role?: string;
          membership_id?: string | null;
          membership_status?: string;
          membership_tier?: string;
          qr_code?: string | null;
          payment_date?: string | null;
          membership_expires?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          tokens?: number;
          role?: string;
          membership_id?: string | null;
          membership_status?: string;
          membership_tier?: string;
          qr_code?: string | null;
          payment_date?: string | null;
          membership_expires?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      membership_payments: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          stripe_payment_id: string;
          membership_tier: string;
          created_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          stripe_payment_id: string;
          membership_tier?: string;
          created_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          stripe_payment_id?: string;
          membership_tier?: string;
          created_at?: string;
          status?: string;
        };
        Relationships: [];
      };
      token_purchases: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          stripe_payment_id: string;
          created_at: string;
          status: string;
          token_id: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          stripe_payment_id: string;
          created_at?: string;
          status?: string;
          token_id: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          stripe_payment_id?: string;
          created_at?: string;
          status?: string;
          token_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};

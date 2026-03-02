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
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          tokens?: number;
          role?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          tokens?: number;
          role?: string;
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

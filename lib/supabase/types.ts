export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          created_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          slug: string;
          name: string;
          price_inr: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          price_inr: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          price_inr?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      invitations: {
        Row: {
          id: string;
          owner_id: string;
          template_id: string | null;
          slug: string;
          status: 'draft' | 'published' | 'archived';
          couple_names: Json;
          wedding_date: string | null;
          events: Json;
          venue_name: string | null;
          venue_address: string | null;
          maps_url: string | null;
          photos: Json;
          music_choice: string | null;
          family_note: string | null;
          published_at: string | null;
          edit_window_ends_at: string | null;
          live_updates_used: number;
          extra_named_links: number;
          extra_live_updates: number;
          editing_locked: boolean;
          expiry_reminder_sent_at: string | null;
          rsvp_digest_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          template_id?: string | null;
          slug?: string;
          status?: 'draft' | 'published' | 'archived';
          couple_names?: Json;
          wedding_date?: string | null;
          events?: Json;
          venue_name?: string | null;
          venue_address?: string | null;
          maps_url?: string | null;
          photos?: Json;
          music_choice?: string | null;
          family_note?: string | null;
          published_at?: string | null;
          edit_window_ends_at?: string | null;
          live_updates_used?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          template_id?: string | null;
          slug?: string;
          status?: 'draft' | 'published' | 'archived';
          couple_names?: Json;
          wedding_date?: string | null;
          events?: Json;
          venue_name?: string | null;
          venue_address?: string | null;
          maps_url?: string | null;
          photos?: Json;
          music_choice?: string | null;
          family_note?: string | null;
          published_at?: string | null;
          edit_window_ends_at?: string | null;
          live_updates_used?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      invitation_drafts: {
        Row: {
          invitation_id: string;
          data: Json;
          updated_at: string;
        };
        Insert: {
          invitation_id: string;
          data?: Json;
          updated_at?: string;
        };
        Update: {
          invitation_id?: string;
          data?: Json;
          updated_at?: string;
        };
      };
      guests: {
        Row: {
          id: string;
          invitation_id: string;
          display_name: string;
          slug: string;
          max_party_size: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          display_name: string;
          slug?: string;
          max_party_size?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          invitation_id?: string;
          display_name?: string;
          slug?: string;
          max_party_size?: number;
          created_at?: string;
        };
      };
      rsvps: {
        Row: {
          id: string;
          invitation_id: string;
          guest_id: string | null;
          name: string;
          attending: boolean;
          party_size: number;
          events_attending: Json;
          meal_preference: string | null;
          message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          guest_id?: string | null;
          name: string;
          attending: boolean;
          party_size?: number;
          events_attending?: Json;
          meal_preference?: string | null;
          message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          invitation_id?: string;
          guest_id?: string | null;
          name?: string;
          attending?: boolean;
          party_size?: number;
          events_attending?: Json;
          meal_preference?: string | null;
          message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      views: {
        Row: {
          id: string;
          invitation_id: string;
          guest_id: string | null;
          device: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          guest_id?: string | null;
          device?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          invitation_id?: string;
          guest_id?: string | null;
          device?: string | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          owner_id: string;
          invitation_id: string | null;
          amount_inr: number;
          status: 'created' | 'paid' | 'failed';
          order_type: string;
          addon_quantity: number;
          admin_note: string | null;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          invitation_id?: string | null;
          amount_inr: number;
          status?: 'created' | 'paid' | 'failed';
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          invitation_id?: string | null;
          amount_inr?: number;
          status?: 'created' | 'paid' | 'failed';
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          created_at?: string;
        };
      };
    };
    Functions: {
      get_public_invitation: {
        Args: {
          p_slug: string;
          p_guest_slug?: string | null;
        };
        Returns: Json;
      };
      get_public_guest: {
        Args: {
          p_guest_slug: string;
        };
        Returns: Json;
      };
      submit_rsvp: {
        Args: {
          p_invitation_slug: string;
          p_name: string;
          p_attending: boolean;
          p_party_size?: number;
          p_message?: string | null;
          p_guest_slug?: string | null;
          p_events_attending?: Json;
          p_meal_preference?: string | null;
        };
        Returns: Json;
      };
      check_rsvp_rate_limit: {
        Args: {
          p_invitation_slug: string;
          p_ip_hash: string;
        };
        Returns: boolean;
      };
      track_view: {
        Args: {
          p_invitation_slug: string;
          p_device?: string;
          p_guest_slug?: string | null;
        };
        Returns: Json;
      };
      publish_invitation: {
        Args: {
          p_invitation_id: string;
        };
        Returns: Json;
      };
    };
  };
}

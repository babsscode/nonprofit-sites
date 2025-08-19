// supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database service functions
export const websiteService = {
  // Check if slug is unique
  async isSlugUnique(slug: string, excludeId: string | null = null): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('check_slug_unique', { 
        input_slug: slug,
        exclude_id: excludeId 
      })
    
    if (error) {
      console.error('Error checking slug uniqueness:', error)
      return false
    }
    
    return data
  },

  // Get user's websites
  async getUserWebsites(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching websites:', error)
      return []
    }

    return data || []
  },

  // Get a specific website by ID (for editing)
  async getWebsiteById(websiteId: string, userId: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .eq('id', websiteId)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching website:', error)
      return null
    }

    return data
  },

  // Get a published website by slug (for public viewing)
  async getPublishedWebsiteBySlug(slug: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error) {
      console.error('Error fetching published website:', error)
      return null
    }

    return data
  },

  // Save website (create or update)
  async saveWebsite(websiteData: any, userId: string, websiteId: string | null = null): Promise<any> {
    const payload = {
      user_id: userId,
      slug: websiteData.slug,
      org_name: websiteData.orgName,
      site_data: websiteData
    }

    if (websiteId) {
      // Update existing website
      const { data, error } = await supabase
        .from('websites')
        .update(payload)
        .eq('id', websiteId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating website:', error)
        throw error
      }

      return data
    } else {
      // Create new website
      const { data, error } = await supabase
        .from('websites')
        .insert([payload])
        .select()
        .single()

      if (error) {
        console.error('Error creating website:', error)
        throw error
      }

      return data
    }
  },

  // Publish website
  async publishWebsite(websiteId: string, userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('websites')
      .update({ is_published: true })
      .eq('id', websiteId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error publishing website:', error)
      throw error
    }

    return data
  },

  // Unpublish website
  async unpublishWebsite(websiteId: string, userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('websites')
      .update({ is_published: false })
      .eq('id', websiteId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error unpublishing website:', error)
      throw error
    }

    return data
  },

  // Delete website
  async deleteWebsite(websiteId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('websites')
      .delete()
      .eq('id', websiteId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting website:', error)
      throw error
    }

    return true
  }
}

// Auth helper functions
export const authService = {
  // Get current user
  async getCurrentUser(): Promise<any | null> {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting current user:', error)
      return null
    }
    
    return user
  },

  // Sign in with email/password
  async signInWithEmail(email: string, password: string): Promise<any> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Error signing in:', error)
      throw error
    }

    return data
  },

  // Sign up with email/password
  async signUpWithEmail(email: string, password: string): Promise<any> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      console.error('Error signing up:', error)
      throw error
    }

    return data
  },

  // Sign out
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: any, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}
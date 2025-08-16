# Supabase Setup Guide

## Configuration Steps

### 1. Supabase Dashboard Configuration

To disable email confirmation and enable password-only authentication:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings**
3. Under **Email Auth**, disable the following options:
   - ✅ **Enable email confirmations** (turn this OFF)
   - ✅ **Enable secure email change** (turn this OFF)

### 2. Environment Variables

Make sure you have the following environment variables in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Schema (Optional)

If you want to store additional user data, you can create a `profiles` table:

```sql
-- Create a profiles table to store additional user information
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create a trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4. Testing the Authentication

1. Start your development server: `npm run dev`
2. Navigate to `/auth`
3. Try signing up with a new email and password
4. You should be automatically logged in and redirected to the main app
5. Try logging out and logging back in with the same credentials

### 5. Security Considerations

- Email confirmation is disabled, so users can sign up with any email
- Consider implementing additional validation if needed
- The user's full name is stored in the user metadata
- Passwords are securely hashed by Supabase

### 6. Troubleshooting

If you encounter issues:

1. Check that your environment variables are correctly set
2. Verify that email confirmation is disabled in Supabase dashboard
3. Check the browser console for any error messages
4. Ensure your Supabase project is active and not paused

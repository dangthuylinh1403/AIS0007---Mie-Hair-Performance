# Mie Hair Performance - Stylist Performance Calendar

This document provides features and setup instructions for the Mie Hair Performance application.

## 📖 Project Overview

Mie Hair Performance is a modern, elegant internal tool designed for managing stylist performance through an intuitive, calendar-based interface. It focuses on a smooth user experience, automated time tracking, and clear data presentation, with a dedicated dashboard for managers.

## ✨ Key Features

*   **Calendar-Based Performance**: A central, interactive calendar for stylists to view and track their daily work hours.
*   **Automated Shift Tracking**: Stylists can start and stop their shifts with a single click. The system automatically records the timestamps in a Supabase database.
*   **Manual Time Entry**: Stylists can manually add or edit their past time entries, for example, if they forgot to clock in or out.
*   **Daily Notes & Attachments**: Users can add text notes and upload files (images, documents) to any day on the calendar to provide context for their work.
*   **Live Shift Timer**: A running clock displays the duration of the active shift, providing real-time feedback.
*   **Monthly Navigation & Summary**: Easily switch between months to review past performance. A summary panel shows key statistics like total hours, workdays, and shifts for the month.
*   **Visual Data Overview**: A bar chart visually represents the hours worked each day of the month, providing an at-a-glance overview of productivity.
*   **Comprehensive Manager Dashboard**:
    *   A separate view for users with an 'admin' role.
    *   View a list of all stylists and select any stylist to manage their timesheet.
    *   Full CRUD (Create, Read, Update, Delete) functionality for time entries for any stylist.
    *   Includes a monthly summary and chart for the selected stylist.
*   **Secure Authentication & Authorization**: Powered by Supabase Auth with Row Level Security (RLS) to ensure users can only access their own data, while managers have full access.
*   **Customizable UI**: Switch between Light/Dark modes with a beautiful, feminine color theme.
*   **Multi-language Support**: English, Vietnamese (Tiếng Việt), and Thai (ไทย).
*   **Responsive Design**: A fully responsive layout for all screen sizes.
*   **In-App User Guide**: A comprehensive guide available directly within the application.

## 💻 Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **Backend**: Supabase (Database, Auth, Storage, RLS)
-   **State Management**: React Context API & Component State

---

## 🛠️ Setup Instructions

To get the application running with your own Supabase backend, follow these steps.

### 1. Create a Supabase Project

1.  Go to [supabase.com](https://supabase.com/) and sign in.
2.  Create a new project. Save your **Project URL** and **anon key**.

### 2. Database Schema Setup

Go to the **SQL Editor** in your Supabase project dashboard and run the following scripts one by one.

**Script 1: Roles and Helper Function**
This sets up a `user_role` type and a function to check if the current user is an admin, which is crucial for security policies.

```sql
-- Create a user_role type for 'admin' and 'employee'
CREATE TYPE public.user_role AS ENUM ('employee', 'admin');

-- Create a helper function to check for admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;
```

**Script 2: Profiles Table**
This table stores user profile information like full name, avatar, and role.

```sql
-- Create the profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at timestamptz,
  full_name text,
  avatar_url text,
  role public.user_role NOT NULL DEFAULT 'employee'
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
CREATE POLICY "Users can view their own profile." ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles." ON public.profiles
  FOR ALL USING (public.is_admin());
```

**Script 2.1: Auto-Create User Profile (Crucial for Sign-ups!)**
This database trigger automatically creates a profile entry for every new user who signs up. **This fixes "violates row-level security policy" errors for new users.**

```sql
-- Function to create a public.profile for a new user.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;

-- Trigger to run the function after a new user is created.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

**Script 3: Time Entries Table**
This table stores all the clock-in/clock-out records.

```sql
-- Create the time_entries table
CREATE TABLE public.time_entries (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

-- Policies for time_entries table
CREATE POLICY "Users can manage their own time entries." ON public.time_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all time entries." ON public.time_entries
  FOR ALL USING (public.is_admin());
```

**Script 4: Daily Notes Table**
This table stores the daily notes and attachment URLs.

```sql
-- Create the daily_notes table
CREATE TABLE public.daily_notes (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  note text,
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, date)
);

-- Enable RLS
ALTER TABLE public.daily_notes ENABLE ROW LEVEL SECURITY;

-- Policies for daily_notes table (More specific policies to fix insert errors)
CREATE POLICY "Users can view their own daily notes."
  ON public.daily_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily notes."
  ON public.daily_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily notes."
  ON public.daily_notes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily notes."
  ON public.daily_notes FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all daily notes."
  ON public.daily_notes FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
```

### 3. Storage Setup

1.  Go to the **Storage** section in your Supabase dashboard.
2.  Create a new bucket named `avatars`. **Make it a Public bucket.**
3.  Create another new bucket named `daily_attachments`. **Make it a Public bucket.**

### 4. Storage Policies (RLS)

Go back to the **SQL Editor** and run these scripts to secure your storage buckets. **This step is crucial to fix file upload errors.**

**Script 5: Avatars Bucket Policies**

```sql
-- Public can view all avatars (since bucket is public)
CREATE POLICY "Public can view avatars." ON storage.objects
  FOR SELECT USING ( bucket_id = 'avatars' );

-- Users can manage their own avatar folder.
CREATE POLICY "Users can manage their own avatar folder." ON storage.objects
  FOR ALL USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] )
  WITH CHECK ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );
  
-- Admins can manage everything in the avatars bucket.
CREATE POLICY "Admins can manage all avatars." ON storage.objects
  FOR ALL USING ( public.is_admin() ) WITH CHECK ( public.is_admin() );
```

**Script 6: Attachments Bucket Policies**

```sql
-- Public can view all attachments (since bucket is public)
CREATE POLICY "Public can view attachments." ON storage.objects
  FOR SELECT USING ( bucket_id = 'daily_attachments' );
  
-- Users can manage their own attachments folder.
CREATE POLICY "Users can manage their own attachments folder." ON storage.objects
  FOR ALL USING ( bucket_id = 'daily_attachments' AND auth.uid()::text = (storage.foldername(name))[1] )
  WITH CHECK ( bucket_id = 'daily_attachments' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Admins can manage everything in the attachments bucket.
CREATE POLICY "Admins can manage all attachments." ON storage.objects
  FOR ALL USING ( public.is_admin() ) WITH CHECK ( public.is_admin() );
```

### 5. Connect Your Project

Finally, open the `lib/supabase.ts` file in the editor and replace the placeholder credentials with your own **Project URL** and **anon key**.

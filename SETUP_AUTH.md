
# Destinique Auth Setup

This document describes how to set up the authentication data for the Destinique application.

## Prerequisites
- Supabase Project URL and Anon Key (configured in `src/lib/customSupabaseClient.js`)
- Node.js environment (v20+)

## 1. Database Setup
The application uses a `users` table in the `public` schema that links to `auth.users`.
The migration has been automatically applied.

Table Schema:
- `id`: UUID (Primary Key, Foreign Key to auth.users)
- `email`: TEXT (Unique)
- `profile_id`: UUID (Foreign Key to public.profiles)
- `psychological_score`: INTEGER
- `systemic_score`: INTEGER
- `full_name`: TEXT
- `birth_date`: DATE

## 2. Seeding Auth Users
Since creating Auth users requires Admin privileges which are restricted in the client-side environment:

1. A seed utility is provided at `src/utils/seedAuthProfiles.js`.
2. This utility generates a list of credentials based on the sample profiles in the database.
3. **IMPORTANT**: To actually create these users, you would typically run a backend script using `@supabase/supabase-js` with the `SERVICE_ROLE_KEY`.

### Generated Credentials Format
If you were to create these manually or via script:

- **Email Pattern**: `[firstname][lastname]@destiniqueapp.com` (lowercase, no special chars)
- **Password Pattern**: `Profile_[Name]_2026!`

### Test Credentials
You can use the SignUp page (`/signup`) to create a new user for testing immediately.

Example credentials that *would* be generated for sample profiles (mock):

| Name | Email | Password |
|------|-------|----------|
| Wang Fang | wangfang@destiniqueapp.com | Profile_WangFang_2026! |
| Li Na | lina@destiniqueapp.com | Profile_LiNa_2026! |
| Zhang Wei | zhangwei@destiniqueapp.com | Profile_ZhangWei_2026! |

## 3. Running the App
1. `npm install`
2. `npm run dev`
3. Navigate to `/signup` to create your first account.

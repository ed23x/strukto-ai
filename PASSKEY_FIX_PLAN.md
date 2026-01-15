# Struckto AI - Passkey Authentication Fix

## Issues to Fix

1. **GitHub Authentication Issue**: Passkey authentication not working with current setup
2. **Autosave Logic**: Some parts need refinement for better UX
3. **Code Cleanup**: Remove unused code and improve structure

## Solution Plan

### 1. Authentication Method Choice
Since passkey authentication requires additional setup and GitHub token management, let's implement a simpler passwordless authentication that works immediately without extra configuration.

### 2. Improved Flow
- Keep Stack Auth for now
- Add email/password as backup option
- Allow users to choose authentication method

### 3. Code Changes Required
- Fix middleware logic
- Update authentication components
- Add GitHub OAuth option
- Improve error handling

## Files to Modify

### Authentication Components
- `src/components/auth/UserProfile.tsx` - Add auth method selection
- `src/components/auth/ProtectedRoute.tsx` - Remove passkey-specific logic

### Pages
- `src/app/sign-in/page.tsx` - New sign-in page with multiple methods
- `src/app/dashboard/page.tsx` - Update to handle multiple auth methods
- `src/app/profile/page.tsx` - Same as dashboard

### Configuration
- Update middleware for flexible auth
- Update `src/middleware.ts`

Would you like me to proceed with implementing these fixes?
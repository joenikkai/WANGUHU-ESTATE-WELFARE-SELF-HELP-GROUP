    1 # Implementation Plan: Social Login & Passkeys Integration
    2
    3 ## Objective
    4 Enhance the security and accessibility of the WEWSHG platform by integrating social logins (Google, Microsoft,
      Facebook) and implementing Passkeys (WebAuthn) as a primary or secondary authentication factor (MFA).
    5
    6 ## Proposed Changes
    7
    8 ### 1. Database Schema Updates
    9 Add two new tables to support the new authentication methods:
   10 - `social_accounts`: Maps system `users` to their social identities (e.g., Google `sub`, Facebook `id`).
   11 - `passkeys`: Stores WebAuthn credentials (credential ID, public key, counter, user agent, etc.) for each user.
   12
   13 ### 2. Backend Enhancements
   14 - **Social Auth**: Integrate `passport.js` with strategies for Google, Microsoft, and Facebook.
   15 - **Passkeys**: Implement WebAuthn registration and authentication flows using `@simplewebauthn/server`.
   16 - **JWT Update**: Ensure JWTs can be issued for users logging in via social or passkeys.
   17
   18 ### 3. Frontend Enhancements
   19 - **Login/Signup (`Access.tsx`)**: 
   20     - Add "Continue with Google/Microsoft/Facebook" buttons.
   21     - If a user signs up via social, redirect them to a "Complete Identity" step to capture the mandatory Kenyan
      ID and KRA PIN (as per the "Identity First" mandate).
   22 - **Profile Management (`EditProfileModal.tsx`)**:
   23     - Add a "Security & Linked Accounts" section.
   24     - List linked social accounts and allow unlinking.
   25     - Add "Register Passkey" button and list existing passkeys.
   26 - **Auth Context (`AuthContext.tsx`)**:
   27     - Add methods for social login and passkey registration/authentication.
   28
   29 ### 4. Security & Lifecycle
   30 - **Social Login Flow (Immediate Creation)**: Social login will immediately create a `persons` and `users`
      record using available data (Email, Name). However, the user will be restricted to a "Pending Verification"
      state until they provide mandatory Kenyan identity details (National ID, KRA PIN, Phone, Address).
   31 - **Mandatory Passkeys**: Passkey registration will be a REQUIRED step during the initial account setup or the
      first time a social user completes their identity profile. Passkeys will serve as the primary MFA mechanism for
      all sensitive actions and logins.
   32 - **Identity Verification**: The system MUST still verify the `persons` identity (National ID, KRA PIN) before
      granting full access to financial and communal features.
   33
   34 ## Verification & Testing
   35 - **Social Login**: Verify that users can sign in with different providers and that accounts are correctly
      linked/created.
   36 - **Passkeys**: Verify registration and login across different browsers/devices.
   37 - **Edge Cases**: Handle cases where a social email already exists in the system (account linking).

  Does this detailed plan look good to you? Once you confirm, I will proceed to formal approval and implementation.

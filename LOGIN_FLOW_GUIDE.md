# Professional Login Flow Guide

## Overview
This document outlines the complete authentication flow for the Health Vault Dashboard application using Axios and TanStack Query.

---

## Architecture

### 1. **Authentication Context** (`AuthContext.ts`)
Central state management for authentication:
- `user`: Current user data (id, email, role, profileId)
- `token`: JWT access token
- `login()`: Store user and token
- `logout()`: Clear all auth data
- `isAuthenticated`: Boolean flag for protected routes

### 2. **Auth Provider** (`AuthProvider.tsx`)
Initializes authentication on app load:
- Checks localStorage for existing token on mount
- Validates token expiration using `jwtDecode`
- Restores user session if token is valid
- Provides loading state to prevent UI flashing

### 3. **Login Mutation** (`useLogin.ts`)
TanStack Query mutation for login:
- Sends credentials to `/auth/login` endpoint
- Decodes JWT token from response
- Stores token in localStorage, sessionStorage, and cookies
- Extracts user data from token claims
- Automatically redirects to `/dashboard` on success

### 4. **Logout Hook** (`useLogout.ts`)
Handles logout with TanStack Query:
- Clears all authentication state
- Removes token from storage and cookies
- Redirects to login page
- Continues logout even if API call fails

### 5. **Axios Interceptors**
Two axios instances handle different scenarios:

#### Public Instance (`axiosInstancePublic.ts`)
- Used for login/signup endpoints
- Adds bearer token to Authorization header if available
- Handles 401 errors by redirecting to login

#### Secure Instance (`useAxiosInstanceSecure.ts`)
- For authenticated API calls
- Automatically attaches JWT token
- Logs out user on 401/403 errors
- Cleans up interceptors to prevent memory leaks

---

## Login Flow (Step by Step)

1. **User fills login form** → Email + Password
2. **Submit button clicked** → `handleSubmit()` validates inputs
3. **TanStack Query mutation fires** → `loginMutation()`
4. **API request sent** → POST to `/auth/login`
5. **Response received** with JWT token:
   ```json
   {
     "success": true,
     "message": "Login successful",
     "data": {
       "accessToken": "eyJhbGciOiJIUzI1NiIs..."
     }
   }
   ```
6. **Token is decoded** → Extract user data (id, email, role, profileId)
7. **Token stored** in:
   - localStorage (persistent)
   - Cookies (for API requests)
8. **User state updated** → AuthContext.login()
9. **Redirect to dashboard** → `/dashboard` (replace: true)
10. **ProtectedRoute validates** → Checks token and user exist
11. **Dashboard displays** with user information

---

## Logout Flow (Step by Step)

1. **User clicks logout button** → `handleLogout()`
2. **TanStack Query mutation fires** → `useLogout()`
3. **API cleanup** (if endpoint exists)
4. **onSuccess callback**:
   - `logout()` clears auth state
   - Token removed from localStorage
   - Token removed from cookies
   - User object cleared
5. **Redirect to login** → `/login` (replace: true)

---

## Protected Routes

The `ProtectedRoute` component validates:
- ✅ User exists in context
- ✅ Token exists in context
- ✅ Redirects to login if either is missing

```typescript
const { isAuthenticated, token } = useAuth();

if (!isAuthenticated || !token) {
  return <Navigate to="/login" replace />;
}
```

---

## Token Management

### Storage Locations
- **localStorage**: Persistent across sessions
- **Cookies**: Sent with API requests automatically
- **Memory**: Stored in AuthContext

### Token Validation
- Automatically decoded when stored
- Expiration checked on app load
- Invalid/expired tokens trigger logout

### Token Expiration Handler
- 401/403 responses trigger immediate logout
- User redirected to login page
- All stored tokens cleared

---

## API Interceptor Details

### Request Interceptor
Automatically adds Authorization header:
```typescript
config.headers.Authorization = `Bearer ${token}`;
```

### Response Interceptor
Handles authentication errors:
```typescript
if (status === 401 || status === 403) {
  logout();
  navigate("/login");
}
```

---

## Security Features

✅ **JWT Token Storage**: Tokens stored securely  
✅ **Token Expiration**: Automatic logout on expiration  
✅ **Protected Routes**: Only authenticated users access dashboard  
✅ **Automatic Interceptors**: Token attached to all requests  
✅ **Cleanup on Logout**: All traces removed from storage  
✅ **HTTPS Ready**: withCredentials enabled  
✅ **SameSite Cookies**: Secure cookie settings  

---

## Usage Examples

### Using useLogin Hook
```typescript
const { mutate: login, isPending, error } = useLogin();

const handleSubmit = (e) => {
  e.preventDefault();
  login({ email, password });
};
```

### Using useLogout Hook
```typescript
const { mutate: logout, isPending } = useLogout();

const handleLogout = () => {
  logout();
};
```

### Using useAuth Hook
```typescript
const { user, token, isAuthenticated, logout } = useAuth();

if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

### Using Secure Axios Instance
```typescript
const axiosSecure = useAxiosInstanceSecure();

const fetchUserData = async () => {
  const response = await axiosSecure.get('/user/profile');
  return response.data;
};
```

---

## API Response Format

### Login Success
```json
{
  "success": true,
  "message": "Login successful",
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### JWT Token Payload
```json
{
  "id": "user_id_here",
  "profileId": "profile_id_here",
  "email": "user@example.com",
  "role": "NORMALUSER",
  "iat": 1765452219,
  "exp": 1765455819
}
```

---

## File Structure

```
src/
├── api/
│   ├── axiosInstancePublic.ts      (Public axios instance)
│   ├── useAxiosInstanceSecure.ts   (Secure axios hook)
│   ├── queryClient.ts              (TanStack Query setup)
│   └── useAxiosInstance.ts         (Hook wrapper)
├── providers/
│   ├── AuthContext.ts              (Context definition)
│   ├── AuthProvider.tsx            (Provider component)
│   └── useAuth.ts                  (useAuth hook)
├── queries/
│   └── auth/
│       ├── useLogin.ts             (Login mutation)
│       └── useLogout.ts            (Logout mutation)
├── components/
│   └── ProtectedRoute.tsx          (Route guard)
├── page/
│   ├── Login/
│   │   └── Login.tsx               (Login form)
│   └── Dashboard/
│       └── Dashboard.jsx           (Protected dashboard)
└── routes/
    └── index.tsx                   (Route definitions)
```

---

## Testing Checklist

- [ ] Login with valid credentials → Redirects to dashboard
- [ ] Token stored in localStorage
- [ ] Token stored in cookies
- [ ] JWT decoded correctly
- [ ] User data populated from token
- [ ] Invalid credentials show error message
- [ ] Logout button clears all tokens
- [ ] Logout redirects to login page
- [ ] Direct navigation to `/dashboard` without token → Redirects to login
- [ ] Token expiration triggers logout
- [ ] 401 response triggers automatic logout
- [ ] Page refresh maintains session if token valid
- [ ] Page refresh redirects to login if token invalid

---

## Troubleshooting

### Login redirects to login instead of dashboard
- Check token is being decoded correctly
- Verify JWT payload structure matches DecodedToken interface
- Check localStorage is being set

### Protected route not working
- Ensure ProtectedRoute wraps the dashboard component
- Check isAuthenticated boolean returns correct value
- Verify token exists in context

### 401 errors after login
- Check Authorization header format: `Bearer {token}`
- Verify token is not expired
- Check API endpoint requires authentication

### Logout doesn't work
- Verify useLogout hook is imported and used correctly
- Check localStorage.removeItem() is called
- Verify document.cookie is set correctly

---

## Dependencies

- `@tanstack/react-query`: For mutations and server state
- `axios`: HTTP client with interceptors
- `jwt-decode`: Decode JWT tokens
- `react-router`: Client-side routing
- React: UI framework

---

## Next Steps

1. Test the complete login/logout flow
2. Add "Remember Password" functionality using localStorage
3. Implement refresh token rotation (optional)
4. Add password reset flow
5. Implement 2FA if needed
6. Add user profile management endpoints

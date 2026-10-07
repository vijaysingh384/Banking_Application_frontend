# Technical Design Document

## Overview

This document provides the technical design for integrating a React banking application frontend with an existing Spring Boot backend API. The integration adds complete UI/UX coverage for user management, account operations, transactions, and loan services while maintaining consistency with existing frontend patterns.

### Goals

1. **Complete Backend Integration**: Connect React frontend to all Spring Boot REST API endpoints
2. **Consistent State Management**: Implement Redux slices for accounts and loans following existing patterns
3. **Unified UI/UX**: Create Users and Loans pages consistent with existing design system
4. **Error Handling**: Implement comprehensive error handling and user feedback
5. **Maintainability**: Follow existing architectural patterns for long-term maintainability

### Non-Goals

1. Backend API modifications or enhancements
2. Authentication mechanism changes (JWT token management already exists)
3. New design system components (use existing Tailwind CSS patterns)
4. Real-time features (WebSocket integration)
5. Offline functionality or PWA capabilities

### Assumptions

1. Spring Boot backend API is operational and follows RESTful conventions
2. JWT authentication is already implemented and working
3. Environment variable `REACT_APP_IOBANK_SERVER_API_URL` is configured correctly
4. Users have modern browsers with ES6+ support
5. Backend API returns consistent JSON response formats

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │    Pages     │  │  Components  │  │    Routing   │    │
│  │              │  │              │  │              │    │
│  │ - Users      │  │ - Forms      │  │ React Router │    │
│  │ - Loans      │  │ - Tables     │  │              │    │
│  │ - Accounts   │  │ - Modals     │  │              │    │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘    │
│         │                  │                               │
│         └──────────┬───────┘                               │
│                    │                                       │
│         ┌──────────▼─────────────┐                        │
│         │   Redux Store          │                        │
│         │                      │                        │
│         │  - userSlice        │                        │
│         │  - accountSlice     │  (NEW)                 │
│         │  - transactionSlice │                        │
│         │  - loanSlice        │  (NEW)                 │
│         │  - cardSlice        │                        │
│         │  - pageSlice        │                        │
│         └──────────┬───────────┘                        │
│                    │                                     │
│         ┌──────────▼───────────┐                        │
│         │   API Client Layer   │                        │
│         │                      │                        │
│         │  - axios instance    │                        │
│         │  - base URL config   │                        │
│         │  - auth headers      │                        │
│         └──────────┬───────────┘                        │
└────────────────────┼─────────────────────────────────────┘
                     │
                     │ HTTP/REST
                     │
┌────────────────────▼─────────────────────────────────────┐
│              Spring Boot Backend API                     │
│                                                          │
│  Endpoints:                                              │
│  - POST   /user/register                                 │
│  - POST   /user/auth                                     │
│  - GET    /user/all                                      │
│  - GET    /user/{id}                                     │
│  - GET    /account/all                                   │
│  - POST   /account/create                                │
│  - GET    /account/{id}                                  │
│  - POST   /account/{id}/deposit                          │
│  - POST   /account/{id}/withdraw                         │
│  - POST   /loan/create                                   │
│  - GET    /loan/all                                      │
│  - GET    /transactions?page={n}                         │
└──────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── Router
│   ├── Login
│   ├── Register
│   ├── RegisterSuccessful
│   └── Dashboard (Protected)
│       ├── Header
│       ├── NavBar
│       │   ├── Home
│       │   ├── Account
│       │   ├── Transactions
│       │   ├── Users (NEW)
│       │   ├── Loans (NEW)
│       │   └── Profile
│       └── Content Area
│           ├── Home
│           ├── Account
│           │   ├── AccountDetails
│           │   ├── NewAccount (Modal)
│           │   └── Withdraw (Modal)
│           ├── Transaction
│           ├── Users (NEW)
│           │   ├── UserList
│           │   └── UserDetail (Modal)
│           ├── Loans (NEW)
│           │   ├── LoanList
│           │   └── LoanApplicationForm (Modal)
│           ├── Payment
│           └── Profile
```

### Redux State Management Architecture


#### Redux Store Structure

```javascript
{
  user: {
    user: {...},        // From sessionStorage
    status: 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED',
    error: null
  },
  accounts: {           // NEW
    accounts: [],
    status: 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED',
    error: null
  },
  transactions: {
    transactions: [],
    status: 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED'
  },
  loans: {              // NEW
    loans: [],
    status: 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED',
    error: null
  },
  cards: {
    card: {...},
    transactions: [],
    status: 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED'
  },
  pages: {
    // UI state management
  }
}
```

#### Slice Patterns

All slices follow this consistent pattern:

1. **Initial State**: Contains data array/object, status enum, and optional error field
2. **Async Thunks**: Created with `createAsyncThunk` for API calls
3. **Reducers**: Synchronous state updates (optional)
4. **Extra Reducers**: Handle async thunk lifecycle (pending, fulfilled, rejected)
5. **Selectors**: Export functions to access state
6. **Authorization**: Include JWT token from sessionStorage in API calls


### Data Flow Diagrams

#### User Management Flow

```
User Action → Component Event Handler → Redux Thunk → API Client
                                                           ↓
                                                      Backend API
                                                           ↓
                                                       Response
                                                           ↓
Redux State Update ← Extra Reducer ← Thunk Result ←──────┘
     ↓
Component Re-render (useSelector)
     ↓
UI Update (success/error notification)
```

#### Account Operations Flow

```
1. Fetch Accounts (on Dashboard load):
   Dashboard mount → dispatch(fetchAccounts) → GET /account/all
   → accountSlice.fulfilled → update state.accounts → re-render

2. Create Account:
   User fills form → validation → dispatch(createAccount) 
   → POST /account/create → accountSlice.fulfilled 
   → dispatch(fetchAccounts) → close modal → show success

3. Deposit/Withdraw:
   User fills form → validation → dispatch(depositFunds/withdrawFunds)
   → POST /account/{id}/deposit or /withdraw
   → transactionSlice update → accountSlice update → refresh UI
```

#### Loan Application Flow

```
User clicks "Apply for Loan" → Modal opens → User fills form
→ Validation → dispatch(createLoan) → POST /loan/create
→ loanSlice.pending (show spinner) → Response
→ loanSlice.fulfilled (success) or rejected (error)
→ Close modal → Refresh loan list → Show notification
```


### API Integration Patterns

#### Authorization Pattern

All authenticated requests follow this pattern:

```javascript
const headers = {
  Authorization: `${sessionStorage.getItem('access_token')}`
}
const { data, error } = await api.get('/endpoint', headers)
```

#### Error Handling Pattern

```javascript
try {
  const { data, error, headers } = await api.post('/endpoint', payload, headers)
  if (error) throw error
  return data
} catch (err) {
  console.error(err.message)
  throw err  // Let Redux handle via rejected action
}
```

#### 401 Unauthorized Handling

When API returns 401:
1. Clear sessionStorage
2. Dispatch logout action
3. Redirect to `/login`
4. Display "Session expired" message

## Components and Interfaces

### New Components

#### 1. Users Page (`/src/pages/dashboard/Users.js`)

**Purpose**: Display and manage all registered users

**Props**: None (uses Redux state)

**State**:
- `selectedUser`: User object for detail modal (or null)
- `showUserDetail`: Boolean for modal visibility

**Key Functions**:
- `useEffect`: Dispatch `fetchAllUsers()` on mount
- `handleUserClick(user)`: Set selected user and open modal
- `handleCloseModal()`: Clear selected user and close modal

**Rendering**:
```jsx
<SectionContainer>
  {status === 'PENDING' && <Spinner />}
  {status === 'FAILED' && <ErrorMessage />}
  {status === 'SUCCESS' && (
    <UserTable users={users} onUserClick={handleUserClick} />
  )}
</SectionContainer>
{showUserDetail && <UserDetailModal user={selectedUser} onClose={handleCloseModal} />}
```

#### 2. UserDetailModal Component (`/src/components/users/UserDetailModal.js`)

**Purpose**: Display detailed user information in modal

**Props**:
- `user`: User object
- `onClose`: Function to close modal

**Layout**:
- User ID
- Username
- Email
- First Name
- Last Name
- Registration Date
- Status (Active/Inactive)
- Close button (X icon)

**Styling**: Follow existing Withdraw modal pattern with Tailwind CSS

#### 3. Loans Page (`/src/pages/dashboard/Loans.js`)

**Purpose**: Display loan history and provide loan application form

**Props**: None (uses Redux state)

**State**:
- `showLoanForm`: Boolean for modal visibility

**Key Functions**:
- `useEffect`: Dispatch `fetchLoans()` on mount
- `handleShowForm()`: Open loan application modal
- `handleCloseForm()`: Close modal

**Rendering**:
```jsx
<SectionContainer>
  <div className="header">
    <p>My Loans ({loans.length})</p>
    <button onClick={handleShowForm}>Apply for Loan</button>
  </div>
  {status === 'PENDING' && <Spinner />}
  {status === 'SUCCESS' && <LoanList loans={loans} />}
</SectionContainer>
{showLoanForm && <LoanApplicationForm onClose={handleCloseForm} />}
```

#### 4. LoanApplicationForm Component (`/src/components/loans/LoanApplicationForm.js`)

**Purpose**: Modal form for loan application

**Props**:
- `onClose`: Function to close modal

**State**:
- `loanDetails`: { amount: '', term: '', purpose: '' }
- `errors`: { amount: '', term: '' }

**Validation Rules**:
- Amount: Required, positive number, minimum 1000
- Term: Required, positive integer, between 1-30 years
- Purpose: Optional text field

**Key Functions**:
- `handleInputChange(e)`: Update form state
- `validateForm()`: Return boolean after validation
- `handleSubmit()`: Validate and dispatch `createLoan(loanDetails)`

**Styling**: Follow Withdraw/NewAccount modal patterns


#### 5. DepositForm Component (`/src/components/account/Deposit.js`)

**Purpose**: Modal form for depositing funds

**Props**:
- `setShowDepositForm`: Function to close modal

**State**:
- `depositInfo`: { accountId: '', amount: '', code: 'USD' }
- `selectedAccount`: Account object

**Key Functions**:
- `handleInputChange(e)`: Update form state and selected account
- `handleDeposit()`: Validate amount > 0, dispatch `depositFunds(depositInfo)`

**Styling**: Mirror Withdraw component structure

#### 6. Enhanced NavBar Component

**Updates Required**:
- Add "Users" navigation link (route: `/dashboard/users`)
- Add "Loans" navigation link (route: `/dashboard/loans`)
- Maintain existing styling and active state logic

### Existing Components to Update

#### Dashboard Component

**Update**: Add routes for new pages

```javascript
<Route path="users" element={<Users />} />
<Route path="loans" element={<Loans />} />
```

#### Account Page Updates

**Enhancement**: Add Deposit button alongside existing Withdraw button

```jsx
<button onClick={() => setShowDepositForm(true)}>Deposit</button>
<button onClick={() => setShowWithdrawForm(true)}>Withdraw</button>
```


## Data Models

### Frontend Data Models

#### User Entity

```javascript
{
  id: number,
  username: string,
  email: string,
  firstName: string,
  lastName: string,
  registrationDate: string,  // ISO 8601 format
  status: 'ACTIVE' | 'INACTIVE'
}
```

#### Account Entity

```javascript
{
  id: number,
  accountNumber: string,      // 10 digits
  accountName: string,
  balance: number,
  code: string,              // Currency code (USD, EUR, GBP, etc.)
  currencyType: string,      // Full currency name
  symbol: string,            // Currency symbol ($, €, £, etc.)
  flag: string,              // Image URL for currency flag
  accountTag: string,        // Unique identifier
  accountType: string        // e.g., 'Savings'
}
```

#### Transaction Entity

```javascript
{
  id: number,
  amount: number,
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER',
  accountId: number,
  recipientAccountNumber: string | null,
  initiated: string,         // ISO 8601 timestamp
  status: 'PENDING' | 'COMPLETED' | 'FAILED',
  description: string
}
```


#### Loan Entity

```javascript
{
  id: number,
  principalAmount: number,
  interestRate: number,      // Percentage (e.g., 5.5 for 5.5%)
  term: number,              // In years
  monthlyPayment: number,    // Calculated by backend
  totalAmount: number,       // Principal + interest
  purpose: string,
  applicationDate: string,   // ISO 8601 format
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'PAID_OFF',
  userId: number
}
```

### API Request/Response Models

#### POST /account/create

**Request Body**:
```javascript
{
  code: string,        // Currency code
  initialDeposit: number
}
```

**Response**: Account entity

#### POST /account/{accountId}/deposit

**Query Parameters**:
- `amount`: number

**Request Body**: None (or empty)

**Response**: Transaction entity

#### POST /account/{accountId}/withdraw

**Query Parameters**:
- `amount`: number

**Request Body**: None (or empty)

**Response**: Transaction entity

#### POST /loan/create

**Request Body**:
```javascript
{
  principalAmount: number,
  term: number,
  purpose: string
}
```

**Response**: Loan entity


#### GET /user/all

**Response**: Array of User entities

#### GET /loan/all

**Response**: Array of Loan entities

## Low-Level Design

### Redux Slice Implementations

#### Account Slice (`/src/features/accounts/accountSlice.js`)

```javascript
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api/api"

const initialState = {
  accounts: [],
  status: 'IDLE',
  error: null
}

// Async Thunks
export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAll",
  async () => {
    try {
      const headers = { Authorization: `${sessionStorage.getItem('access_token')}` }
      const { data, error } = await api.get('/account/all', headers)
      if (error) throw error
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }
)

export const createAccount = createAsyncThunk(
  "accounts/create",
  async (accountDetails) => {
    try {
      const headers = { Authorization: `${sessionStorage.getItem('access_token')}` }
      const { data, error } = await api.post('/account/create', accountDetails, headers)
      if (error) throw error
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }
)

export const fetchAccountById = createAsyncThunk(
  "accounts/fetchById",
  async (accountId) => {
    try {
      const headers = { Authorization: `${sessionStorage.getItem('access_token')}` }
      const { data, error } = await api.get(`/account/${accountId}`, headers)
      if (error) throw error
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }
)

export const depositFunds = createAsyncThunk(
  "accounts/deposit",
  async ({ accountId, amount }) => {
    try {
      const headers = { Authorization: `${sessionStorage.getItem('access_token')}` }
      const { data, error } = await api.post(
        `/account/${accountId}/deposit?amount=${amount}`,
        null,
        headers
      )
      if (error) throw error
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }
)

export const withdrawFunds = createAsyncThunk(
  "accounts/withdraw",
  async ({ accountId, amount }) => {
    try {
      const headers = { Authorization: `${sessionStorage.getItem('access_token')}` }
      const { data, error } = await api.post(
        `/account/${accountId}/withdraw?amount=${amount}`,
        null,
        headers
      )
      if (error) throw error
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }
)

// Slice
export const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    resetAccountStatus: (state) => {
      state.status = 'IDLE'
      state.error = null
    }
  },
  extraReducers(builder) {
    builder
      // Fetch All Accounts
      .addCase(fetchAccounts.pending, (state) => {
        state.status = 'PENDING'
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.accounts = action.payload
        state.status = 'SUCCESS'
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = 'FAILED'
        state.error = action.error.message
      })
      // Create Account
      .addCase(createAccount.pending, (state) => {
        state.status = 'PENDING'
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.accounts.push(action.payload)
        state.status = 'SUCCESS'
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.status = 'FAILED'
        state.error = action.error.message
      })
      // Deposit
      .addCase(depositFunds.pending, (state) => {
        state.status = 'PENDING'
      })
      .addCase(depositFunds.fulfilled, (state) => {
        state.status = 'SUCCESS'
      })
      .addCase(depositFunds.rejected, (state, action) => {
        state.status = 'FAILED'
        state.error = action.error.message
      })
      // Withdraw
      .addCase(withdrawFunds.pending, (state) => {
        state.status = 'PENDING'
      })
      .addCase(withdrawFunds.fulfilled, (state) => {
        state.status = 'SUCCESS'
      })
      .addCase(withdrawFunds.rejected, (state, action) => {
        state.status = 'FAILED'
        state.error = action.error.message
      })
  }
})

export const { resetAccountStatus } = accountSlice.actions

// Selectors
export const selectAccounts = state => state.accounts.accounts
export const selectAccountStatus = state => state.accounts.status
export const selectAccountError = state => state.accounts.error

export default accountSlice.reducer
```

#### Loan Slice (`/src/features/loans/loanSlice.js`)

```javascript
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../api/api"

const initialState = {
  loans: [],
  status: 'IDLE',
  error: null
}

// Async Thunks
export const fetchLoans = createAsyncThunk(
  "loans/fetchAll",
  async () => {
    try {
      const headers = { Authorization: `${sessionStorage.getItem('access_token')}` }
      const { data, error } = await api.get('/loan/all', headers)
      if (error) throw error
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }
)

export const createLoan = createAsyncThunk(
  "loans/create",
  async (loanDetails) => {
    try {
      const headers = { Authorization: `${sessionStorage.getItem('access_token')}` }
      const { data, error } = await api.post('/loan/create', loanDetails, headers)
      if (error) throw error
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }
)

// Slice
export const loanSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {
    resetLoanStatus: (state) => {
      state.status = 'IDLE'
      state.error = null
    }
  },
  extraReducers(builder) {
    builder
      // Fetch Loans
      .addCase(fetchLoans.pending, (state) => {
        state.status = 'PENDING'
      })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.loans = action.payload
        state.status = 'SUCCESS'
      })
      .addCase(fetchLoans.rejected, (state, action) => {
        state.status = 'FAILED'
        state.error = action.error.message
      })
      // Create Loan
      .addCase(createLoan.pending, (state) => {
        state.status = 'PENDING'
      })
      .addCase(createLoan.fulfilled, (state, action) => {
        state.loans.push(action.payload)
        state.status = 'SUCCESS'
      })
      .addCase(createLoan.rejected, (state, action) => {
        state.status = 'FAILED'
        state.error = action.error.message
      })
  }
})

export const { resetLoanStatus } = loanSlice.actions

// Selectors
export const selectLoans = state => state.loans.loans
export const selectLoanStatus = state => state.loans.status
export const selectLoanError = state => state.loans.error

export default loanSlice.reducer
```

#### Enhanced User Slice

Add new thunk for fetching all users:

```javascript
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAll",
  async () => {
    try {
      const headers = { Authorization: `${sessionStorage.getItem('access_token')}` }
      const { data, error } = await api.get('/user/all', headers)
      if (error) throw error
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }
)

export const fetchUserById = createAsyncThunk(
  "user/fetchById",
  async (userId) => {
    try {
      const headers = { Authorization: `${sessionStorage.getItem('access_token')}` }
      const { data, error } = await api.get(`/user/${userId}`, headers)
      if (error) throw error
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }
)
```

Add to `initialState`:
```javascript
const initialState = {
  user: JSON.parse(sessionStorage.getItem('user')),
  allUsers: [],  // NEW
  status: 'IDLE',
  error: null
}
```

Add to `extraReducers`:
```javascript
.addCase(fetchAllUsers.pending, (state) => {
  state.status = 'PENDING'
})
.addCase(fetchAllUsers.fulfilled, (state, action) => {
  state.allUsers = action.payload
  state.status = 'SUCCESS'
})
.addCase(fetchAllUsers.rejected, (state, action) => {
  state.status = 'FAILED'
  state.error = action.error.message
})
```

Add selector:
```javascript
export const selectAllUsers = state => state.user.allUsers
```

### Store Configuration Update

Update `/src/app/store.js`:

```javascript
import { configureStore } from "@reduxjs/toolkit"
import accountReducers from "../features/accounts/accountSlice"
import pageReducers from "../features/page/pageSlice"
import cardReducers from "../features/card/cardSlice"
import userReducers from "../features/users/usersSlice"
import transactionsReducers from "../features/transactions/transactionsSlice"
import loanReducers from "../features/loans/loanSlice"  // NEW

export const store = configureStore({
  reducer: {
    accounts: accountReducers,
    pages: pageReducers,
    cards: cardReducers,
    user: userReducers,
    transactions: transactionsReducers,
    loans: loanReducers  // NEW
  }
})
```

### Form Validation Logic

#### Account Creation Validation

```javascript
const validateAccountForm = (formData) => {
  const errors = {}
  
  if (!formData.code) {
    errors.code = 'Currency code is required'
  }
  
  if (!formData.initialDeposit || formData.initialDeposit <= 0) {
    errors.initialDeposit = 'Initial deposit must be greater than 0'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
```

#### Deposit/Withdraw Validation

```javascript
const validateTransactionAmount = (amount, accountBalance, type) => {
  const errors = {}
  
  if (!amount || isNaN(amount)) {
    errors.amount = 'Amount must be a valid number'
    return { isValid: false, errors }
  }
  
  if (amount <= 0) {
    errors.amount = 'Amount must be greater than 0'
    return { isValid: false, errors }
  }
  
  if (type === 'withdraw' && amount > accountBalance) {
    errors.amount = 'Insufficient funds'
    return { isValid: false, errors }
  }
  
  return { isValid: true, errors: {} }
}
```

#### Loan Application Validation

```javascript
const validateLoanForm = (formData) => {
  const errors = {}
  
  if (!formData.principalAmount || formData.principalAmount < 1000) {
    errors.principalAmount = 'Loan amount must be at least $1,000'
  }
  
  if (!formData.term || formData.term < 1 || formData.term > 30) {
    errors.term = 'Loan term must be between 1 and 30 years'
  }
  
  if (!Number.isInteger(Number(formData.term))) {
    errors.term = 'Loan term must be a whole number'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
```

## Error Handling

### Error Handling Strategy

#### 1. API Error Categorization

```javascript
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response
    
    switch (status) {
      case 401:
        // Unauthorized - clear session and redirect
        sessionStorage.clear()
        window.location.href = '/login'
        return 'Session expired. Please log in again.'
        
      case 400:
        // Bad request - validation error
        return data.message || 'Invalid request. Please check your input.'
        
      case 404:
        // Not found
        return 'Resource not found.'
        
      case 500:
        // Server error
        return 'Server error. Please try again later.'
        
      default:
        return data.message || 'An unexpected error occurred.'
    }
  } else if (error.request) {
    // Request made but no response
    return 'Unable to connect to server. Please check your internet connection.'
  } else {
    // Error in request setup
    return error.message || 'An error occurred processing your request.'
  }
}
```

#### 2. Notification System

Create a notification component `/src/components/Notification.js`:

```javascript
const Notification = ({ type, message, onClose }) => {
  useEffect(() => {
    if (type === 'success') {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [type, onClose])
  
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'
  
  return (
    <div className={`fixed top-5 right-5 ${bgColor} text-white p-4 rounded-lg shadow-lg flex items-center gap-3 z-50`}>
      <p>{message}</p>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        <FaTimes />
      </button>
    </div>
  )
}
```

#### 3. Component-Level Error Handling

```javascript
const [notification, setNotification] = useState(null)

const showNotification = (type, message) => {
  setNotification({ type, message })
}

const hideNotification = () => {
  setNotification(null)
}

// In useEffect for status changes
useEffect(() => {
  if (status === 'SUCCESS') {
    showNotification('success', 'Operation completed successfully')
    dispatch(resetStatus())
  }
  
  if (status === 'FAILED' && error) {
    showNotification('error', handleApiError(error))
    dispatch(resetStatus())
  }
}, [status, error])
```

### Authentication Token Management

#### Token Storage and Retrieval

**Storage on Login**:
```javascript
// In authenticateUser thunk (already exists)
const { authorization } = headers
sessionStorage.setItem('access_token', authorization)
sessionStorage.setItem('user', JSON.stringify(data))
```

**Retrieval for API Calls**:
```javascript
const headers = {
  Authorization: `${sessionStorage.getItem('access_token')}`
}
```

**Token Expiration Handling**:

```javascript
// Axios interceptor (add to api.js)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      sessionStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

#### Protected Route Enhancement

Update `/src/pages/ProtectedRoute.js` to check for token:

```javascript
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('access_token')
  const user = sessionStorage.getItem('user')
  
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}
```

## Testing Strategy

### Testing Approach

Since this feature involves **UI components, API integration, and simple CRUD operations**, property-based testing is **NOT applicable**. Instead, we will use:

1. **Unit Tests**: Test individual components, validation functions, and utility functions
2. **Integration Tests**: Test Redux slices with API calls (mocked)
3. **Component Tests**: Test React components with React Testing Library
4. **End-to-End Tests**: Test full user flows (optional, using Cypress/Playwright)


### Unit Tests

#### 1. Validation Function Tests

**File**: `src/helper/validation/__tests__/validateForms.test.js`

Test cases:
- ✓ Account creation validation accepts valid input
- ✓ Account creation validation rejects missing currency code
- ✓ Account creation validation rejects negative initial deposit
- ✓ Transaction validation accepts positive amount
- ✓ Transaction validation rejects non-numeric amount
- ✓ Transaction validation rejects negative amount
- ✓ Withdraw validation rejects amount exceeding balance
- ✓ Loan validation accepts amount >= 1000 and term 1-30 years
- ✓ Loan validation rejects amount < 1000
- ✓ Loan validation rejects term < 1 or > 30 years
- ✓ Loan validation rejects non-integer term

#### 2. Error Handling Function Tests

**File**: `src/helper/error/__tests__/handleApiError.test.js`

Test cases:
- ✓ Returns correct message for 401 status
- ✓ Returns correct message for 400 status
- ✓ Returns correct message for 404 status
- ✓ Returns correct message for 500 status
- ✓ Returns network error message when no response
- ✓ Returns generic error message for unknown errors

### Integration Tests (Redux Slices)

#### 1. Account Slice Tests

**File**: `src/features/accounts/__tests__/accountSlice.test.js`

Test cases:
- ✓ fetchAccounts sets status to PENDING then SUCCESS with data
- ✓ fetchAccounts sets status to FAILED on error
- ✓ createAccount adds new account to state on success
- ✓ createAccount sets error on failure
- ✓ depositFunds sets status to SUCCESS on completion
- ✓ withdrawFunds sets status to SUCCESS on completion
- ✓ resetAccountStatus resets status to IDLE

**Mocking Strategy**: Mock `api` module with jest.mock()


#### 2. Loan Slice Tests

**File**: `src/features/loans/__tests__/loanSlice.test.js`

Test cases:
- ✓ fetchLoans sets status to PENDING then SUCCESS with data
- ✓ fetchLoans sets status to FAILED on error
- ✓ createLoan adds new loan to state on success
- ✓ createLoan sets error on failure
- ✓ resetLoanStatus resets status to IDLE

#### 3. Enhanced User Slice Tests

**File**: `src/features/users/__tests__/usersSlice.test.js`

Additional test cases:
- ✓ fetchAllUsers sets status to PENDING then SUCCESS with data
- ✓ fetchAllUsers sets status to FAILED on error
- ✓ fetchUserById returns correct user data

### Component Tests

#### 1. Users Page Tests

**File**: `src/pages/dashboard/__tests__/Users.test.js`

Test cases:
- ✓ Renders loading spinner when status is PENDING
- ✓ Renders error message when status is FAILED
- ✓ Renders user list when status is SUCCESS
- ✓ Dispatches fetchAllUsers on mount
- ✓ Opens user detail modal when user is clicked
- ✓ Closes modal when close button is clicked

#### 2. Loans Page Tests

**File**: `src/pages/dashboard/__tests__/Loans.test.js`

Test cases:
- ✓ Renders loading spinner when status is PENDING
- ✓ Renders loan list when status is SUCCESS
- ✓ Dispatches fetchLoans on mount
- ✓ Opens loan application form when button is clicked
- ✓ Closes form when close button is clicked

#### 3. LoanApplicationForm Tests

**File**: `src/components/loans/__tests__/LoanApplicationForm.test.js`

Test cases:
- ✓ Renders form fields correctly
- ✓ Updates state when input changes
- ✓ Displays validation error for amount < 1000
- ✓ Displays validation error for invalid term
- ✓ Disables submit button when form is invalid
- ✓ Calls createLoan thunk when form is submitted
- ✓ Closes modal on successful submission


#### 4. Deposit Form Tests

**File**: `src/components/account/__tests__/Deposit.test.js`

Test cases:
- ✓ Renders form with account selection
- ✓ Validates amount is positive number
- ✓ Dispatches depositFunds with correct parameters
- ✓ Displays success notification on completion
- ✓ Displays error notification on failure

#### 5. Notification Component Tests

**File**: `src/components/__tests__/Notification.test.js`

Test cases:
- ✓ Renders with correct message and type
- ✓ Auto-dismisses after 3 seconds for success type
- ✓ Does not auto-dismiss for error type
- ✓ Calls onClose when close button is clicked
- ✓ Applies correct styling based on type

### Snapshot Tests

Use snapshot tests for UI components to catch unintended layout changes:

- ✓ Users page layout snapshot
- ✓ Loans page layout snapshot
- ✓ LoanApplicationForm modal snapshot
- ✓ UserDetailModal snapshot
- ✓ Deposit form snapshot

### Test Coverage Goals

- **Unit Tests**: 90% coverage for validation and utility functions
- **Integration Tests**: 80% coverage for Redux slices
- **Component Tests**: 70% coverage for React components
- **Overall**: Minimum 75% code coverage

### Testing Libraries

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing
- **Redux Mock Store**: Redux slice testing
- **MSW (Mock Service Worker)**: API mocking for integration tests (optional)

## Implementation Plan

### Phase 1: Redux Slices (Foundation)

1. Create `accountSlice.js` with all thunks and reducers
2. Create `loanSlice.js` with all thunks and reducers
3. Enhance `usersSlice.js` with `fetchAllUsers` and `fetchUserById`
4. Update `store.js` to register new slices
5. Write unit tests for all slices

**Deliverables**:
- `/src/features/accounts/accountSlice.js`
- `/src/features/loans/loanSlice.js`
- Updated `/src/features/users/usersSlice.js`
- Updated `/src/app/store.js`
- Test files for all slices


### Phase 2: Validation and Error Handling

1. Create validation utility functions
2. Create error handling utility functions
3. Create Notification component
4. Add axios interceptor for 401 handling
5. Write unit tests for validation functions

**Deliverables**:
- `/src/helper/validation/validateForms.js`
- `/src/helper/error/handleApiError.js`
- `/src/components/Notification.js`
- Updated `/src/api/api.js`

### Phase 3: User Management UI

1. Create Users page component
2. Create UserDetailModal component
3. Add Users route to Dashboard
4. Update NavBar with Users link
5. Write component tests

**Deliverables**:
- `/src/pages/dashboard/Users.js`
- `/src/components/users/UserDetailModal.js`
- Updated `/src/components/dashboard/NavBar.js`
- Updated `/src/pages/Dashboard.js`

### Phase 4: Account Management Enhancements

1. Create Deposit component (mirror Withdraw)
2. Update Account page with Deposit button
3. Integrate accountSlice with existing Account page
4. Update AccountDetails to use new account data structure
5. Write component tests

**Deliverables**:
- `/src/components/account/Deposit.js`
- Updated `/src/pages/dashboard/Account.js`
- Updated `/src/components/account/NewAccount.js`

### Phase 5: Loan Management UI

1. Create Loans page component
2. Create LoanApplicationForm component
3. Create LoanList component
4. Add Loans route to Dashboard
5. Update NavBar with Loans link
6. Write component tests

**Deliverables**:
- `/src/pages/dashboard/Loans.js`
- `/src/components/loans/LoanApplicationForm.js`
- `/src/components/loans/LoanList.js`
- Updated `/src/components/dashboard/NavBar.js`


### Phase 6: Testing and Quality Assurance

1. Run all unit tests and achieve 90% coverage
2. Run all integration tests and achieve 80% coverage
3. Run all component tests and achieve 70% coverage
4. Manual testing of all features
5. Fix bugs and handle edge cases
6. Accessibility audit with screen reader
7. Responsive design testing on mobile/tablet/desktop

### Phase 7: Documentation and Deployment

1. Update README with new features
2. Add inline code comments
3. Create user guide for new features
4. Update environment configuration documentation
5. Deploy to staging environment
6. Conduct user acceptance testing
7. Deploy to production

## Responsive Design Considerations

### Breakpoints (Tailwind CSS)

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (sm to lg)
- **Desktop**: > 1024px (lg+)

### Mobile-First Approach

All components use mobile-first design with progressive enhancement:

```jsx
// Mobile base styles
<div className="flex flex-col gap-4">
  
// Tablet and above
<div className="flex flex-col sm:flex-row gap-4">

// Desktop
<div className="flex flex-col sm:flex-row lg:grid lg:grid-cols-3 gap-4">
```

### Responsive Patterns

#### Tables on Mobile

Convert tables to stacked cards on mobile:

```jsx
{/* Desktop: Table */}
<table className="hidden sm:table">...</table>

{/* Mobile: Cards */}
<div className="sm:hidden">
  {users.map(user => (
    <div className="card">...</div>
  ))}
</div>
```

#### Modals on Mobile

Full-screen modals on mobile, centered on desktop:

```jsx
<div className="fixed inset-0 sm:inset-auto sm:top-1/2 sm:left-1/2 
                sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2
                sm:max-w-lg sm:rounded-xl">
```


#### Form Layouts

Stack inputs vertically on mobile, horizontal on desktop:

```jsx
<div className="flex flex-col sm:flex-row gap-4">
  <input className="flex-1" />
  <input className="flex-1" />
</div>
```

## Accessibility Guidelines

### Semantic HTML

- Use `<button>` for clickable actions (not `<div>`)
- Use `<form>` for form submissions
- Use proper heading hierarchy (`<h1>` to `<h6>`)
- Use `<label>` associated with form inputs

### ARIA Attributes

```jsx
<button aria-label="Close modal" onClick={onClose}>
  <FaTimes />
</button>

<input
  id="amount"
  type="number"
  aria-describedby="amount-error"
  aria-invalid={errors.amount ? "true" : "false"}
/>
{errors.amount && <p id="amount-error" role="alert">{errors.amount}</p>}
```

### Keyboard Navigation

- All interactive elements accessible via Tab key
- Enter key submits forms
- Escape key closes modals
- Focus trap within modals

### Focus Management

```javascript
// Focus first input when modal opens
useEffect(() => {
  if (showModal) {
    inputRef.current?.focus()
  }
}, [showModal])
```

### Color Contrast

- Minimum 4.5:1 contrast ratio for text
- Error messages in red with sufficient contrast
- Success messages in green with sufficient contrast

## Performance Considerations

### Code Splitting

Use React.lazy for route-based code splitting:

```javascript
const Users = React.lazy(() => import('./pages/dashboard/Users'))
const Loans = React.lazy(() => import('./pages/dashboard/Loans'))

<Suspense fallback={<Spinner />}>
  <Route path="users" element={<Users />} />
  <Route path="loans" element={<Loans />} />
</Suspense>
```


### Memoization

Use useMemo and useCallback for expensive computations:

```javascript
const sortedLoans = useMemo(() => {
  return loans.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate))
}, [loans])

const handleUserClick = useCallback((user) => {
  setSelectedUser(user)
  setShowModal(true)
}, [])
```

### API Call Optimization

- Avoid redundant API calls with status checks
- Cache fetched data in Redux
- Only refetch when necessary (user action or data staleness)

### Bundle Size

- Import only needed icons from react-icons: `import { FaTimes } from 'react-icons/fa'`
- Avoid importing entire lodash: `import debounce from 'lodash/debounce'`
- Use Tailwind's purge in production

## Security Considerations

### Input Sanitization

All user inputs are validated before submission. Backend should also validate.

### XSS Prevention

React automatically escapes values in JSX, preventing XSS attacks.

### Token Security

- Store JWT in sessionStorage (not localStorage for better security)
- Clear token on logout
- Token automatically cleared on 401 response
- Never log token values to console in production

### HTTPS

Ensure all API calls use HTTPS in production (configured via environment variable).

## Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured for production
- [ ] Build optimized with `npm run build`
- [ ] Backend API URL points to production
- [ ] HTTPS enabled
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Analytics configured (optional)
- [ ] Accessibility audit completed
- [ ] Cross-browser testing completed
- [ ] Performance audit completed
- [ ] Security audit completed


## Risks and Mitigations

### Risk 1: Backend API Changes

**Risk**: Backend API structure changes during development

**Mitigation**:
- Maintain clear API documentation
- Version API endpoints
- Use TypeScript interfaces for API responses (optional enhancement)
- Comprehensive error handling for unexpected responses

### Risk 2: Authentication Token Expiration

**Risk**: Token expires during user session, causing failures

**Mitigation**:
- Implement axios interceptor for 401 handling
- Clear session and redirect to login on token expiration
- Display clear "Session expired" message
- Consider implementing refresh token mechanism (future enhancement)

### Risk 3: Browser Compatibility

**Risk**: Features not working on older browsers

**Mitigation**:
- Test on latest versions of Chrome, Firefox, Safari, Edge
- Use Babel polyfills for ES6+ features
- Provide graceful degradation for unsupported features
- Display browser compatibility warning if needed

### Risk 4: State Management Complexity

**Risk**: Redux state becomes difficult to manage

**Mitigation**:
- Follow consistent slice patterns
- Use Redux DevTools for debugging
- Write comprehensive tests for state changes
- Document state structure clearly

### Risk 5: Performance with Large Data Sets

**Risk**: UI becomes slow with many users/loans/accounts

**Mitigation**:
- Implement pagination on backend (transactions already paginated)
- Use virtualized lists for large data sets (react-window)
- Optimize re-renders with React.memo
- Implement search/filter functionality

## Future Enhancements

### Short-term (Next Sprint)

1. **Search and Filter**: Add search functionality to Users and Loans pages
2. **Pagination**: Implement pagination for users and loans lists
3. **Sorting**: Allow sorting by different columns (date, amount, status)
4. **Export**: Add export to CSV functionality for transactions and loans

### Medium-term (Next Quarter)

1. **Refresh Token**: Implement automatic token refresh before expiration
2. **Real-time Updates**: Add WebSocket support for live balance updates
3. **Loan Repayment**: Add UI for making loan payments
4. **Account Statements**: Generate PDF statements for accounts
5. **Dark Mode**: Implement dark mode toggle


### Long-term (Next Year)

1. **Multi-language Support**: i18n integration for multiple languages
2. **Mobile App**: React Native mobile application
3. **Biometric Auth**: Fingerprint/Face ID authentication
4. **Bill Pay**: Integrate bill payment functionality
5. **Budget Tracking**: Personal finance management features
6. **Investment Accounts**: Support for investment/brokerage accounts

## Appendix

### A. Environment Variables

```
REACT_APP_IOBANK_SERVER_API_URL=http://localhost:8080/api
```

For production:
```
REACT_APP_IOBANK_SERVER_API_URL=https://api.iobank.com
```

### B. File Structure

```
src/
├── api/
│   └── api.js (existing)
├── app/
│   └── store.js (update)
├── components/
│   ├── account/
│   │   ├── AccountDetails.js (existing)
│   │   ├── NewAccount.js (existing)
│   │   ├── Withdraw.js (existing)
│   │   └── Deposit.js (NEW)
│   ├── dashboard/
│   │   ├── Header.js (existing)
│   │   └── NavBar.js (update)
│   ├── loans/
│   │   ├── LoanApplicationForm.js (NEW)
│   │   └── LoanList.js (NEW)
│   ├── users/
│   │   └── UserDetailModal.js (NEW)
│   ├── Notification.js (NEW)
│   └── Spinner.js (existing)
├── features/
│   ├── accounts/
│   │   └── accountSlice.js (NEW)
│   ├── loans/
│   │   └── loanSlice.js (NEW)
│   ├── transactions/
│   │   └── transactionsSlice.js (existing)
│   └── users/
│       └── usersSlice.js (update)
├── helper/
│   ├── error/
│   │   └── handleApiError.js (NEW)
│   └── validation/
│       └── validateForms.js (NEW)
├── pages/
│   ├── dashboard/
│   │   ├── Account.js (update)
│   │   ├── Home.js (existing)
│   │   ├── Loans.js (NEW)
│   │   ├── Payment.js (existing)
│   │   ├── Profile.js (existing)
│   │   ├── Transaction.js (existing)
│   │   └── Users.js (NEW)
│   ├── Dashboard.js (update)
│   ├── Login.js (existing)
│   └── Register.js (existing)
└── App.js (existing)
```


### C. API Endpoint Summary

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | /user/register | Register new user | No |
| POST | /user/auth | Authenticate user | No |
| GET | /user/all | Fetch all users | Yes |
| GET | /user/{id} | Fetch user by ID | Yes |
| GET | /account/all | Fetch all accounts | Yes |
| POST | /account/create | Create new account | Yes |
| GET | /account/{id} | Fetch account by ID | Yes |
| POST | /account/{id}/deposit | Deposit funds | Yes |
| POST | /account/{id}/withdraw | Withdraw funds | Yes |
| GET | /transactions?page={n} | Fetch transactions (paginated) | Yes |
| POST | /loan/create | Apply for loan | Yes |
| GET | /loan/all | Fetch all loans | Yes |

### D. Redux Action Types

#### Account Actions
- `accounts/fetchAll/pending`
- `accounts/fetchAll/fulfilled`
- `accounts/fetchAll/rejected`
- `accounts/create/pending`
- `accounts/create/fulfilled`
- `accounts/create/rejected`
- `accounts/deposit/pending`
- `accounts/deposit/fulfilled`
- `accounts/deposit/rejected`
- `accounts/withdraw/pending`
- `accounts/withdraw/fulfilled`
- `accounts/withdraw/rejected`

#### Loan Actions
- `loans/fetchAll/pending`
- `loans/fetchAll/fulfilled`
- `loans/fetchAll/rejected`
- `loans/create/pending`
- `loans/create/fulfilled`
- `loans/create/rejected`

#### User Actions (New)
- `user/fetchAll/pending`
- `user/fetchAll/fulfilled`
- `user/fetchAll/rejected`
- `user/fetchById/pending`
- `user/fetchById/fulfilled`
- `user/fetchById/rejected`

### E. Component Props Reference

#### UserDetailModal
```typescript
interface UserDetailModalProps {
  user: User;
  onClose: () => void;
}
```

#### LoanApplicationForm
```typescript
interface LoanApplicationFormProps {
  onClose: () => void;
}
```

#### Deposit
```typescript
interface DepositProps {
  setShowDepositForm: (show: boolean) => void;
}
```

#### Notification
```typescript
interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}
```


### F. Styling Conventions

#### Color Palette
- **Primary**: Blue (#3B82F6) - buttons, links
- **Success**: Green (#10B981) - success notifications
- **Error**: Red (#EF4444) - error notifications, validation errors
- **Gray Scale**: For text, backgrounds, borders
  - Gray 50: #F9FAFB (light backgrounds)
  - Gray 200: #E5E7EB (borders, disabled states)
  - Gray 400: #9CA3AF (secondary text)
  - Gray 600: #4B5563 (primary text)
  - Gray 900: #111827 (headings)

#### Common Class Patterns

**Buttons**:
```jsx
// Primary button
className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-900 transition"

// Secondary button
className="bg-gray-200 text-gray-700 p-3 rounded-md hover:bg-gray-300 transition"
```

**Forms**:
```jsx
// Input field
className="flex-1 p-2 lg:p-3 border-gray-200 border-2 rounded-md"

// Select dropdown
className="bg-gray-200 h-full p-2 lg:p-3 rounded-md"

// Label
className="font-semibold text-gray-600 text-sm"
```

**Containers**:
```jsx
// Section container
className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-4"

// Modal container
className="fixed inset-0 sm:inset-auto bg-white p-6 rounded-xl shadow-lg"
```

**Text**:
```jsx
// Heading
className="font-bold text-gray-600 text-sm"

// Body text
className="text-gray-600"

// Small text
className="text-xs text-gray-400"
```

### G. References

- **React Documentation**: https://react.dev/
- **Redux Toolkit Documentation**: https://redux-toolkit.js.org/
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **React Router Documentation**: https://reactrouter.com/
- **Axios Documentation**: https://axios-http.com/docs/intro
- **React Testing Library**: https://testing-library.com/react
- **Jest Documentation**: https://jestjs.io/docs/getting-started
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Author**: Kiro AI Assistant  
**Status**: Ready for Review

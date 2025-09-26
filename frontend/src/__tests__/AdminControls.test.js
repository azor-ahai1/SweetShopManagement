import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import authReducer from '../store/authSlice';
import Dashboard from '../pages/Dashboard';
import { BrowserRouter } from 'react-router-dom';

// Mock Redux Store
const createMockStore = (isAdmin) => {
    const initialState = {
        auth: { 
            userAuth: true, 
            user: { name: "Test", email: "a@b.com" },
            isAdmin: isAdmin, 
            token: "mock_token"
        }
    };
    return createStore(combineReducers({ auth: authReducer }), initialState);
};

// Mock the services to prevent network calls
jest.mock('../utils/sweetService', () => ({
    mockFetchSweets: jest.fn(() => Promise.resolve({ success: true, data: [] })),
    mockPurchaseSweet: jest.fn(() => Promise.resolve({ success: true })),
}));

afterEach(cleanup);

//  TEST 1: Check if the 'Add New Sweet' button is visible to Admin.
test('Admin button is visible when user is Admin', async () => {
    const store = createMockStore(true); // Is Admin
    // This will fail because the button is not implemented yet in Dashboard.jsx
    render(
        <Provider store={store}>
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        </Provider>
    );

    // Wait for the Dashboard content to load (since mockFetchSweets is async)
    await screen.findByText(/no sweets found/i);
    
    // Test for the Admin-only button text
    expect(screen.getByRole('button', { name: /add new sweet/i })).toBeInTheDocument();
});

//  TEST 2: Check if the 'Add New Sweet' button is NOT visible to non-Admin.
test('Admin button is hidden when user is NOT Admin', async () => {
    const store = createMockStore(false); // Is NOT Admin
    
    render(
        <Provider store={store}>
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        </Provider>
    );

    await screen.findByText(/no sweets found/i);
    
    // Assert that the button should not be present
    expect(screen.queryByRole('button', { name: /add new sweet/i })).not.toBeInTheDocument();
});
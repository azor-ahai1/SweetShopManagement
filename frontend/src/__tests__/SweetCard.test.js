import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import SweetCard from '../components/SweetCard';
import React from 'react';

// Mock the purchase function to prevent test failures from imports
const mockPurchase = jest.fn();

const mockSweet = {
    _id: 's1', 
    name: 'Chocolate Bar', 
    category: 'Chocolate', 
    price: 2.50, 
    quantity: 10
};
const outOfStockSweet = {
    _id: 's2', 
    name: 'Lollipop', 
    category: 'Hard Candy', 
    price: 0.75, 
    quantity: 0
};

afterEach(cleanup);

// TEST 1: Check if the SweetCard renders and displays the name.
test('SweetCard renders sweet name and details', () => {
    // This will fail because SweetCard.jsx does not exist yet.
    render(<SweetCard sweet={mockSweet} onPurchase={mockPurchase} />);
    expect(screen.getByText(/Chocolate Bar/i)).toBeInTheDocument();
    expect(screen.getByText(/\$2.50/i)).toBeInTheDocument();
    expect(screen.getByText(/10 in stock/i)).toBeInTheDocument();
});

// TEST 2: Check if the purchase button is correctly enabled when stock is > 0.
test('Purchase button is enabled when in stock', () => {
    render(<SweetCard sweet={mockSweet} onPurchase={mockPurchase} />);
    const button = screen.getByRole('button', { name: /purchase/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
});

// TEST 3: Check if the purchase button is correctly disabled when stock is 0.
test('Purchase button is disabled when out of stock', () => {
    render(<SweetCard sweet={outOfStockSweet} onPurchase={mockPurchase} />);
    const button = screen.getByRole('button', { name: /out of stock/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
});
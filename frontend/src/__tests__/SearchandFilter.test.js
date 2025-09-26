import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import SearchAndFilter from '../components/SearchAndFilter';

// Mock the onSearch function that will be passed down from the Dashboard
const mockOnSearch = jest.fn();

afterEach(cleanup);

// TEST 1: Check if the component renders the search input and button.
test('SearchAndFilter renders search input and submits query', () => {
    
    render(<SearchAndFilter onSearch={mockOnSearch} />);
    
    // Check for the search input
    const searchInput = screen.getByPlaceholderText(/search by name/i);
    expect(searchInput).toBeInTheDocument();
    
    fireEvent.change(searchInput, { target: { value: 'lollipop' } });
    
    expect(searchInput.value).toBe('lollipop');

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    // Check if the mock handler was called with the correct value
    expect(mockOnSearch).toHaveBeenCalledWith({ query: 'lollipop', category: '' });
});

// TEST 2: Check if category filter functionality is included in the search query.
test('SearchAndFilter includes category filter in submission', () => {
    render(<SearchAndFilter onSearch={mockOnSearch} />);
    
    // Find the category select element
    const categorySelect = screen.getByLabelText(/category/i); 
    
    fireEvent.change(categorySelect, { target: { value: 'Gummy' } });
    
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    // Check if the mock handler was called with the category
    expect(mockOnSearch).toHaveBeenCalledWith({ query: '', category: 'Gummy' });
});
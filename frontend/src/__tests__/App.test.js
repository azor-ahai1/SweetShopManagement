
import { render, screen } from '@testing-library/react';
import App from '../App.jsx';

describe('App Component', () => {
    test('renders Sweet Shop Management System heading', () => {
        render(<App />);
        const headingElement = screen.getByText(/Sweet Shop Management System/i);
        expect(headingElement).toBeInTheDocument();
    });
});
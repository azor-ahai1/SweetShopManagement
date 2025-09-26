const mockSweetsData = [
    { _id: 's1', name: 'Chocolate Bar', category: 'Chocolate', price: 2.50, quantity: 10, description: 'Classic milk chocolate bar.' },
    { _id: 's2', name: 'Lollipop', category: 'Hard Candy', price: 0.75, quantity: 0, description: 'Strawberry flavored lollipop.' },
    { _id: 's3', name: 'Gummy Bears', category: 'Gummy', price: 3.00, quantity: 5, description: 'Assorted fruit flavored gummy bears.' },
];

export const mockFetchSweets = (query = {}) => {
    console.log("Mock Fetch Sweets called with query:", query);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredData = mockSweetsData.filter(sweet => 
                (query.name ? sweet.name.toLowerCase().includes(query.name.toLowerCase()) : true) &&
                (query.category ? sweet.category === query.category : true)
            );
            
            resolve({
                success: true,
                data: filteredData,
                message: "Sweets fetched successfully (Mock)",
            });
        }, 300);
    });
};

export const mockPurchaseSweet = (sweetId) => {
    console.log(`Mock Purchase Sweet called for ID: ${sweetId}`);
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const sweet = mockSweetsData.find(s => s._id === sweetId);
            
            if (!sweet) {
                return reject(new Error("Sweet not found. (Mock)"));
            }
            if (sweet.quantity <= 0) {
                return reject(new Error("Out of stock. (Mock)"));
            }
            
            resolve({
                success: true,
                message: `Successfully purchased 1 unit of ${sweet.name}.`,
            });
        }, 500);
    });
};

let currentId = 4; // Start ID after initial mock data

export const mockAddSweet = (data) => {
    console.log("Mock Add Sweet called with:", data);
    return new Promise((resolve) => {
        setTimeout(() => {
            const newSweet = {
                _id: `s${currentId++}`, 
                ...data,
                price: parseFloat(data.price),
                quantity: parseInt(data.quantity),
            };
            mockSweetsData.push(newSweet); // Add to mock array
            resolve({ success: true, data: newSweet, message: "Sweet added successfully (Mock)" });
        }, 500);
    });
};

export const mockUpdateSweet = (id, data) => {
    console.log(`Mock Update Sweet called for ID: ${id} with data:`, data);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = mockSweetsData.findIndex(s => s._id === id);
            if (index === -1) return reject(new Error("Sweet not found (Mock)"));

            // Update the data, ensuring type conversion
            mockSweetsData[index] = { 
                ...mockSweetsData[index], 
                ...data,
                price: data.price ? parseFloat(data.price) : mockSweetsData[index].price,
                quantity: data.quantity ? parseInt(data.quantity) : mockSweetsData[index].quantity,
            };
            resolve({ success: true, data: mockSweetsData[index], message: "Sweet updated successfully (Mock)" });
        }, 500);
    });
};

export const mockDeleteSweet = (id) => {
    console.log(`Mock Delete Sweet called for ID: ${id}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const initialLength = mockSweetsData.length;
            const newLength = mockSweetsData.filter(s => s._id !== id).length;
            
            if (newLength === initialLength) return reject(new Error("Sweet not found for deletion (Mock)"));

            // Simulate successful deletion
            mockSweetsData.splice(mockSweetsData.findIndex(s => s._id === id), 1);
            resolve({ success: true, message: "Sweet deleted successfully (Mock)" });
        }, 300);
    });
};

export const mockRestockSweet = (id, amount) => {
    console.log(`Mock Restock Sweet called for ID: ${id} by amount: ${amount}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const sweet = mockSweetsData.find(s => s._id === id);
            if (!sweet) return reject(new Error("Sweet not found for restock (Mock)"));
            
            sweet.quantity += parseInt(amount);
            resolve({ success: true, data: sweet, message: `Restocked ${sweet.name} by ${amount} units (Mock)` });
        }, 400);
    });
};
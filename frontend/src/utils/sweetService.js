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
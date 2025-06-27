const { Table } = require('console-table-printer');

describe('Console Table Printer Complex Scenarios', () => {
  describe('Nested data with custom rendering', () => {
    it('should handle nested objects with custom rendering', () => {
      const table = new Table({
        title: 'Complex Data Table',
        columns: [
          { name: 'id', alignment: 'left', color: 'blue' },
          { name: 'name', alignment: 'left' },
          { name: 'metadata', alignment: 'left', color: 'green', 
            formatter: (value) => JSON.stringify(value).substring(0, 20) + '...' },
          { name: 'status', alignment: 'right', 
            color: (val) => val === 'active' ? 'green' : val === 'pending' ? 'yellow' : 'red' }
        ]
      });
      
      table.addRows([
        {
          id: 1,
          name: 'Complex Item 1',
          metadata: { 
            tags: ['important', 'urgent'], 
            details: { owner: 'John', priority: 'high', notes: 'Very long note that should be truncated' }
          },
          status: 'active'
        },
        {
          id: 2,
          name: 'Complex Item 2',
          metadata: { 
            tags: ['normal'], 
            details: { owner: 'Jane', priority: 'medium', notes: 'Another long note with details' }
          },
          status: 'pending'
        },
        {
          id: 3,
          name: 'Complex Item 3',
          metadata: { 
            tags: ['archived'], 
            details: { owner: 'Bob', priority: 'low', notes: 'This item is no longer relevant' }
          },
          status: 'inactive'
        }
      ]);
      
      // This just tests that rendering doesn't throw an error
      expect(() => table.printTable()).not.toThrow();
    });
  });
  
  describe('Dynamic column generation and filtering', () => {
    it('should handle dynamically generated columns and filtered rows', () => {
      // Create data with varying properties
      const data = [];
      for (let i = 1; i <= 20; i++) {
        const item = { id: i, name: `Item ${i}` };
        
        // Add random properties
        if (i % 2 === 0) item.category = 'Even';
        if (i % 3 === 0) item.priority = i % 9 === 0 ? 'High' : 'Medium';
        if (i % 5 === 0) item.tags = [`Tag-${i}`, `Group-${Math.floor(i/5)}`];
        
        // Add metrics
        item.value = i * 10;
        if (i % 4 === 0) item.discount = i * 2.5;
        
        data.push(item);
      }
      
      // Extract all unique keys to create columns dynamically
      const allKeys = new Set();
      data.forEach(item => Object.keys(item).forEach(key => allKeys.add(key)));
      
      const table = new Table({
        title: 'Dynamic Data Table',
        columns: Array.from(allKeys).map(key => {
          return {
            name: key,
            alignment: ['value', 'discount'].includes(key) ? 'right' : 'left',
            color: key === 'priority' ? 
              (val => val === 'High' ? 'red' : 'yellow') : 
              undefined
          };
        })
      });
      
      // Filter and add rows
      const filteredData = data.filter(item => item.id > 5 && item.id < 16);
      table.addRows(filteredData);
      
      // Removed sortBy call since it's not available
      
      // This just tests that rendering doesn't throw an error
      expect(() => table.printTable()).not.toThrow();
      
      // Verify filtered data
      expect(filteredData.length).toBe(10);
      expect(filteredData[0].id).toBe(6);
      expect(filteredData[filteredData.length - 1].id).toBe(15);
    });
  });
  
  describe('Stress test with large datasets', () => {
    it('should handle large datasets efficiently', () => {
      const table = new Table({
        title: 'Large Dataset',
        columns: [
          { name: 'id', alignment: 'left' },
          { name: 'value', alignment: 'right' },
          { name: 'description', alignment: 'left' }
        ]
      });
      
      const largeData = [];
      for (let i = 1; i <= 100; i++) {
        largeData.push({
          id: `ID-${i.toString().padStart(3, '0')}`,
          value: Math.floor(Math.random() * 10000) / 100,
          description: `This is item number ${i} with a somewhat lengthy description that might cause wrapping issues if not handled properly`
        });
      }
      
      table.addRows(largeData);
      
      // This just tests that rendering doesn't throw an error
      expect(() => table.printTable()).not.toThrow();
    });
  });
}); 
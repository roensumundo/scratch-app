const SERVER_URL = 'http://localhost:9026';



function download_CSV_file() {
    window.location.href = '/download_users';
    
    const reader = new FileReader();

}

function parseCSV(csvData) {
    // Split the CSV data into rows
    const rows = csvData.split('\n');
  
    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].trim();
      
      // Split the row into columns
      const columns = row.split(',');
  
      // Process each column
      for (let j = 0; j < columns.length; j++) {
        const column = columns[j].trim();
        // Do something with the column data
        console.log(column);
      }
    }
  }
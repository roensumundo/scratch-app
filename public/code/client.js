// For sign-up request
const signup = async (username, password) => {
    const response = await fetch('http://localhost:9026/signup', { // Update URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    console.log(data); // Handle server response
  };
  
  // For login request
  const login = async (username, password) => {
    const response = await fetch('http://localhost:9026/login', { // Update URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    console.log(data); // Handle server response
  };

  signup("john", "pass123");
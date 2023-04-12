// For sign-up request
const signup = async (username, password) => {
    const response = await fetch('http://localhost:3000/signup', { // Update URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    console.log(data); // Handle server response
  };
  
  // For login request
  const login = async (username, password) => {
    const response = await fetch('http://localhost:3000/login', { // Update URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    console.log(data); // Handle server response
  };
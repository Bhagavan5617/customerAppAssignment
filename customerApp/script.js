const apiUrl = 'http://localhost:8080/login/customers';

async function fetchData(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong.');
  }

  return data;
}
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const message = document.getElementById('message');

  loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(loginForm);
      const userName = formData.get('userName');
      const password = formData.get('password');

      try {
          const response = await fetch('http://localhost:8080/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ userName, password })
          });

          if (response.ok) {
          
              window.location.href = 'customerlist.html';
          } else {
              message.textContent = 'Invalid credentials';
          }
      } catch (error) {
          console.error('Error during login:', error);
          message.textContent = 'Error occurred during login';
      }
  });
});

async function fetchCustomers() {
  try {
    const response = await fetchData(apiUrl);
    return response;
  } catch (err) {
    console.error('Failed to fetch customer data:', err);
    throw err;
  }
}
async function addNewCustomer(customer) {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    };
    const response = await fetchData(apiUrl, options);
    return response;
  } catch (err) {
    console.error('Failed to add new customer:', err);
    throw err;
  }
}
async function populateCustomerList() {
  try {
    const customers = await fetchCustomers();

    const customerTableBody = document.getElementById('customerTableBody');
    customerTableBody.innerHTML = '';

    customers.forEach((customer) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${customer.firstName}</td>
        <td>${customer.lastName}</td>
        <td>${customer.address}</td>
        <td>${customer.city}</td>
        <td>${customer.email}</td>
        <td>${customer.state}</td>
        <td>${customer.phone}</td>
        <td>
          <button onclick="editCustomer(${customer.id})">Edit</button>
          <button onclick="confirmDeleteCustomer(${customer.id})">Delete</button>
        </td>
      `;
      customerTableBody.appendChild(row);
    });
  } catch (err) {
    console.error('Failed to populate customer list:', err);
  }
}
async function addNewCustomerFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const customer = Object.fromEntries(formData.entries());
  const customerId = getUrlCustomerId();

  if (customerId) {
    try {
      await updateCustomer(customerId, customer);
      window.location.href = 'customerList.html';
    } catch (err) {
      console.error('Failed to update customer:', err);
    }
  } else {
    try {
      await addNewCustomer(customer);
      form.reset();
      await populateCustomerList();
      window.location.href = 'customerList.html';
    } catch (err) {
      console.error('Failed to add new customer:', err);
    }
  }
}
async function deleteCustomer(customerId) {
  try {
    await deleteCustomerFromBackend(customerId);
    populateCustomerList();
  } catch (err) {
    console.error('Failed to delete customer:', err);
  }
}

async function deleteCustomerFromBackend(customerId) {
  try {
    const options = {
      method: 'DELETE',
    };
    location.reload();
    await fetchData(`${apiUrl}/${customerId}`, options);
    location.reload();
  } catch (err) {
    console.error('Failed to delete customer from backend:', err);
    throw err;
  }
}

function confirmDeleteCustomer(customerId) {
  if (confirm('Are you sure you want to delete this customer?')) {
    deleteCustomer(customerId);
  }
}
function getUrlCustomerId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

document.addEventListener('DOMContentLoaded', populateCustomerList);

const addCustomerForm = document.getElementById('addCustomerForm');
addCustomerForm.addEventListener('submit', addNewCustomerFormSubmit);


async function updateCustomerFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const customer = Object.fromEntries(formData.entries());
  const customerId = getUrlCustomerId();

  try {
    await updateCustomer(customerId, customer);
    window.location.href = 'customerList.html';
  } catch (err) {
    console.error('Failed to update customer:', err);
  }
}


async function fetchCustomer(customerId) {
  try {
    const response = await fetchData(`${apiUrl}/${customerId}`);
    return response;
  } catch (err) {
    console.error('Failed to fetch customer data:', err);
    throw err;
  }
}
async function updateCustomer(customerId, customer) {
  try {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    };
    await fetchData(`${apiUrl}/${customerId}`, options);
  } catch (err) {
    console.error('Failed to update customer:', err);
    throw err;
  }
}
async function editCustomer(customerId) {
    try {
      const customer = await fetchCustomer(customerId);
  
      
      const editedCustomer = {
        firstName: prompt('Enter the first name', customer.firstName),
        lastName: prompt('Enter the last name', customer.lastName),
        address: prompt('Enter the address', customer.address),
        city: prompt('Enter the city', customer.city),
        email: prompt('Enter the email', customer.email),
        state: prompt('Enter the state', customer.state),
        phone: prompt('Enter the phone number', customer.phone)
      };
  
      
      await updateCustomer(customerId, editedCustomer);
  
     
      await populateCustomerList();
  
    } catch (err) {
      console.error('Failed to edit customer:', err);
    }
  }
  
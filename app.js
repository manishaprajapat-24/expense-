// Load from localStorage if available or initialize an empty array
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let totalAmount = 0;
let editingIndex = null; // To keep track of the editing item index

// Select the necessary DOM elements
const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountDisplay = document.getElementById('total-amount');
const addButton = document.getElementById('add-btn');
const sortByDateButton = document.getElementById('sort-by-date-btn');

addButton.addEventListener('click', function() {
    // Add or update an expense
});

sortByDateButton.addEventListener('click', function() {
    // Sort expenses by date
});

function updateTotalAmount(amount) {
    totalAmountDisplay.textContent = amount;
}


    // Input validation
    if (!category || isNaN(amount) || amount <= 0 || !date) {
        alert("Please fill all fields with valid data.");
        return;
    }

    if (editingIndex !== null) {
        // Update existing expense
        expenses[editingIndex] = { category, amount, date };
        editingIndex = null; // Reset editing index
        addButton.textContent = 'Add'; // Change button text back to 'Add'
    } else {
        // Add new expense
        expenses.push({ category, amount, date });
    }

    saveExpensesToLocalStorage();
    updateExpenseTable();
    resetInputs();
});

// Function to update the expense table and total amount
function updateExpenseTable() {
    totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
    totalAmountDisplay.textContent = totalAmount.toFixed(2);
    
    // Clear existing rows
    expenseTableBody.innerHTML = "";

    // Populate the table with current expenses
    expenses.forEach((expense, index) => {
        const row = expenseTableBody.insertRow();
        row.insertCell(0).textContent = expense.category;
        row.insertCell(1).textContent = expense.amount.toFixed(2);
        row.insertCell(2).textContent = expense.date;

        // Create edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');
        editButton.addEventListener('click', () => editExpense(index));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => deleteExpense(index));

        row.insertCell(3).appendChild(editButton);
        row.insertCell(4).appendChild(deleteButton);
    });
}

// Function to save expenses to localStorage
function saveExpensesToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to reset input fields
function resetInputs() {
    categorySelect.value = "Grocery"; // or the default value you want
    amountInput.value = "";
    dateInput.value = "";
}

// Function to edit an expense
function editExpense(index) {
    const expense = expenses[index];
    categorySelect.value = expense.category;
    amountInput.value = expense.amount;
    dateInput.value = expense.date;
    editingIndex = index; // Set editing index to the current expense
    addButton.textContent = 'Update'; // Change button text to 'Update'
}

// Function to delete an expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    saveExpensesToLocalStorage();
    updateExpenseTable();
}

// Function to sort the expenses by date
document.getElementById('sort-btn').addEventListener('click', () => {
    expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
    saveExpensesToLocalStorage(); // Save the sorted list to localStorage
    updateExpenseTable(); // Re-render the table with the sorted data
});

// Select the necessary filter-related DOM elements
const startDateInput = document.getElementById('start-date-input');
const endDateInput = document.getElementById('end-date-input');
const filterButton = document.getElementById('filter-btn');
const removeFilterButton = document.getElementById('remove-filter-btn');

// Function to filter expenses by date range
filterButton.addEventListener('click', () => {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (isNaN(startDate) || isNaN(endDate)) {
        alert('Please select valid start and end dates.');
        return;
    }

    const filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= endDate;
    });

    updateExpenseTable(filteredExpenses); // Update the table with filtered data
});

// Function to remove the filter and show all expenses
removeFilterButton.addEventListener('click', () => {
    updateExpenseTable(); // Update the table with the complete list of expenses
    startDateInput.value = ''; // Clear the date inputs
    endDateInput.value = '';
});

// Modified updateExpenseTable function to handle filtered data
function updateExpenseTable(filteredExpenses = expenses) {
    totalAmount = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
    totalAmountDisplay.textContent = totalAmount.toFixed(2);
    
    // Clear existing rows
    expenseTableBody.innerHTML = "";

    // Populate the table with current expenses
    filteredExpenses.forEach((expense, index) => {
        const row = expenseTableBody.insertRow();
        row.insertCell(0).textContent = expense.category;
        row.insertCell(1).textContent = expense.amount.toFixed(2);
        row.insertCell(2).textContent = expense.date;

        // Create edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');
        editButton.addEventListener('click', () => editExpense(index));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => deleteExpense(index));

        row.insertCell(3).appendChild(editButton);
        row.insertCell(4).appendChild(deleteButton);
    });
}

// Initial render
updateExpenseTable();

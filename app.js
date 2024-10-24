let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let editingIndex = null;  

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountDisplay = document.getElementById('total-amount');
const addButton = document.getElementById('add-btn');
const sortByDateButton = document.getElementById('sort-by-date-btn');
const startDateInput = document.getElementById('start-date-input');
const endDateInput = document.getElementById('end-date-input');
const filterButton = document.getElementById('filter-btn');
const removeFilterButton = document.getElementById('remove-filter-btn');

// Initialize event listeners
addButton.addEventListener('click', handleAddExpense);
sortByDateButton.addEventListener('click', sortExpensesByDate);
filterButton.addEventListener('click', handleFilterExpenses);
removeFilterButton.addEventListener('click', removeFilters);

// Function to handle adding or updating expenses
function handleAddExpense() {
    const category = categorySelect.value;
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;

    if (!category || isNaN(amount) || amount <= 0 || !date) {
        alert("Please fill all fields with valid data.");
        return;
    }

    if (editingIndex !== null) {
        expenses[editingIndex] = { category, amount, date };
        editingIndex = null;  
        addButton.textContent = 'Add';  
    } else {
        expenses.push({ category, amount, date });
    }

    saveExpensesToLocalStorage();
    updateExpenseTable();
    resetInputs();
}

// Function to update and display total amount
function updateTotalAmount() {
    const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
    totalAmountDisplay.textContent = `Total: $${totalAmount.toFixed(2)}`;
}

// Sort expenses by date
function sortExpensesByDate() {
    expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
    saveExpensesToLocalStorage();
    updateExpenseTable();
}

// Update the expense table and total amount
function updateExpenseTable(filteredExpenses = expenses) {
    expenseTableBody.innerHTML = "";

    filteredExpenses.forEach((expense, index) => {
        const row = expenseTableBody.insertRow();
        row.insertCell(0).textContent = expense.category;
        row.insertCell(1).textContent = expense.amount.toFixed(2);
        row.insertCell(2).textContent = expense.date;

        const editButton = createButton('Edit', () => editExpense(index));
        const deleteButton = createButton('Delete', () => deleteExpense(index));

        row.insertCell(3).appendChild(editButton);
        row.insertCell(4).appendChild(deleteButton);
    });

    updateTotalAmount();  // Call here to update total amount based on the current expenses
}

// Helper function to create buttons
function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(text.toLowerCase() + '-btn');
    button.addEventListener('click', onClick);
    return button;
}

// Save expenses to local storage
function saveExpensesToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Reset input fields
function resetInputs() {
    categorySelect.value = "Grocery";  
    amountInput.value = "";
    dateInput.value = "";
}

// Edit expense
function editExpense(index) {
    if (index >= 0 && index < expenses.length) {
        const expense = expenses[index];

        categorySelect.value = expense.category;  
        amountInput.value = expense.amount;     
        dateInput.value = expense.date;          

        editingIndex = index;
        addButton.textContent = 'Update'; // Change button text for editing
    }
}

// Delete expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    saveExpensesToLocalStorage();
    updateExpenseTable();
}

// Handle filtering expenses based on date range
function handleFilterExpenses() {
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

    updateExpenseTable(filteredExpenses);
}

// Remove filters and display all expenses
function removeFilters() {
    startDateInput.value = '';  
    endDateInput.value = '';
    updateExpenseTable();  // Reset to show all expenses
}

// Initial update of the expense table
updateExpenseTable();

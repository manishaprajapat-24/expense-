let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let editingIndex = null;

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountDisplay = document.getElementById('total-amount');
const addButton = document.getElementById('add-btn');
const sortByDateButton = document.getElementById('sort-by-date-btn'); // Sort by Date button
const startDateInput = document.getElementById('start-date-input');
const endDateInput = document.getElementById('end-date-input');
const filterButton = document.getElementById('filter-btn');
const removeFilterButton = document.getElementById('remove-filter-btn');

 addButton.addEventListener('click', handleAddExpense);
sortByDateButton.addEventListener('click', sortExpensesByDate);
filterButton.addEventListener('click', filterExpenses);
removeFilterButton.addEventListener('click', removeFilters);

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

 function updateExpenseTable(filteredExpenses = expenses) {
    totalAmountDisplay.textContent = calculateTotal(filteredExpenses).toFixed(2);
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
}

 function calculateTotal(expensesList) {
    return expensesList.reduce((total, expense) => total + expense.amount, 0);
}

 function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(text.toLowerCase() + '-btn');
    button.addEventListener('click', onClick);
    return button;
}

 function saveExpensesToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

 function resetInputs() {
    categorySelect.value = "Grocery";
    amountInput.value = "";
    dateInput.value = "";
}

 function editExpense(index) {
    const expense = expenses[index];
    categorySelect.value = expense.category;
    amountInput.value = expense.amount;
    dateInput.value = expense.date;
    editingIndex = index;
    addButton.textContent = 'Update';
}

 function deleteExpense(index) {
    expenses.splice(index, 1);
    saveExpensesToLocalStorage();
    updateExpenseTable();
}

 function sortExpensesByDate() {
    expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
    saveExpensesToLocalStorage();
    updateExpenseTable();
}

 function filterExpenses() {
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

 function removeFilters() {
    updateExpenseTable();
    startDateInput.value = '';
    endDateInput.value = '';
}

 updateExpenseTable();

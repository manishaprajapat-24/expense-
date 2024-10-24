 let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let totalAmount = 0;
let editingIndex = null;  

 const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountDisplay = document.getElementById('total-amount');
const addButton = document.getElementById('add-btn');
const sortByDateButton = document.getElementById('sort-by-date-btn');

addButton.addEventListener('click', function() {
     let amount = 100;  
    updateTotalAmount(amount);
});

sortByDateButton.addEventListener('click', function() {
     sortExpensesByDate();
});

function updateTotalAmount(amount) {
    totalAmountDisplay.textContent = `Total: $${amount}`;
}

function sortExpensesByDate() {
     console.log('Sorting expenses by date...');
}
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
});

function updateExpenseTable() {
     const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
    totalAmountDisplay.textContent = totalAmount.toFixed(2);
    
     expenseTableBody.innerHTML = "";

     expenses.forEach((expense, index) => {
        const row = expenseTableBody.insertRow();
        row.insertCell(0).textContent = expense.category;
        row.insertCell(1).textContent = expense.amount.toFixed(2);
        row.insertCell(2).textContent = expense.date;

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


 function saveExpensesToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

 function resetInputs() {
    categorySelect.value = "Grocery";  
    amountInput.value = "";
    dateInput.value = "";
}

function editExpense(index) {
     if (index >= 0 && index < expenses.length) {
         const expense = expenses[index];

         categorySelect.value = expense.category;  
        amountInput.value = expense.amount;     
        dateInput.value = expense.date;          

         editingIndex = index;
    } else {
        console.error("Invalid index:", index);
    }
}

 function deleteExpense(index) {
    expenses.splice(index, 1);
    saveExpensesToLocalStorage();
    updateExpenseTable();
}

 document.getElementById('sort-btn').addEventListener('click', () => {
    expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
    saveExpensesToLocalStorage();  
    updateExpenseTable(); 
});

 const startDateInput = document.getElementById('start-date-input');
const endDateInput = document.getElementById('end-date-input');
const filterButton = document.getElementById('filter-btn');
const removeFilterButton = document.getElementById('remove-filter-btn');

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

    updateExpenseTable(filteredExpenses);  
});

 removeFilterButton.addEventListener('click', () => {
    updateExpenseTable();  
    startDateInput.value = '';  
    endDateInput.value = '';
});

 function updateExpenseTable(filteredExpenses = expenses) {
    totalAmount = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
    totalAmountDisplay.textContent = totalAmount.toFixed(2);
    
     expenseTableBody.innerHTML = "";

     filteredExpenses.forEach((expense, index) => {
        const row = expenseTableBody.insertRow();
        row.insertCell(0).textContent = expense.category;
        row.insertCell(1).textContent = expense.amount.toFixed(2);
        row.insertCell(2).textContent = expense.date;

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

 updateExpenseTable();

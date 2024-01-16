const form = document.querySelector(".add");
let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")) : [];
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");

const income = document.getElementById("income");
const expense = document.getElementById("expense");
const balance = document.getElementById("balance");
const div = document.querySelector(".transaction-history");

function updateStats(){
    const updateIncome = transactions
                         .filter(transaction => transaction.amount > 0)
                         .reduce((total,transaction) => total += transaction.amount,0);                       
                         
     const updateExpense = transactions
                         .filter(transaction => transaction.amount < 0)
                         .reduce((total,transaction) => total += Math.abs(transaction.amount),0);
 
     income.textContent = updateIncome;
     expense.textContent = updateExpense;
     const updatedBalance = updateIncome - updateExpense;
     balance.textContent = updatedBalance;                        
 } 

function generateTemplate(id, source, amount, time) {
    return `<li data-id="${id}">
        <p>
            <span>${source}</span>
            <span id="time">${time}</span>
            </p>
        $<span>${Math.abs(amount)}</span>
        <i class="bi bi-trash delete"></i>
        </li>`;
}

function addTransactionDOM(id, source, amount, time) {
    if (amount > 0) {
        incomeList.innerHTML += generateTemplate(id, source, amount, time);
    } else {
        expenseList.innerHTML += generateTemplate(id, source, amount, time);
    }

}

function addTransaction(source, amount) {
    const time = new Date();
    const transaction =
    {
        id: Math.floor(Math.random() * 10000),
        source: source,
        amount: amount,
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    };   
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    addTransactionDOM(transaction.id, source, amount, transaction.time);
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if(form.source.value.trim() === "" || form.amount.value === ""){
        alert('Plese Enter Values');
    }else{
        addTransaction(form.source.value.trim(), Number(form.amount.value));    
        updateStats();
        form.reset();
    }        
});

function getTransaction() {    
    transactions.forEach(transaction => {             
        if (transaction.amount > 0) {
            incomeList.innerHTML += generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        } else {
            expenseList.innerHTML += generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        }
    });
}

function deteteTransaction(id) {
    transactions = transactions.filter(transaction => {
        // console.log(transaction.id,id);
        return transaction.id !== id;
    });
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

incomeList.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete")) {
        event.target.parentElement.remove();
        deteteTransaction(Number(event.target.parentElement.dataset.id));
    }
    updateStats();

});

expenseList.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete")) {
        event.target.parentElement.remove();
        deteteTransaction(Number(event.target.parentElement.dataset.id));
    }
    updateStats();

});

function init(){
    updateStats();
    getTransaction();
}
init();

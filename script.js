const Modal = document.querySelector('.modal-overlay')

const modal= {
  open(){
    Modal.classList.add('active')
  },
  close(){
    Modal.classList.remove('active')
  }
}

const Storage = {
  get() {
      return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
  },

  set(transactions) {
      localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
  }
}

const Transaction = {
  all: Storage.get(),

  add(transaction){
    Transaction.all.push(transaction)

    App.reload()
},

remove(index) {
    Transaction.all.splice(index, 1)

    App.reload()
},

  incomes(){
    let income = 0

    Transaction.all.forEach(transaction=> {
      if(transaction.amount > 0 ){
        income += transaction.amount
      }
    })
     
    return income
  },

  expenses(){
    let expense = 0

    Transaction.all.forEach(transaction=> {
      if(transaction.amount < 0 ){
        expense += transaction.amount
      }
    })
    return expense
  },

  total(){
    return Transaction.incomes() + Transaction.expenses()
  }
}

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),
  addTransaction (transaction, index){
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHtmlTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)
  },

  innerHtmlTransaction (transaction, index){
    const CssClass = transaction.amount > 0 ? "income" : "expense"

    const amount = utils.formatCurrency(transaction.amount) 

    const html = `
      <td class= "description">${transaction.description}</td>
      <td class="${CssClass}"> ${amount}</td>
      <td class="date">${transaction.date}</td>
      <td><img onclick = "Transaction.remove(${index})" src="./asset/minus.svg" alt=""></td> `

    return html
  },

  updateBalance() {
    document
        .getElementById('incomeDisplay')
        .innerHTML = utils.formatCurrency(Transaction.incomes())
    document
        .getElementById('expenseDisplay')
        .innerHTML = utils.formatCurrency(Transaction.expenses())
    document
        .getElementById('totalDisplay')
        .innerHTML = utils.formatCurrency(Transaction.total())
},

  clearTransactions(){
    DOM.transactionsContainer.innerHTML = ""
  }

}

const utils = {
  formatAmount(value){
    value= Number(value) * 100
    
    return value
  },

  formatDate(date){
    const splitDate = date.split("-")
    
    return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
  },

  formatCurrency (value){
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g , "") //<- trocar qualquer caracter por nada

    value = Number(value) / 100

    value = value.toLocaleString("pr-BR" , {
      style : "currency",
      currency: "BRL"
    })  

    return signal + value
  }
}

const form = {
  description: document.querySelector('#description'),
  amount: document.querySelector('#amount'),
  date: document.querySelector('#date'),

  getValues(){
    return {
      description: form.description.value,
      amount: form.amount.value,
      date: form.date.value 
    }
  },

  
  // formatData(){
  //   console.log('formatar os dados')
  // },
  
  validateFields(){
    const {description, amount, date} = form.getValues()
    
    if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
      throw new Error("por favor, preencha os dados...")
    } else{
      
    }
  },
  
  formValues(){
    let {description, amount, date} = form.getValues()

    amount = utils.formatAmount(amount)

    date = utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },

  clearFields(){
    form.description.value = ""
    form.amount.value = ""
    form.date.value = ""

  },

  submit(event){
    event.preventDefault()

    try {
      form.validateFields()

      const transaction =  form.formValues()
      
      Transaction.add(transaction)

      form.clearFields()

      modal.close()
      
    } catch (error) {
      alert(error.message)
    }

  }
}

const App = {
  init() {
      Transaction.all.forEach(DOM.addTransaction)
      
      DOM.updateBalance()

      Storage.set(Transaction.all)
  },
  reload() {
      DOM.clearTransactions()
      App.init()
  },
}

App.init()


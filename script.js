function calculate() {
    if (nonZeroInputs.every(inp => inp.value !== "" && inp.value !== "0" && !inp.classList.contains("error")) && inputs.every(inp => inp.value !== ".")) {
        setTimeout(() => {
            let totalPrice = +bill.value + +bill.value * tip / 100;
            tipPerPerson.textContent = `$${(+bill.value * tip / 100 / people.value).toFixed(2)}`;
            totalPerPerson.textContent = `$${(totalPrice / people.value).toFixed(2)}`;
        }, 0);
    } else {
        tipPerPerson.textContent = `$0.00`;
        totalPerPerson.textContent = `$0.00`;
    }
}
// ••••••
const onlyNumbers = /^(\d*|Backspace|ArrowRight|ArrowLeft|ArrowUp|ArrowDown|\.)$/;
// ••••••
const bill = document.getElementById("bill-input");
const customTip = document.getElementById("tip-input");
const people = document.getElementById("people-input");
const choices = document.querySelectorAll(".choices button");
const tipPerPerson = document.querySelector(".tip-per-person span");
const totalPerPerson = document.querySelector(".total-per-person span");
const resetBtn = document.getElementById("reset-btn");
const inputs = [bill, customTip, people];
const nonZeroInputs = [bill, people];
// ••••••
let isFocus = false;
let tip = 0;
// ••••••
inputs.forEach(inp => {
    let errorMessage = document.createElement("span");
    errorMessage.style.cssText = "position: absolute; right: 0; bottom: -18px; color: red; font-size: 11px";
    inp.addEventListener("keydown", e => {
        console.log(e.key)
        if (!onlyNumbers.test(e.key) || inp.value == "0" && e.key === "0") e.preventDefault()
        else if (inp.value == "0" && /\d/.test(e.key)) inp.value = ""
        else if (inp.selectionStart === 0 && e.key === "0" && inp.value.length > 0) e.preventDefault()
        else if (inp === people && e.key === ".") e.preventDefault()
        if (e.key === "." && inp.value.includes(".")) e.preventDefault()
        setTimeout(() => {
            if (inputs.some(inp => inp.value !== "")) resetBtn.classList.add("available")
            else resetBtn.classList.remove("available")
            calculate()
        }, 0);
    })
    inp.addEventListener("mousedown", _ => {
        setTimeout(() => {
            if(!isFocus) {inp.selectionStart = inp.value.length; isFocus = true}
        }, 0);
    })
    inp.addEventListener("blur", _ => {
        isFocus = false;
        function showError(message) {
            inp.classList.add("error");
            errorMessage.textContent = message;
            inp.parentElement.append(errorMessage);
        }
        if (nonZeroInputs.includes(inp) && inp.value === "") {
            showError("Can't be blank")
        } else if (nonZeroInputs.includes(inp) && inp.value === "0") {
            showError("Can't be zero")
        } else if (inp.value === ".") {
            showError("Wrong format")
        } else {
            inp.classList.remove("error");
            if (inp.parentElement.contains(errorMessage)) inp.parentElement.removeChild(errorMessage)
        }
        calculate()
    })
    resetBtn.addEventListener("click", _ => {
        inputs.forEach(inp => {
            inp.value = "";
            inp.classList.remove("error")
            if (inp.parentElement.contains(errorMessage)) inp.parentElement.removeChild(errorMessage)
            choices.forEach(choice => choice.classList.remove("selected"))
            setTimeout(() => {
                tipPerPerson.textContent = "$0.00";
                totalPerPerson.textContent = "$0.00";
            }, 0);
            tip = 0;
        })
        resetBtn.classList.remove("available")
    })
})

choices.forEach(choice => {
    choice.addEventListener("click", _ => {
        choices.forEach(choice => choice.classList.remove("selected"));
        choice.classList.add("selected");
        tip = +choice.textContent.slice(0, -1)
        customTip.value = "";
        customTip.classList.remove("error");
        let tipErrorMessage = customTip.parentElement.querySelector("span");
        if (tipErrorMessage !== null) customTip.parentElement.removeChild(tipErrorMessage)
        calculate()
    })
})

customTip.addEventListener("keydown", _ => {
    setTimeout(() => {
        choices.forEach(choice => choice.classList.remove("selected"));
        tip = +customTip.value;
    }, 0);
})

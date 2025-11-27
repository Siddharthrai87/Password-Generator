console.log("script is running");
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const LowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol='~!@#$%^&*()_+{}|:"<>?[]';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();

function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    let randNum=getRndInteger(0,symbol.length);
    return symbol.charAt(randNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked)hasUpper=true;
    if(LowercaseCheck.checked)hasLower=true;
    if(numbersCheck.checked)hasNum=true;
    if(symbolsCheck.checked)hasSym=true;

    if(hasUpper && hasLower &&(hasNum || hasSym) && passwordLength>=8)
        setIndicator("#0f0");
    else if((hasUpper||hasLower)&&(hasNum || hasSym) && passwordLength>=6)
        setIndicator("#ff0");
    else
        setIndicator("#f00");
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        {
            checkCount++;
        }
    });
    if(checkCount>passwordLength)
    {
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange)
})



inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    {
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
    if(checkCount<=0)return;

    if(checkCount>passwordLength)
    {
        passwordLength=checkCount;
        handleSlider();
    }

    password="";
    let funcArr=[];
    if(uppercaseCheck.checked)
    {
        funcArr.push(generateUppercase);
    }
    if(LowercaseCheck.checked)
    {
        funcArr.push(generateLowercase);
    }
    if(symbolsCheck.checked)
    {
        funcArr.push(generateSymbol);
    }
    if(numbersCheck.checked)
    {
        funcArr.push(generateRandomNumber);
    }

    for(let i=0;i<funcArr.length;i++)
    {
        password+=funcArr[i]();
    }

    for(let i=0;i<passwordLength-funcArr.length;i++)
    {
        let randIndx=getRndInteger(0,funcArr.length);
        password+=funcArr[randIndx]();
    }

    // password=shufflePassword();

    passwordDisplay.value=password;
    calcStrength();
})
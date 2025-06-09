
const quotes = [
  "Health is wealth.",
  "Stay fit, stay happy.",
  "A journey of a thousand miles begins with a single step.",
  "Eating well is a form of self-respect.",
  "Fitness is not a destination; it is a way of life.",
  "The greatest wealth is health.",
  "Your body deserves the best.",
  "Small steps lead to big changes.",
  "Take care of your body, it’s the only place you have to live.",
  "Strive for progress, not perfection."
];
document.getElementById('quoteOfTheDay').textContent = quotes[Math.floor(Math.random() * quotes.length)];

// Open the login modal
function openModal() {
  document.getElementById('loginModal').style.display = 'flex';
}

// Close the login modal
document.getElementById('closeModal').addEventListener('click', function () {
  document.getElementById('loginModal').style.display = 'none';
});



// Handle Sign In
function handleSignIn() {
  const email = document.getElementById('signInEmail').value;
  const password = document.getElementById('signInPassword').value;

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(re.test(email) == false){
    alert("Please use correct email format");
    return;

  }

  if (email && password) {
      // alert('Sign In successful!');
      document.getElementById('loginModal').style.display = 'none';
  } else {
      alert('Please enter valid credentials.');
  }

  const reqbodsignin ={
    email,
    password
  }
  fetchSignIn(reqbodsignin);

}
var fetchemail;

function fetchSignIn(reqbodsignin){

  fetch("http://localhost:8082/signin",{
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body:JSON.stringify(reqbodsignin)

  })
  .then(res => res.text())
  .then(data=>{

    if(data === "User login Successfull"){
      fetchemail = reqbodsignin.email;
    }
    alert(`Your account status related to ${reqbodsignin.email} is -> ${data}`);

    console.log(data);

  })
}


// Handle Sign Up
function handleSignUp() {
  const email = document.getElementById('signUpEmail').value;
  const password = document.getElementById('signUpPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!email || !password || !confirmPassword) {
      alert('All fields are required.');
      return;
  }

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(re.test(email) == false){
    alert("Please use correct email format");
    return;
  }

//  s


  if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
  }

  // alert('Sign Up successful!');
  const reqbod = {
    email,
    password
  }
  fetchSignUp(reqbod);
  document.getElementById('loginModal').style.display = 'none';
}



function fetchSignUp(reqbod){

  fetch("http://localhost:8082/signup",{
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body:JSON.stringify(reqbod)

  })
  .then(res => res.text())
  .then(data=>{
    alert(`Your account status related to ${reqbod.email} is -> ${data}`);

    console.log(data);

  })
}




// Show the relevant section based on navigation
function showSection(sectionId) {

  document.querySelectorAll("section").forEach(section => {
    section.style.display = "none";
  });

  document.getElementById(sectionId).style.display = "block";

  if (sectionId === "hist") {
    fetchHistory();
  }
}

var b=false;
function loginHandler(){
    b=!b;
    var signIn=document.getElementsByClassName('signIn');
    signIn[0].style.display=b?'block':'none';
    var loginHand=document.getElementById('loginHand');
    loginHand.innerHTML=b?'SignUp':'SignIn';

    var signUp=document.getElementsByClassName('signUp');
    signUp[0].style.display=(!b)?'block':'none';
   
}

// Event Listener for BMI Calculation
  document.getElementById("calculateBtn").addEventListener("click", function () {
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const heightUnit = document.getElementById("heightUnit").value;
    const weightUnit = document.getElementById("weightUnit").value;
    const email=fetchemail;

    if(email == null){
      alert("Please SignIn First to Calculate BMI");
    }

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        alert("Please enter valid positive numbers for height and weight.");
        return;
    }

    

    // Create request payload
    const requestData = {
        email,
        height,
        weight,
        heightUnit,
        weightUnit
    };

    // Send API request to the server ?height=${height}&weight=${weight}
    fetch(`http://localhost:8082/calculate-bmi`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body:JSON.stringify(requestData)
    })

    .then(response => response.json())
    .then(data => {
        console.log(data);
        const  bmi = data; //Object Destructuring

        // Display BMI
        const bmiResultElement = document.getElementById("bmiResult");
        if (bmi < 18.5) {
            bmiResultElement.value = `You BMI Value - ${Math.round(bmi)}`;
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            bmiResultElement.value = `You BMI Value - ${Math.round(bmi)}`;
        } else {
            bmiResultElement.value = `You BMI Value - ${Math.round(bmi)}`;
        }

        // Update history
        // const history = document.getElementById("bmiHistory");
        // const noHistoryMessage = document.getElementById('noHistoryMessage');
      
        // const newHistory = document.createElement('p');
        // newHistory.innerHTML="";
        // newHistory.textContent = `Height: ${height} ${heightUnit}, Weight: ${weight} ${weightUnit}, BMI: ${bmivalue}`;
        // noHistoryMessage.innerHTML = "";
        // noHistoryMessage.textContent = "";
        // history.appendChild(newHistory);


    })
    .catch(error => {
        console.error("Error calling BMI API:", error);
        alert("Failed to calculate BMI. Please try again later.");
    });


});




function fetchHistory() {


    const Uemail=fetchemail;
    fetch(`http://localhost:8082/history/${Uemail}`,{
      method:'GET',
      headers:{
        "Content-Type":"application/json"
      },
    })
    .then(response=>response.json())
    .then(data=>{
      console.log(data);
      // const{height,weight,heightUnit,weightUnit} = data[];



      const history = document.getElementById("bmiHistory");
        // const noHistoryMessage = document.getElementById('noHistoryMessage');
      history.textContent=`User: ${Uemail?Uemail:"Please SignIn To view your History"}`;
        
      for(const i of data){

        const newHistory = document.createElement('p');
        newHistory.innerHTML="";
        newHistory.textContent = `Height: ${i.info.height} ${i.info.heightUnit}, Weight: ${i.info.weight} ${i.info.weightUnit}, BMI: ${i.bmi}`;
        
        history.appendChild(newHistory);
      }
      
    


      
    })

  
  
}
  

// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>BMI Calculator</title>
//     <link rel="stylesheet" href="styles.css">
//     <script src="scrip.js" defer></script>
//     <style>
//         .head{
//             font-family:'Rogue korner';
//             font-weight: bolder;
//             color: #1c6434;
//             font-size:50px;
//             font-family: "Underdog", system-ui;
//             font-weight: 400;
//             font-style: normal;
//         }
//     </style>
// </head>
// <body>
//     <!-- Navigation Bar -->
//     <header>
//         <nav class="navbar">
//             <ul>
//                 <li><a href="#home" onclick="showSection('home')">Home</a></li>
//                 <li><a href="#information" onclick="showSection('information')">Information</a></li>
//                 <li><a href="#bmi" onclick="showSection('bmi')">Know your BMI</a></li>
//                 <li><a href="#tips" onclick="showSection('tips')">Tips</a></li>
//                 <li><a href="#history" onclick="showSection('hist')">History</a></li>
//             </ul>
//         </nav>
//     </header>

//     <!-- Login Modal -->
//     <div id="loginModal" class="modal">
//         <div class="modal-content">
//             <span class="close" id="closeModal">&times;</span>
//             <div id="authOptions">
//                 <!-- Sign In Form -->
//                 <button  id='loginHand' onclick="loginHandler()" >SignIn</button>
              
//                 <div id="signInForm" class='signIn' >
//                     <h2>Sign In</h2>
//                     <label for="signInEmail">Email:</label>
//                     <input type="email" id="signInEmail" placeholder="Enter your email" required>
//                     <label for="signInPassword">Password:</label>
//                     <input type="password" id="signInPassword" placeholder="Enter your password" required>
//                     <button onclick="handleSignIn()">Sign In</button>
//                 </div>
              
//                 <!-- Sign Up Form -->
//                 <div id="signUpForm" class='signUp' >
//                     <h2>Sign Up</h2>
//                     <label for="signUpEmail">Email:</label>
//                     <input type="email" id="signUpEmail" placeholder="Enter your email" required>
//                     <label for="signUpPassword">Password:</label>
//                     <input type="password" id="signUpPassword" placeholder="Enter your password" required>
//                     <label for="confirmPassword">Confirm Password:</label>
//                     <input type="password" id="confirmPassword" placeholder="Re-enter your password" required>
//                     <button onclick="handleSignUp()">Sign Up</button>
//                 </div>
//             </div>
//         </div>
//     </div>

//     <!-- Main Content -->
//     <main>
//         <!-- Enhanced Home Section -->
//         <section id="home" class="tab-content">
//             <h1 class="head">HEALTH CTRL+</h1>
//             <div class="intro">
//                 <p>Track your health with our easy-to-use BMI Calculator and embark on a journey towards a healthier lifestyle!</p>
//             </div>
            
//             <div class="fun-facts">
//                 <h3>Did You Know?</h3>
//                 <ul>
//                     <li>Adults with a BMI between 18.5 and 24.9 are generally considered to have a healthy weight.</li>
//                     <li>Regular exercise and hydration improve your overall BMI score.</li>
//                     <li>BMI is just one measure of health; it’s important to consider other factors too.</li>
//                 </ul>
//             </div>
//             <button onclick="openModal()">Sign In / Sign Up</button>
//             <div class="quote-container">
//                 <p id="quoteOfTheDay"></p>
//             </div>
//         </section>

//         <!-- BMI Calculator Section -->
//         <section id="bmi" class="tab-content" style="display:none;">
//             <div class="container" style='width:50%; '>
//       <h1 class="heat">BMI Calculator</h1>

//       <!-- Height Input -->
//       <div class="input-group">
//         <label for="height">Height:</label>
//         <select id="heightUnit">
//           <option value="cm">Centimeters (cm)</option>
//           <option value="in">Inches (in)</option>
//         </select>
//         <input type="number" id="height" placeholder="Enter height" required />
//       </div>

//       <!-- Weight Input -->
//       <div class="input-group">
//         <label for="weight">Weight:</label>
//         <select id="weightUnit">
//           <option value="kg">Kilograms (kg)</option>
//           <option value="lb">Pounds (lb)</option>
//         </select>
//         <input type="number" id="weight" placeholder="Enter weight" required />
//       </div>

//       <!-- Calculate Button -->
//       <button id="calculateBtn">Calculate BMI</button>

//       <!-- BMI Output -->

//            <div class="result-group">
//              <label for="bmiResult">Your BMI:</label>
//              <input type="text" id="bmiResult" readonly />
//            </div>

//       <!-- Observation Output -->
//       <!-- <div class="health-meter">
//         <canvas id="healthSpeedometer" width="300" height="150"></canvas>
//         </div> -->
//     </div>
   
//         </section>

//         <!-- Information Section -->
//         <section id="information" class="tab-content" style="display:none;">
//             <h2>About BMI</h2>
//             <p>BMI is a medical screening tool that measures the ratio of your height to your weight to estimate the amount of body fat you have. It helps understand how body fat impacts health and aids conversations with healthcare providers about reducing disease risks and improving wellness.</p>
//             <h3>How BMI is measured</h3>
//             <div class="formula-container">
//                 <p id="formula1">BMI = (Weight (lb) / [Height (in)]² × 703)</p> <br>
//                 <p id="formula2">BMI = (Weight (kg) / [Height (m)]²)</p>
//             </div>
//             <h3>BMI Categories (Adults):</h3>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>BMI Measurement</th>
//                         <th>Weight Category</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Below 18.5</td>
//                         <td>Underweight</td>
//                     </tr>
//                     <tr>
//                         <td>18.5 – 24.9</td>
//                         <td>Normal weight</td>
//                     </tr>
//                     <tr>
//                         <td>25.0 – 29.9</td>
//                         <td>Overweight</td>
//                     </tr>
//                     <tr>
//                         <td>30.0 – 34.9</td>
//                         <td>Obese (Class I)</td>
//                     </tr>
//                     <tr>
//                         <td>35.0 – 39.9</td>
//                         <td>Obese (Class II)</td>
//                     </tr>
//                     <tr>
//                         <td>40+</td>
//                         <td>Obese (Class III)</td>
//                     </tr>
//                 </tbody>
//             </table>
//         </section>

//         <!-- Tips Section -->
//         <section id="tips" class="tab-content" style="display:none;">
//             <h2>Health Tips for Maintaining a Healthy BMI</h2>
//             <ol>
//                 <li>Exercise regularly—aim for 150 minutes of activity weekly.</li>
//                 <li>Stay hydrated—drink water to regulate appetite and metabolism.</li>
//                 <li>Cut out processed foods—focus on nutrient-dense options.</li>
//                 <li>Get sufficient sleep—aim for seven or more hours each night.</li>
//                 <li>Maintain a well-balanced diet—fruits, vegetables, lean protein, and whole grains.</li>
//                 <li>Get an accurate BMI reading through a healthcare provider.</li>
//                 <li>Monitor daily movement—track activities with fitness devices.</li>
//                 <li>Practice portion control—use smaller plates to avoid overeating.</li>
//                 <li>Limit added sugars and unhealthy fats in meals.</li>
//                 <li>Keep a log of what is and isn’t working to refine habits.</li>
//             </ol>
//         </section>

//         <!-- History Section -->
//         <section id="hist" class="tab-content" style="display:none;">
//             <h2>History</h2>
//             <div id="bmiHistory">
//                 <p  id="noHistoryMessage">No history available.</p>
//             </div>
//         </section>
//     </main>
// </body>
// </html>


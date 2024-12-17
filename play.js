// Elementy
const yacht = document.getElementById("yacht");
const yachtDirectionLabel = document.getElementById("yacht-direction");
const windDirectionLabel = document.getElementById("wind-direction");
const sailingCourseLabel = document.getElementById("sailing-course");
const yachtIcon = document.getElementById("yacht");
let currentSpeed = 0; // Aktualna prędkość jachtu
const speedChangeRate = 0.025; //0.1 Wartość zmiany prędkości na klatkę (0-1)


// Początkowa pozycja, rotacja i prędkość
let position = { x: 250, y: 250 };
let rotation = 0; // Kąt łódki początkowy
const maxSpeed = 3; // Maksymalna prędkość (z wiatrem)
const minSpeed = 0; // Minimalna prędkość (pod wiatr)
const rotationStep = 5; // Krok rotacji w stopniach
const deadAngle = 10; // Kąt martwy 

// Kierunek wiatru (losowy na starcie)
const windDirection = Math.floor(Math.random() * 360);
windDirectionLabel.textContent = windDirection;


// Funkcja aktualizująca pozycję i rotację łódki
function updatePosition() {
    yacht.style.transform = `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`;
    yachtDirectionLabel.textContent = rotation;
}
//Sprawdzam kierunek wiatru
//@returns {string} L||R (L -left || R - right)
function checkWindDirection(){
    //windDirection - kierunek wiatru (punkt 0)
    //rotation - kąt łódki
    let fromWind = rotation;
    let toWind = (rotation+180>360)?rotation+180-360:rotation+180;
    let wind ='';
    if(toWind<fromWind){
        wind = (windDirection>=fromWind || windDirection<toWind)?'R':'L';
    }else{
        wind = (windDirection>=fromWind && windDirection<toWind)?'R':'L';
    } 
    console.log(`wiatr:${windDirection},lodz:${rotation},${wind},${currentSpeed.toFixed(2)}`);
    return wind;
}
// Obliczanie prędkości na podstawie kąta łódki względem wiatru
function calculateSpeed() { 
    let relativeAngle = Math.abs((rotation - windDirection + 360) % 360);

    let foo = relativeAngle;
    if (relativeAngle >= 180) foo = Math.abs(relativeAngle - 360);

    if (Math.abs(foo) <= deadAngle) {
        return minSpeed; // Brak ruchu w martwym kącie
    } else if (Math.abs(foo) > deadAngle && Math.abs(foo) <= 45) {
        return maxSpeed*0.2; // bajdewind - wiatr od boku ale bardziej z przodu
    } else if (Math.abs(foo) > 45 && Math.abs(foo) <= 90) {
        return maxSpeed*0.5; //polwiatr - wiatr od boku
    } else if (Math.abs(foo) > 90 && Math.abs(foo) <= 135) {
        return maxSpeed*0.8 // baksztag - wiatr od boku ale bardziej z tylu
    } else if (Math.abs(foo) > 135 && Math.abs(foo) <= 180) {
        return maxSpeed; // fordewind - wiatr w plecy
    } else {
        return minSpeed; // Wciąż brak ruchu w tym przypadku
    }
}

// Funkcja wyświetlająca nazwę kursu oraz kąt względem wiatru
function updateSailingCourse() {
    let relativeAngle = Math.abs((rotation - windDirection + 360) % 360);
    
    let foo = relativeAngle;
    if (relativeAngle >= 180) foo = Math.abs(relativeAngle - 360);
    
    let courseName = "";
    let direction  = checkWindDirection();
    if (Math.abs(foo) <= deadAngle) {
        courseName = "Kąt martwy"; // Brak ruchu w martwym kącie
        yachtIcon.src = "yacht_lopot.jpg";
    } else if (Math.abs(foo) > deadAngle && Math.abs(foo) <= 45) {
        // Wiatr od boku, ale bardziej z przodu
        if (direction === "R"){
            courseName = `Bajdewind prawego halsu`;
            yachtIcon.src = "yacht_prawy.jpg";
        }
        else {
            courseName = `Bajdewind lewego halsu`;
            yachtIcon.src = "yacht_lewy.jpg";
        }  
    } else if (Math.abs(foo) > 45 && Math.abs(foo) <= 90) {
        // Wiatr od boku
        if (direction === "R"){
            courseName = `Półwiatr prawego halsu`;
            yachtIcon.src = "yacht_prawy.jpg";
        }
        else {
            courseName = `Półwiatr lewego halsu`;
            yachtIcon.src = "yacht_lewy.jpg";
        } 
    } else if (Math.abs(foo) > 90 && Math.abs(foo) <= 135) {
        // Wiatr od boku, ale bardziej z tyłu
        if (direction === "R"){
            courseName = `Baksztag prawego halsu`;
            yachtIcon.src = "yacht_prawy.jpg";
        }
        else {
            courseName = `Baksztag lewego halsu`;
            yachtIcon.src = "yacht_lewy.jpg";
        }
    } else if (Math.abs(foo) > 135 && Math.abs(foo) <= 180) {
        // Wiatr w plecy
        if (direction === "R"){
            courseName = `Fordewind prawego halsu`;
            yachtIcon.src = "yacht_prawy.jpg";
        }
        else {
            courseName = `Fordewind lewego halsu`;
            yachtIcon.src = "yacht_lewy.jpg";
        }
    } else {
        courseName = "Kąt martwy"; // Wciąż brak ruchu w tym przypadku
        yachtIcon.src = "yacht_lopot.jpg";
    }

    // Wyświetlanie kursu i kąta względem wiatru
    sailingCourseLabel.textContent = `${courseName} ( ${relativeAngle.toFixed(1)}°) ${foo}`;
}

// Funkcja przesuwająca łódkę do przodu
function moveForward() {
    const targetSpeed = calculateSpeed(); // Prędkość docelowa
    if (Math.abs(currentSpeed - targetSpeed) > speedChangeRate) {
        // Stopniowa zmiana prędkości
        if (currentSpeed < targetSpeed) {
            currentSpeed += speedChangeRate; // Przyspieszanie
        } else {
            currentSpeed -= speedChangeRate; // Zwolnienie
        }
    } else {
        currentSpeed = targetSpeed; // Ustalenie prędkości docelowej
    }

    if (currentSpeed === 0) return; // Brak ruchu

    const angleInRadians = (rotation * Math.PI) / 180;

    position.x += currentSpeed * Math.cos(angleInRadians);
    position.y += currentSpeed * Math.sin(angleInRadians);

    // Zapobieganie wyjściu poza kontener
    if (position.x < 0) position.x = 0;
    if (position.y < 0) position.y = 0;
    if (position.x + yacht.offsetWidth > container.offsetWidth) {
        position.x = container.offsetWidth - yacht.offsetWidth;
    }
    if (position.y + yacht.offsetHeight > container.offsetHeight) {
        position.y = container.offsetHeight - yacht.offsetHeight;
    }

    updatePosition();
    updateSailingCourse();
}

// Obsługa klawiszy do zmiany kierunku
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") rotation -= rotationStep;
    if (event.key === "ArrowRight") rotation += rotationStep;

    // Normalizowanie kąta (0–360°)
    rotation = (rotation + 360) % 360;
    updatePosition();
    updateSailingCourse(); // Uaktualnienie nazwy kursu po zmianie kierunku
});

// Pobranie elementu strzałki wiatru
const windArrow = document.getElementById("wind-arrow");

// Ustawienie strzałki wiatru zgodnie z kierunkiem
function updateWindArrow() {
    windArrow.style.transform = `rotate(${windDirection+180}deg)`;
}

// Wywołanie funkcji po załadowaniu strony
updateWindArrow();

// Inicjalizacja pozycji
updatePosition();

// Animacja płynącego jachtu
setInterval(moveForward, 50); 
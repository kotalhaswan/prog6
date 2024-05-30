/**
 * Startcode mini-case 2: Bouw je eigen useState() functie
 */
const useState = (initialValue)=>{
    let value = initialValue;

    const getValue = () => {
        return value;
    }
    const setValue = (newValue) =>{
        if (typeof newValue === "function"){
            value = newValue(value);
        }
        else{
            value = newValue;
        }
    }

    return [getValue, setValue];
}
const [counter, setCounter] = useState(0);

// const [year, setYear] = useState(2007);
// const [favorites, setFavorites] = useState(['Programming', 'Board Games']);
// console.log(year()); //2007
// console.log(favorites()); //['Programming', 'Board Games']
//
// setYear(2020);
// console.log(year()); //2020
//
// setFavorites(['Programming', 'Board Games', 'Tennis']);
// console.log(favorites()); //['Programming', 'Board Games', 'Tennis']
//
//Opdracht 1 is een waarde meegeven om te updaten
setCounter(10);
//Counter als functie ipv variabele is (iets) makkelijker
console.log(counter());

//Opdracht 2 is dat je een functie meegeeft om te updaten
setCounter((oldCounter) => oldCounter + 1);
//In dit geval zou de waarde nu dus 11 moeten zijn
console.log(counter());

//Opdracht 3: Als dit is gelukt ga je naar de laatste fase
//Hierin wil je counter als variabele aanroepen i.p.v. als functie
console.log(counter());
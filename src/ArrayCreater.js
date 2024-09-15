const createRandomArray = () => {

    let randRowIndex = Math.floor(Math.random() * 4);
    let randColIndex = Math.floor(Math.random() * 4);
    
    let rows = 4;
    let cols = 4;
    let numbersArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    
    const fieldArray = new Array(4);
    
    for(let i = 0; i < rows; i++){
        fieldArray[i] = new Array(cols);
        for(let j = 0; j < cols; j++){
            if(i === randRowIndex && j === randColIndex){
                //continue;
                fieldArray[i][j] = '';
            }
            else{
                let randomIndex = Math.floor(Math.random() * numbersArray.length);
                let value = numbersArray[randomIndex]
                fieldArray[i][j] = value;
                numbersArray = numbersArray.filter(el => el !== value);
            }
        }
    };

    return fieldArray;
}

export default createRandomArray;
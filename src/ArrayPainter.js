import React, { useEffect, useRef, useState } from "react"
import createRandomArray from "./ArrayCreater";

const ShowArray = () => {

    // хук для обновления массива
    const [array, setArray] = useState(createRandomArray);

    // хуки для обновления выбранных фишек
    const [firstIndexes, setfirstIndexes] = useState(null);
    const [secondtIndexes, setsecondtIndexes] = useState(null);

    // хук для обновления цвета бордера фишки
    const [firstBorderColor, setFirstBorderColor] = useState("");

    // хук для обновления состояния времени
    const [time, setTime] = useState("")

    // ссылки на input и button
    const timerRef = useRef(null);
    const startButton = useRef(null);

    // логика обратного отсчёта времени
    const updateTime = () => {
        if (timerRef.current.value && timerRef.current.value !== "00:00:00") {
            let [hours, minutes, seconds] = timerRef.current.value.split(":").map(Number);
            let selectedTime = new Date(2000, 0, 1, hours, minutes, seconds);

            startButton.current.disabled = true;
            timerRef.current.disabled = true;
            console.dir(timerRef.current);

            let interval = setInterval(() => {

                selectedTime.setSeconds(selectedTime.getSeconds() - 1);
                setTime(selectedTime.toLocaleTimeString());


                if (selectedTime.toLocaleTimeString() === "00:00:00") {
                    startButton.current.disabled = false;
                    timerRef.current.disabled = false;
                    clearInterval(interval);

                    if (checkArray()) {
                        alert("You won!");
                    }
                    else {
                        alert("You lose!");
                        setArray(createRandomArray);
                    }
                }
            }, 1000);
        }
    }

    // обновление времени в input-е
    useEffect(() => {
        if (time !== "") {
            timerRef.current.value = time;
        }
    }, [time])

    // перерисовка массива после выбора двух фишек
    const updateArray = () => {
        let firstValue = array[firstIndexes.i][firstIndexes.j];
        let secondValue = array[secondtIndexes.i][secondtIndexes.j];
        let copyArray = array.map(row => [...row]);

        copyArray[secondtIndexes.i][secondtIndexes.j] = firstValue;
        copyArray[firstIndexes.i][firstIndexes.j] = secondValue;
        setArray(copyArray);
        // проверка выиграша после перестановки фишек
        setTimeout(() => {
            if (checkArray()) {
                alert("You won!");
                setArray(createRandomArray);
            }
        }, 200)
    }

    // проверка массива на выиграш
    const checkArray = () => {
        let iterator = 1;
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                if (array[i][j] === iterator) {
                    if (iterator < 15) {
                        iterator++;
                    }
                }
                else if (iterator === 15 && array[i][j] === "") {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        return false;
    }


    // обнуление выбранных фишек и обновление массива
    useEffect(() => {
        if (firstIndexes && secondtIndexes) {
            updateArray();
            setfirstIndexes(null);
            setsecondtIndexes(null);

        }
    }, [firstIndexes, secondtIndexes]);

    // логика для выбора фишек
    const selectTheDiv = (i, j) => {
        // выделение первого блока 
        if (firstIndexes == null) {
            // если выбран пустой блок
            if (array[i][j] === "") {
                return;
            }

            setfirstIndexes({ i, j });
            setFirstBorderColor("border-warning bg-secondary");
        }
        else {
            if (i === firstIndexes.i && j === firstIndexes.j) {
                setfirstIndexes(null);
                setFirstBorderColor("");
            }
            else {
                // выделение второго блока 
                if (secondtIndexes === null) {
                    if (array[i][j] === "") {
                        // закомментируйте блоки if else для упрощения игры
                        // они отвечают за выбор фишек с произвольного места
                        if (i === firstIndexes.i) {
                            if (!(j === firstIndexes.j - 1 || j === firstIndexes.j + 1)) {
                                return;
                            }
                        }
                        else {
                            if (!(i === firstIndexes.i - 1 || i === firstIndexes.i + 1) || j !== firstIndexes.j) {
                                return
                            }
                        }
                        setsecondtIndexes({ i, j });
                    }
                    else {
                        setfirstIndexes(null);
                        setFirstBorderColor("");
                        setfirstIndexes({ i, j });
                        setFirstBorderColor("border-warning bg-secondary");
                    }
                }
            }
        }
    }

    return (
        <>
            {/* таймер и кнопка */}
            <div >
                <label htmlFor="timer" className="form-label text-white mb-1">Timer</label>
                <div className="d-flex mb-3">
                    <input type="time" id="timer" step={1} ref={timerRef} className="form-control me-3" />
                    <button className="btn btn-warning" ref={startButton} onClick={() => updateTime()}>Start</button>
                </div>
            </div>

            {/* игровое поле */}
            <div className="border rounded px-3 py-1">
                {
                    array.map((row, rowIndex) => (
                        <div key={rowIndex} className="row justify-content-center">
                            {row.map((el, colIndex) => (
                                <div
                                    key={colIndex}
                                    className={`col d-flex justify-content-center align-items-center m-1
                                                ${el === "" ? "" : "border rounded"}
                                                ${(firstIndexes != null && firstIndexes.i === rowIndex && firstIndexes.j === colIndex) ? firstBorderColor : ""}`}
                                    style={{
                                        height: "80px",
                                        width: "80px",
                                        backgroundColor: el === "" ? "transparent" : "#3C3C3C"
                                    }}
                                    onClick={() => selectTheDiv(rowIndex, colIndex)}>
                                    <h3 className="m-0 p-0 text-warning" style={{ cursor: "default" }}>{el}</h3>
                                </div>
                            ))}
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default ShowArray;
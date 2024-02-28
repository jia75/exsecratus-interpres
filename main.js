const tapeLength = 128;

function cleanCode(code) {
    return code.replace(/[^><\[\],\.\+\-_]/g,"");
}

function interpret(code, textInput, mainMemory=Array(tapeLength).fill(0), pointer=0, textInputIndex = 0) {
    let cleanedCode = cleanCode(code);

    let instructionArray = cleanedCode.split("");

    for (let instructionIndex = 0; instructionIndex < instructionArray.length; instructionIndex++) {
        let instruction = instructionArray[instructionIndex];
        if (instruction == "<") {
            if (pointer == 0) {
                throw new Error('Pointer cannot go under 0 (at '+instructionIndex+')');
            }
            pointer--;
            continue;
        }
        if (instruction == ">") {
            if (pointer == tapeLength - 1) {
                throw new Error('Pointer cannot go over tapeLength (at '+instructionIndex+')');
            }
            pointer++;
            continue;
        }
        if (instruction == "+") {
            if (mainMemory[pointer] == 255) {
                mainMemory[pointer] = 0;
                continue;
            }
            mainMemory[pointer]++;
            continue;
        }
        if (instruction == "-") {
            if (mainMemory[pointer] == 0) {
                mainMemory[pointer] = 255;
                continue;
            }
            mainMemory[pointer]--;
            continue;
        }
        /*if (instruction == "]") {
            throw new Error('Closing unopened loop');
        }*/
        if (instruction == "[") {
            let loopedCode = "";
            let originalPointer = pointer;
            instructionIndex++;
            let loopDepth = 1; // Track nested loops
            while (instructionIndex < instructionArray.length) {
                if (instructionArray[instructionIndex] == "[") {
                    loopDepth++;
                } else if (instructionArray[instructionIndex] == "]") {
                    loopDepth--;
                }
                if (loopDepth == 0) {
                    break;
                }
                loopedCode += instructionArray[instructionIndex];
                instructionIndex++;
            }
        
            while (mainMemory[originalPointer] != 0) {
                pointer = interpret(loopedCode, textInput, mainMemory, pointer, textInputIndex);
            }
            continue;
        }
        if (instruction == ".") {
            console.log(mainMemory[pointer]);
        }
        if (instruction == ",") {
            let input = textInput[textInputIndex];
            textInputIndex++;
            if (input.isString) {
                throw new Error('Invalid input');
            }
            if (input < 256 && input > -1) {
                mainMemory[pointer] = input;
            } else {throw new Error('Invalid input');}
        }
        if (instruction == "_") {
            console.log(mainMemory);
        }
    }
    return pointer;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
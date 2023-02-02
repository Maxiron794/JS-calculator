last = ""
const num_array = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
const b_array = ["(", ")"]
const oper_array = ["/", "*", "+", "-"]
const solv_keys = ["Enter", "Equal", "NumpadEnter"]

function load(){
    clear()

    const last_element = document.getElementById("last")

    last_element.addEventListener('animationend', () => {
        document.getElementById("last").classList.remove("slide")
        document.getElementById("window").classList.add("ani1")
    });


    const shake_element = document.getElementById("output")

    shake_element.addEventListener("animationend", function(event) {
        document.getElementById("output").classList.remove("shake")
    })
}

function clear(){
    num = ""
    numpr = ['']
    operpr = []
    output = ""
    loop = 0
    draw()
}

function clear_CA(){
    clear()
}

//key events
document.addEventListener("keypress", function(event) {
    let key = event.key
    let code = event.code

    if(num_array.concat(["."]).includes(key)){
        add_text(key)
    } else if (solv_keys.includes(code)){
        solv()
    } else if (oper_array.includes(key)){
        add_op(key)
    } else if (code == "KeyQ"){
        clear_CA()
    } else if (code == "KeyE"){
        clear_C()
    } else if (key == "("){
        add_loop()
    } else if (key == ")"){
        dec_loop()
    }
});

//draws top part
function draw_last(){
    let last_el = document.getElementById("last")
    if(last != last_el.innerHTML){
        if(last_el.innerHTML != ""){
            last_animation()
        }
        last_el.innerHTML = last
        
    }
}

//draws black-colored part
function draw(){
    let part = output
    document.getElementById("window").innerHTML = part
}

//draws expresion string from array of numbers and array of operands
function create_expr(array_of_num, array_of_oper){
    let text = ""

    let cache_num = [].concat(array_of_num);
    let cache_oper = [].concat(array_of_oper);

    let text_A = []
    let text_B = []

    let cache_cache_oper = []
    let cache_cache_num = []

    for(let i = 0; i < cache_oper.length; i++){
        op = cache_oper[i]
        console.log(op)
        if(typeof(op) == "object"){
            cache_cache_oper.push(op)
        } else {
            text_B.push(" " + op + " ")
        }
    }

    for(let i = 0; i < cache_num.length; i++){
        num = cache_num[i]
        if(typeof(num) == "object"){
            cache_cache_num.push(num)
        } else {
            text_A[i] = num
        }
    }

    console.log(text_A, text_B)

    let iterations = cache_cache_num.length


    for(let i = 0; i < iterations; i++){
        console.log(cache_cache_num[0] + "", cache_cache_oper[0] + "")
        text_A[cache_num.indexOf(cache_cache_num[0])] = "(" + create_expr(cache_cache_num[0], cache_cache_oper[0]) + ")"
        cache_cache_num.splice(0, 1)
        cache_cache_oper.splice(0, 1)
    }

    console.log(text_A, text_B)

    if(text_A.length > 1){
        for(let i = 0; i < text_B.length; i++){
            text += text_A[i] + text_B[i]
        }
    }    

    text += text_A[text_A.length - 1].toString()
    return text
}

function add_text(text){
    if(
        (num_array.includes(text) && num.length >= 7 && !num.includes(".")) ||
        (num_array.includes(text) && num.length >= 11 ) ||
        (!num_array.includes(text) && num == "-") ||
        (text == "0" && parseFloat(lastOf(numpr)) == 0 && !num.includes(".")) ||
        (text == "." && lastOf(numpr).toString() == "") ||
        (text == "." && num.includes(".")) ||
        (typeof(get_data(numpr, loop)) == "object")
    ){
        shake()
    }else if(num == "-"){
        change_data(parseFloat(num + text), numpr, loop)
        output += text
        num += text
    }else if(text == "."){
        change_data(parseFloat(num), numpr, loop)
        output += text
        num += text
    } else if (text != "."){
        output += text
        num += text
        if (num.includes(".")){
            change_data(parseFloat(num), numpr, loop)
        } else {
            change_data(parseFloat("" + lastOf(numpr) + text), numpr, loop)
        }
        
    }


    draw()
}

function add_b(text){
    output += text
    draw()
}

function add_op(op){
    if (
        (lastOf(operpr) == "/" && lastOf(num) == 0) ||
        (lastOf(operpr) == "-" && op == "-") ||
        (num == "-" && op == "-")
    ){
        shake()
        return
    } else if (lastOf(numpr).toString() == "" && lastOf(operpr) != "-" && op == "-"){
        console.log("add!")
        output += "-"
        num = "-"
    } else if(lastOf(numpr).toString() != ""){
        add_data("", numpr, loop)
        output += " " + op + " "
        console.log(op, operpr, loop)
        add_data(op, operpr, loop)
        num = ""
    } else if(lastOf(numpr).toString == "" && num != "-" && lastOf(operpr) != op && lastOf(operpr) != undefined){
        output = output.substr(0, output.length - 2)
        output += op + " "
        change_data(op, operpr, loop)
    } else {
        shake()
        return
    }
    draw()
}

//prepares data for solv2() and checks conditions
function solv(){
    let approved = true 

    let spread_numpr = spreadList(numpr) 
    let spread_operpr = spreadList(operpr)
    for(let i = 0; i < spread_operpr.length; i++){
        if(spread_numpr[i + 1] == 0 && spread_operpr[i] == "/"){
            approved = false
        }
    }

    if(approved && lastOf(numpr).toString() != "" && spreadList(numpr).length >= 2 && (spreadList(operpr).length == spreadList(numpr).length - 1)){
        let berpr = solv2(numpr, operpr)
        numpr = [berpr["answer"]]
        num = berpr["answer"].toLocaleString('fullwide', { useGrouping: false })
        operpr = []
        loop = 0
        output = berpr["answer"].toLocaleString('fullwide', { useGrouping: false })
        last = berpr["last"]
        draw()
        draw_last()
    } else {
        shake()
    }
} 

//solves expresions second iteration, can work with numbers in arrays
function solv2(array_of_num, array_of_oper){
    let last = create_expr(array_of_num, array_of_oper) + " = "    

    for(let k = 0; k < array_of_num.length; k++){
        if(typeof(array_of_num[k]) == "object"){
            let ber = solv2(array_of_num[k], array_of_oper[k])
            array_of_num[k] = ber["answer"]
            array_of_oper.splice(k, 1)
            console.log(array_of_num, array_of_oper)
        }
    }

    while(array_of_oper.includes("*") || array_of_oper.includes("/")){
        if(array_of_oper.includes("*")){
            let i = array_of_oper.indexOf("*")
            array_of_num[i] *= array_of_num[i+1]
            array_of_oper.splice(i, 1) 
            array_of_num.splice(i + 1, 1)
        } else if(array_of_oper.includes("/")){
            let i = array_of_oper.indexOf("/")
            array_of_num[i] /= array_of_num[i+1]
            array_of_oper.splice(i, 1) 
            array_of_num.splice(i+1, 1)
        }        
    }

    let answer = 0
    answer += array_of_num[0]

    for(let i = 0; i < array_of_oper.length; i++){
        if(array_of_oper[i] == "+"){
            answer += array_of_num[i + 1]

        } else if(array_of_oper[i] == "-"){
            answer -= array_of_num[i + 1]
        }        
    }

    last += answer

    return({"answer":answer, "last":last})

}

//useful to work with list in list arrays
function add_data(data, array, loop){
    
    if(array == undefined){
        array = []
    }

    // loop == 0 data == "+" or 4 => add data to array

    // loop more than 1 ==> 
    // // array length == 0, array was defined in function
    // // array length == 1, "array" is one element not a list
    // // array length >= 2, "array" is a list, so add_data to it

    console.log(array, loop)

    if(loop == 0){
        array.push(data)
    } else if(loop >= 1){
        be_loop  = loop - 1
        if(array.length == 0){
            console.log("if 0")
            array[0] = add_data(data, array[0], be_loop)
        } else if(array.length == 1){
            console.log("if 1")
            if(typeof(array[0]) == "object"){
                array[0] = add_data(data, array[0], be_loop)
            } else {
                array[1] = add_data(data, array[1], be_loop)
            }
        } else if (array.length > 1){
            console.log("if 2")
            if(typeof(array[array.length - 1]) == "object"){
                console.log("0")
                array[array.length - 1] = add_data(data, array[array.length - 1], be_loop)
            } else {
                console.log("1")
                array[array.length] = add_data(data, array[array.length], be_loop)
            }

            
        }
    }

    return array
}

function delete_data(array, loop){
    // loop == 0, so delete

    // loop more than 1 ==> 
    // // array length == 0, "array" is one element not a list
    // // array length >= 1, "array" is a list, so add_data to it

    if(loop == 0){
        array.splice(array.length-1, 1)
    } else if(loop >= 1){
        be_loop  = loop - 1
        if(array.length == 1){
            array[0] = delete_data(array[0], be_loop)
        } else if (array.length > 1){
            array[array.length - 1] = delete_data(array[array.length - 1], be_loop)
        }
    }

    return array
}

function change_data(new_data, array, loop){
    //changes last element
    delete_data(array, loop)
    add_data(new_data, array, loop)
}

function get_data(array, loop){
    if(loop == 0){
        data = array[array.length - 1]
    } else if(loop >= 1){
        be_loop  = loop - 1
        data = get_data(array[array.length - 1], be_loop)
    }

    return data
}

//works with loop system(add or remove ()-level)
function add_loop(){
    if((spreadList(numpr).length - 1 == spreadList(operpr).length) && (lastOf(numpr) == "")){
        delete_data(numpr, loop)
        add_data([""], numpr, loop)
        loop += 1
        
        add_b("(")
    } else{
        shake()
    }
}

function dec_loop(){
    if(loop >= 1 && get_data(numpr, loop - 1).length >= 2 && lastOf(numpr) != ""){
        loop -= 1
        add_b(")")
    } else{
        shake()
    }
    
}

//useful
function float(array){
    for(let i = 0; i < array.length; i++){
        if( typeof(array[i]) == "string"){
            array[i] = parseFloat(array[i])
        } else if( typeof(array[i]) == "object"){
            array[i] = float(array[i])
        }
    }

    return array
}

function lastOf(array){
    last_element = array[array.length - 1]
    if(typeof(last_element) == "object"){
        return lastOf(last_element)
    } else {
        return array[array.length - 1]
    }
}

function spreadList(array){
    let array_sp = []

    for(let element of array){
        if(typeof(element) == "number" || typeof(element) == "string"){
            array_sp.push(element)
        } else if (typeof(element) == "object"){
            array_sp = array_sp.concat(spreadList(element))
        }
    }

    return array_sp
    
}

// animations 
function shake(){
    document.getElementById("output").classList.add("shake")
}

function last_animation(){
    document.getElementById("last").classList.add("slide")
    document.getElementById("window").classList.remove("ani1")
}
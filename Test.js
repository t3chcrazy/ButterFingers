function calcFrequency(paragraph) {
    const paraArray = paragraph.split(" ")
    const resultObj = {}
    paraArray.forEach(word => {

        if (word) {
            if (resultObj.hasOwnProperty(word)) {
                resultObj[word] += 1
            }
            else {
                resultObj[word] = 1
            }
        }
    })
    return resultObj
}

function filterObj(resultObj) {
    const filteredObj = {}
    for (let key in resultObj) {
        const val = resultObj[key]
        if (val > 1) {
            filteredObj[key] = val
        }
    }
    return filteredObj
}

//console.log(calcFrequency("Although there are similarities between JavaScript and Java, including language name, syntax, and respective standard libraries, the two languages are distinct and differ greatly in design. "))
console.log(filterObj(calcFrequency("Java, Although there are similarities between JavaScript and Java, including language name, syntax, and respective standard libraries, the two languages are distinct and differ greatly in design. ")))
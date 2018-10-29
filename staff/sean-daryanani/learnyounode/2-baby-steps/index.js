// console.log(process.argv)

let sum = 0

// var arr = process.argv.slice(2)
// console.log(arr)

// arr.reduce((el, sum) => el+sum,0)

for (var i=2; i<process.argv.length; i++) {
    sum = Number(sum) + Number(process.argv[i])
}

console.log(sum)
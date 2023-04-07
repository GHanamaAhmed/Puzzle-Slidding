// const func = async () => {
//     const response = await window.versions.ping()
//     console.log(response) // prints out 'pong'
// }
// func()
let clos = document.getElementsByClassName("close")
clos[0].addEventListener("click", () => {
   window.versions.close()
})
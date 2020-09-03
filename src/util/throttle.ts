let isWaiting = false
export function throttle(f, time,arg) {
  if(!isWaiting){
    f(arg)
    isWaiting = true
    setTimeout(()=>{isWaiting=false}, time)
  }
}

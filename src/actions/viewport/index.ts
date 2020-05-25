export const viewport = {
  name: 'viewport',
  page: (emit) => {
    window.addEventListener('resize', (e)=>{
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      emit({
        size: [vw, vh],
        time: Date.now()
      })
    });

  },
  reduce(previousEvents, event){
    let prevEvent = previousEvents[previousEvents.length -1]
    if(prevEvent.name === 'mousemove' && (event.time - prevEvent.time)<=2000){
      previousEvents.pop()
      prevEvent = previousEvents[previousEvents.length -1]
    }
    if(prevEvent.name === 'viewport' ){
      return previousEvents.slice(0,-1).concat([event])
    }
    return previousEvents.concat([event])
  },
  generate(event){
    return `page.setViewportSize({
  width: ${event.size[0]},
  height: ${event.size[1]},
})`
  }
}
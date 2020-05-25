const MOUSEMOVE_INTERVAL = 1000
export const mousemove = {
  name: 'mousemove',
  page: (emit) => {
    const listener = window.document.addEventListener('mousemove', (e) => {
      const now = Date.now()
      emit({
        coords: [e.clientX, e.clientY],
        time: now
      });
    });
    return () =>{ 
      window.document.removeEventListener(listener)
    }
  },
  reduce: (previousEvents, event) => {
    /**@return Event[] */
    const previousEvent = previousEvents[previousEvents.length-1]
    if(!previousEvent){
      return [event]
    }
    if(previousEvent.name === 'mousemove'){
      return previousEvents.slice(0,-1).concat([{...event, time: previousEvent.time}])
    }
    return previousEvents.concat([event])
  },
  // handle 
  generate(event) {
    return `await page.mouse.move(${event.coords[0]},${event.coords[1]})`
  },
  play: (page) => {
    require('./showMousePointer').install(page);
  },
};

export default mousemove
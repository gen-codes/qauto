export const scroll = {
  name: 'scroll',
  page: (emit) => {
    const listener = window.document.addEventListener('scroll', (event) => {
      const now = Date.now()
      emit({
        coords: [window.pageXOffset, window.pageYOffset],
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
    if(previousEvent.name === 'scroll'){
      return previousEvents.slice(0,-1).concat([{...event, time: previousEvent.time}])
    }
    return previousEvents.concat([event])
  },
  // handle 
  generate(event) {
    return `await page.evaluate(()=>window.scrollTo(${event.coords[0]},${event.coords[1]}))`
  },
};

export default scroll
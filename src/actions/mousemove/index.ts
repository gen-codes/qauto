const MOUSEMOVE_INTERVAL = 1000
export const mousemove = {
  name: 'mousemove',
  page: (emit) => {
    const listener = window.document.addEventListener('mousemove', (e) => {
      const now = Date.now()
      emit({
        coords: [e.clientX, e.clientY],
        time: now,
        type: 'mousemove'
      });
    });
    return () =>{ 
      window.document.removeEventListener(listener)
    }
  },
  rereduce: (events) => {
    /**@return Event[] */
    let pass = -1
    return events.reduce((reduced, event, index, array)=>{
      if(index<=pass){
        return reduced
      }
      if(event.name === 'mousemove'){
        const moves = array.slice(index).concat([{}]).findIndex((item)=>{
          return item.name !== 'mousemove'
        }) - 1
        if(moves>0){
          pass = index + moves
          return reduced.concat([{
            name: 'mousemove',
            type: 'mousemove',
            coords: event.coords
          }])
        }
      }
      return reduced.concat([event])
    },[])
    // const previousEvent = previousEvents[previousEvents.length-1]
    // if(!previousEvent){
    //   return [event]
    // }
    // if(previousEvent.name === 'mousemove'){
    //   return previousEvents.slice(0,-1).concat([{...event, time: previousEvent.time}])
    // }
    // if(previousEvent.name === 'keyboard'){
    //   return previousEvents
    // }
    // return previousEvents.concat([event])
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
export const click = {
  name: 'click',
  page: (emit) => {
    const downlistener = window.document.addEventListener('mousedown', (e) => {
      const now = Date.now()
      emit('click',{
        type: 'mousedown',
        coords: [e.clientX, e.clientY],
        time: now
      });
    });
    const uplistener = window.document.addEventListener('mouseup', (e) => {
      const now = Date.now()
      emit('click',{
        type: 'mouseup',
        coords: [e.clientX, e.clientY],
        time: now
      });
    });

    return () =>{ 
      window.document.removeEventListener(downlistener)
      window.document.removeEventListener(uplistener)
    }
  },
  reduce(previousEvents, event){
    const previousEvent = previousEvents[previousEvents.length-1]
    if(!previousEvent){
      return [event]
    }
    if(previousEvent && previousEvent.type === 'mousedown' && event.type === 'mouseup'){
      return previousEvents.slice(0,-1).concat(
        [{
          ...event,
          type: 'click',
        }]
      )
    }
    return previousEvents.concat([event])
  },
  generate(event) {
    if(event.type === 'mousedown'){
      return `await page.mouse.down()`
    }else if(event.type === 'mouseup'){
      return `await page.mouse.up()`
    }else if(event.type === 'click'){
      return `await page.mouse.click(${event.coords[0]},${event.coords[1]})`
    }
  },
  play: (page) => {
  },
};

export default click
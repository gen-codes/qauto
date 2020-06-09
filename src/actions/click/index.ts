export const click = {
  name: 'click',
  page: (emit) => {
    const downlistener = window.document.addEventListener('click', (e) => {
      const now = Date.now()
      emit('click',{
        type: 'click',
        coords: [e.clientX, e.clientY],
        time: now
      });
    });

    return () =>{ 
      window.document.removeEventListener(downlistener)
      window.document.removeEventListener(uplistener)
    }
  },
  generate(event) {
    if(event.type === 'click'){
      return `await delay(100)
      await page.mouse.click(${event.coords[0]},${event.coords[1]})`
    }
  },
};

export default click
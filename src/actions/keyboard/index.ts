export const keyboard = {
  name: 'keyboard',
  page: (emit) => {
    const presslistener = window.document.addEventListener('keypress', (e) => {
      const now = Date.now()
      emit('keyboard',{
        type: 'keypress',
        key: e.key,
        time: now
      });
    });

    return () =>{ 
      // window.document.removeEventListener(presslistener)
    }
  },
  generate(event) {
    if(event.type === 'keypress'){
      return `
      await delay(100)
      await page.keyboard.press('${event.key}')`
    }
  },
};

export default keyboard
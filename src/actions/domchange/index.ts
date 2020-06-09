export const domchange = {
  name: 'domchange',
  page(emit){
    const domObserver = new MutationObserver(function (mutation) {
      console.log('mutation')
      emit('domchange', { type: 'domchange' })
    })
    domObserver.observe(document.body, {
      childList: true,
      // attributes: true,
      characterData: true,
      subtree: true
      // attributeOldValue: true
      // characterDataOldValue: true
    })
    
  },
  generate(event){
    if(event.type === 'domchange'){
      return `await delay(100)
      image = await page.screenshot()
      expect(image).toMatchImageSnapshot();`
    }
    return ''
  }
}
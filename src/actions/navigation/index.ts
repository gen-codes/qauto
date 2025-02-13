export const navigation = {
  name: 'navigation',
  host: async (page, emit, context) => {
    const cdpSession = await context.newCDPSession(page)

    let lastHistoryIndex = 0
    let lastHistoryEntriesLength = 0
    page.on("framenavigated", async (frame) => {
      // Only consider the top frame window
      if (frame.parentFrame() !== null) {
        return
      }

      const history = await cdpSession.send("Page.getNavigationHistory")
      const currentHistoryEntry = history.entries[history.currentIndex]

      // Sometimes they appear multiple times, because we listen not really for navigation changes
      if (lastHistoryIndex === history.currentIndex) {
        return
      }
      /**
       * We only want to track new 'goto' events if the user has actually typed in something and the
       * size of the history will increase if so.
       */
      if (currentHistoryEntry.transitionType === "typed" && lastHistoryEntriesLength < history.entries.length) {
        emit({
          name: 'navigation',
          type: "goto",
          value: frame.url(),
          time: Date.now()
        })

        // For forward and backwards determination the history will keep the same length
      } else if (lastHistoryEntriesLength === history.entries.length) {
        if (history.currentIndex < lastHistoryIndex) {
          emit({
            name: 'navigation',
            type: "goback",
            value: frame.url(),
            time: Date.now()

          })
        }
      }
      lastHistoryIndex = history.currentIndex
      lastHistoryEntriesLength = history.entries.length
    })  
  },
  generate(event) {
    if(event.type === 'goback'){
      return `
      await delay(500)
      await page.goBack()`
    }else if(event.type === 'goto'){
      return `await page.goto('${event.value}')`
    }
  },
};

export default navigation
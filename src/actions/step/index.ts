export const step = {
  name: 'step',
  prompt: {
    choice: '💾  Create new step',
    questions: [
      {
        message: `Add a step name`,
        name: 'step',
        type: 'string',
      },
    ],
  },
  generate(event){
    return `\n})
it('${event.value.step}', async () => {`
  }
}
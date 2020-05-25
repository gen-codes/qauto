import inquirer from 'inquirer';
import { relative } from 'path';
import { repl } from '../utils';
import * as allActions from '../actions'
export const createPrompt = async (codePath: string, emit: Function): Promise<boolean> => {
  const actions = Object.values(allActions).filter(action=>{
    return !!action.prompt
  })
  
  const { choice } = await inquirer.prompt<{ choice: string }>([
    {
      choices: [
        '💾  Save and exit',
        ...actions.map((action)=>action.prompt.choice),
        '🖥️  Open REPL to run code',
        '🗑️  Discard and exit',
      ],
      message: `Edit your code at: ${relative(process.cwd(), codePath)}`,
      name: 'choice',
      type: 'list',
    },
  ]);

  if (choice.includes('REPL')) {
    await repl();
    return createPrompt(codePath,emit);
  }
  const selectedAction = actions.find((action)=>action.prompt.choice === choice)
  if(selectedAction){
    const answer = await inquirer.prompt(selectedAction.prompt.questions)
    emit({name: selectedAction.name, value: answer, time: Date.now()})
    return createPrompt(codePath, emit);
  }
  const shouldSave = choice.includes('Save');
  return shouldSave;
};

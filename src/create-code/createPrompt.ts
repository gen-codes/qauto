import inquirer from 'inquirer';
import { relative } from 'path';
import { repl } from '../utils';

export const createPrompt = async (codePath: string, emit: Function): Promise<boolean> => {
  const { choice } = await inquirer.prompt<{ choice: string }>([
    {
      choices: [
        '💾  Save and exit',
        '💾  Create new step',
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
  if(choice.includes('step')){
    const {step} = await inquirer.prompt([
      {
        message: `Add a step name`,
        name: 'step',
        type: 'string',
      },
    ]);
    emit( {name: 'step', value: step, time: Date.now()})
    return createPrompt(codePath, emit);
  }
  const shouldSave = choice.includes('Save');
  return shouldSave;
};

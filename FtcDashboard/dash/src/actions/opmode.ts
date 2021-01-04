export const INIT_OP_MODE = 'INIT_OP_MODE';
export const START_OP_MODE = 'START_OP_MODE';
export const STOP_OP_MODE = 'STOP_OP_MODE';

export type InitOpModeAction = {
  type: typeof INIT_OP_MODE;
  opModeName: string;
};

export const initOpMode = (opModeName: string): InitOpModeAction => ({
  type: INIT_OP_MODE,
  opModeName,
});

export type StartOpModeAction = {
  type: typeof START_OP_MODE;
};

export const startOpMode = (): StartOpModeAction => ({
  type: START_OP_MODE,
});

export type StopOpModeAction = {
  type: typeof STOP_OP_MODE;
};

export const stopOpMode = (): StopOpModeAction => ({
  type: STOP_OP_MODE,
});

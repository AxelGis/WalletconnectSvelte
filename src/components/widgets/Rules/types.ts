import { Infer, number, object, string } from 'superstruct';

export enum RulesPageActions {
  CREATE = 'create',
  EDIT = 'edit',
  CODE_VIEW = 'viewCode',
  CODE_EDIT = 'editCode',
}

export type RulesPageParams = {
  id?: string;
  action?: RulesPageActions;
};

export const RuleSchema = object({
  ruleId: number(),
  name: string(),
  image: string(),
  version: number(),
  description: string(),
});

export type Rule = Infer<typeof RuleSchema>;

import { ANALYTICS } from './actions';
import { AnalyticsAction } from './types';

// command action types
export const DISPATCH_PENDING_ANALYTICS_ACTIONS = `${ANALYTICS} DISPATCH_PENDING_ACTIONS`;

// event action types
export const LOAD_ANALYTICS_DONE = `${ANALYTICS} LOAD_DONE`;
export const INIT_ANALYTICS_DONE = `${ANALYTICS} INIT_DONE`;
export const INIT_ANALYTICS_ERR = `${ANALYTICS} INIT_ERR`;

// document action types
export const SET_PENDING_ANALYTICS_ACTION = `${ANALYTICS} SET_PENDING_ACTION`

// action creators
export const loadDone = () => ({
  type: LOAD_ANALYTICS_DONE
});

export const initDone = () => ({
  type: INIT_ANALYTICS_DONE
});

export const initFail = (err?: any) => ({
  type: INIT_ANALYTICS_ERR,
  payload: err
});

export const dispatchPendingActions = () => ({
  type: DISPATCH_PENDING_ANALYTICS_ACTIONS
});

export const setPendingAction = (action: AnalyticsAction) => ({
  type: SET_PENDING_ANALYTICS_ACTION,
  meta: action
});



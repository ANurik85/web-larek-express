/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionCreatorsMapObject, AsyncThunk, bindActionCreators, createAsyncThunk as createThunkHook } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import {
	TypedUseSelectorHook,
	useDispatch as dispatchHook,
	useSelector as selectorHook
} from 'react-redux';

import { WebLarekAPI } from '../utils/weblarek-api';
import { AppDispatch, RootState } from './store';

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
export const createAsyncThunk = createThunkHook.withTypes<{
	extra: WebLarekAPI,
	state: RootState,
	dispatch: AppDispatch,
}>();

export const useActionCreators = <Actions extends ActionCreatorsMapObject>(actions: Actions): BoundActions<Actions> => {
	const dispatch = useDispatch();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useMemo(() => bindActionCreators(actions, dispatch), []);
};

type BoundActions<Actions extends ActionCreatorsMapObject> = {
	[key in keyof Actions]: Actions[key] extends AsyncThunk<any, any, any> ? BoundAsyncThunk<Actions[key]> : Actions[key];
};

type BoundAsyncThunk<Thunk extends AsyncThunk<any, any, any>> = (...args: Parameters<Thunk>) => ReturnType<ReturnType<Thunk>>;
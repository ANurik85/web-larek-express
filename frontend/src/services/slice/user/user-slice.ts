import { RequestStatus } from '@api';
import { createSlice } from '@reduxjs/toolkit';
import { isActionPending, isActionRejected } from '../../../utils/redux';
import { checkUserAuth, loginUser, registerUser } from './thunk';
import { TUserState } from './type';



const initialState: TUserState  = {
	isAuthChecked: false,
	data: null,
	requestStatus: RequestStatus.Idle,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
	reducers: {
		authCheck: state => {
			state.isAuthChecked = true;
		},
		resetUser: state => {
			state.data = null;
			state.requestStatus = RequestStatus.Idle;
		}
	},
  extraReducers: builder => {
		builder
			.addCase(checkUserAuth.fulfilled, (state, action) => {
				state.data = action.payload.user;
				state.requestStatus = RequestStatus.Success;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.data = action.payload.user;
				state.requestStatus = RequestStatus.Success;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.data = action.payload.user;
				state.requestStatus = RequestStatus.Success;
			})		
			.addMatcher(isActionPending(userSlice.name), state => {
				state.requestStatus = RequestStatus.Loading;
			})
			.addMatcher(isActionRejected(userSlice.name), state => {
				state.requestStatus = RequestStatus.Failed;
			});
	},
  selectors: {
		getUser: (state:TUserState) => state.data,
		getIsAuthChecked:  (state:TUserState) => state.isAuthChecked,
	}
});

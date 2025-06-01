import { checkUserAuth, loginUser, logoutUser, registerUser } from './thunk';
import { userSlice } from './user-slice';



export const userActions = { ...userSlice.actions, checkUserAuth, registerUser, loginUser, logoutUser };
export const userSelectors = userSlice.selectors;


export type { TUserState } from './type';

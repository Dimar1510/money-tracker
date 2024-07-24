import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { userActions } from "./userSlice";
import { gridActions } from "./gridSlice";

const allActions = {
  ...userActions,
  ...gridActions,
};

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(allActions, dispatch);
};

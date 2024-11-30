import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../redux/slices/userSlice';

function PersistentAuth({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return <React.Fragment>{children}</React.Fragment>;
}

export default PersistentAuth;
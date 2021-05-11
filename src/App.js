
import './App.css';

import { Route, Redirect } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';


export default function App() {

  return(
    <>
    <Breadcrumb />
      <Route exact path="/" render={()=>(<Redirect to="/home" />)}/>
    </>
  );
  
}

import React,{useState,useEffect,useContext} from 'react';
import App from './App';
import './App.css';
import {ReactComponent as Svgfile} from './loading.svg';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import {MyProfile} from './profile';
import Errors from './error';
import {ConApi} from './contextapi';


function Ren() {
  const {load,randomdata} = useContext(ConApi);
  const [launch,setlaunch] = useState(false);
  const [loading,setLoading] = useState(false);


  useEffect(() => {
    if (!loading){
      setTimeout(() => {
          setLoading(true);
      },9000);
    } else if (!load){
        setlaunch(true);
        }
      }
    },[loading,load]);

  useEffect(()=>{
           randomdata()
          },[])
  
  if(!launch){
    if (!loading){
          return(
           <>
              <div className="man1"><Svgfile /></div>
              <div className="welcome fontheader" >Welcome To Anand Dudi App</div>
          </>
            );
     } else {
         return (
             <div className="loadingWhileFetch">Loading Data From Server! Please Wait</div>
                );
           }
      }
  }

 return (
    <React.Fragment>
    <Router>
      <Switch>
        <Route exact path="/">
          <App />
        </Route>
        <Route path="/profile">
          <MyProfile/>
        </Route>
        <Route path='*'>
          <Errors />
        </Route>
      </Switch>
    </Router>
  </React.Fragment>
    );
}
export default Ren;

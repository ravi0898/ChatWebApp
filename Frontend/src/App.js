import {Heads} from './headers';
import React,{useState,useEffect,useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import MainImage from './statics/newimage.png';
import Logo from './statics/logo.png';
import PopupImage from './statics/popupimage.jpg';
import {List} from './lists';
import {FaPlusCircle} from 'react-icons/fa';
import {ConApi} from './contextapi';
import Authlist from './authlist';


function App() {
  let [clickevent,setClickevent] = useState(true);
  let [showpopup,setShowpopup] = useState(false);
  let [loginform,setLoginform] = useState(false);
  let [adduser,setAdduser] = useState(false);
  let [login,setLogin] = useState(false);
  const {forNames,forRegister,res,forLogin} = useContext(ConApi);
  const history = useHistory();
  let [localdata,setLocaldata] = useState(false)

  const [changeicon,setChangeicon] = useState(false);
  const [slist,setSlist] = useState(true);
  const [log,setLog] = useState(false)
  const [staricon,setStaricon] = useState(false);
  const [searchitem,setSearchitem] = useState('');

  useEffect(() => {

    let local = window.localStorage.getItem("access");
    if (local === null){
    setLocaldata(true)
    }else{
      setLocaldata(false)
    }


  },[res,clickevent,localdata])

  useEffect(() => {
    setClickevent(true);
  }, [clickevent])


  var valueis = ''
  const searchingitems = (e) =>{
      e.preventDefault();
      valueis += String(e.target.value);
      setSearchitem(valueis);
  }


  const removetoken = () =>{
    window.localStorage.removeItem("access");
    window.localStorage.removeItem("refresh");
    setLog(true);
    setLocaldata(true);
    setStaricon(false);
  }
  useEffect(() => {
    async function Datawait(){
      await function waitforData(){
          return res === 'true';
      }
      setLocaldata(false);
    }
    Datawait();
  },[login,res])

  useEffect(() => {
    if(window.localStorage.getItem("access")){
      setChangeicon(true)
    }
  }, [])

  return (
      <div className="Mainclass" onClick={() => {setClickevent(false)}}>
      <nav className="navbar">
           <span className="navhadings"><img className="logo" src={Logo} alt="logo"/>
            <Link to="/" onClick={() => {setShowpopup(true)}} title="Profile" className="profile profileFont">Profile</Link>
            {localdata && <div onClick={() => {setLoginform(true)}} title="SignUp" className="profile profileFont">Sign up</div>}
            {localdata && <div title="LogIn" onClick={() => {setLogin(true);setChangeicon(true);setLog(false)}} className="profile profileFont">Log in</div>}
            {localdata || <div title="Logout" onClick={() => {removetoken();setChangeicon(false)}} className="logout logoutFont">Logout</div>}
            <div className={localdata?"search":"searchwithlogin"}>
              <table>
                <tbody>
                  <tr>
                    <td className="searchFont">
                      <label htmlFor="searchingItems">Search</label>
                    </td>
                    <td style={{paddingLeft:'5%'}}>
                      <input type="text" className='inputborder' onChange={searchingitems} name="searchingItems" placeholder="Search name" id="searchingItems"/>
                    </td>
                  </tr>
                </tbody>
              </table>

            </div>
            </span>
      </nav>
      <img src={MainImage} alt="some problem" className="mainimage"/>
      <div className="containerForChat">
        <div><Heads slist={slist} staris={staricon} returnvalue={clickevent || false }/></div>
        {localdata ? <div><List log={log}  makefalse={setSlist} changeicons={setChangeicon} searchitems={searchitem} /></div>
          :<Authlist searchitems={searchitem}/>}
        { changeicon || <FaPlusCircle onClick={() => {setAdduser(true)}}  className="addUser"/>}
        {
          adduser && <div className="blackOuts">
                <div className="loginform">
                    <form onSubmit={forNames}>
                        <label htmlFor="name" className="fullnames">Full Name</label><br/>
                        <input type="text" name="name" className="fullnameinputs"/>
                        <div className="closebtun" onClick={() =>{setTimeout(() =>{setAdduser(false)},300)}}>+</div>
                        <button type="submit"  className="submitbtun" onClick={() =>{window.localStorage.removeItem("pk");setTimeout(() =>{setAdduser(false)},300)}}>Submit</button>
                    </form>
                </div>
            </div>
        }
      </div>


      {/*popup dialog*/}
      { showpopup ? <div className="popupBack">
                    <div className="popupMain">
                      <img src={PopupImage} alt="" className="popupImage"/>
                      <div className="popupText">
                      <h3>Well! &#128373;<strong>After Clicking Okay You will be redirect to  </strong><font color="rebeccapurple" title="Anand dudi"><sup><u>The Creator</u></sup></font><strong> of this page</strong></h3>
                      </div>
                      <div>
                      <Link to="/profile" ><button onClick={() => {setTimeout(() => {setShowpopup(false) },500)}} className="popupButton"><b>Okay</b></button></Link>
                      </div>
                    </div>
                  </div> : ""
      }
      {
        loginform && <div className="blackOut">
                <div className="loginform">
                    <form onSubmit={forRegister} >
                        <label htmlFor="name" className="fullnames">Full Name</label><br/>
                        <input type="text" name="name" className="fullnameinput"/>
                        <label htmlFor="email" className="emails">Email</label><br/>
                        <input type="text" name="email" className="emailsinput"/>
                        <label htmlFor="pass" className="passwords">Password</label><br/>
                        <input type="password" name="pass" className="passwordinput"/><br/>
                        <input type="submit" value="Submit" onClick={() =>{history.push(setLogin(true));setTimeout(() => {setLoginform(false)},500)}} className="submit"/>
                    </form>
                </div>
            </div>
      }
      {
        login && <div className="blackOut">
                <div className="loginform">
                    <form onSubmit={forLogin}>
                        <label htmlFor="email" className="emails">Email</label><br/>
                        <input type="text" name="email" className="emailsinput"/>
                        <label htmlFor="pass" className="passwords">Password</label><br/>
                        <input type="password" name="pass" className="passwordinput"/><br/>
                        <input type="submit" value="Submit" onClick={() =>{setTimeout(() => {setLogin(false)},500)}} className="submit"/>
                    </form>
                </div>
            </div>
      }
      </div>
    );
}

export default App;

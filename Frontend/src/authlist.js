import React,{useContext,useState,useEffect} from 'react';
import {ConApi} from './contextapi';
import DefaultImage from './statics/profileImage.jpg';
import {ReactComponent as Backbutton} from './statics/backbuttton.svg';
import jwt_decode from 'jwt-decode';
import {FaStar} from 'react-icons/fa';




function Authlist (props){
    const text = "Chat Section";
    const urlis = 'https://dudichatappbackend.herokuapp.com'
    const {usersData,
        authData,
        userschat,
        gettingUserchat,
        bothUserchats,
        authchats,
        postauthchat,
        authchattings
        } = useContext(ConApi);
    const [datalot,setDatalot] = useState([]);
    const [otherchat,setOtherchat] = useState([]);
    const [showchatbox,setShowchatbox] = useState(false);
    const [secUserpk,setSecuserpk] = useState(null);
    const [namefill,setNamefill] = useState(null);
    const [rerender,setRerender] = useState(false);
    const [searchitemis,setSearchitemis] = useState('');


    useEffect(()=>{
        if(!datalot){
            usersData()
            gettingUserchat()
        }
        setDatalot(authData)
        setOtherchat(userschat)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[authData,usersData])

    const pkval = () => {
            if(window.localStorage.getItem("access")){
            let pktoken = window.localStorage.getItem("access");
            let obj = jwt_decode(pktoken);
            let namepk = obj.pk;
            return Number(namepk)
            }
        }

    const onChatsubmitted = async(event) =>{
        let ob = {
            event:event,
            pkvalues:secUserpk
        }

        await postauthchat(ob);
        event.target.authchatboxing.value = null
    }

    const naming = (name) => {
        setNamefill(name)
    }

    useEffect(() => {
        if(authchattings !== ''){
         authchats.push(authchattings)
         setRerender(!rerender)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authchattings,postauthchat,authchats])



    //seaching items section
    useEffect(()=>{
      setSearchitemis(props.searchitems)
    },[props.searchitems])


    var itemvalueis = ''
    const filteroutelements = (item) =>{
        if(searchitemis !== ''){
            if(itemvalueis !== searchitemis){
              itemvalueis += searchitemis
            }
            for(let i=0; item.name.length+1; i++){
              return itemvalueis[i] === item.name[i]
              }
            }
        const vl = window.localStorage.getItem("access")
        let vlis = jwt_decode(vl)
        let vvlis = String(vlis.pk)
        return String(item.pk) !== vvlis
    }

    useEffect(() => {
        if(window.localStorage.getItem("access")){
            usersData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <section>
        {
            showchatbox ?
            <div>
                <div className="manageheader"><div className="headerSection">
                <div><Backbutton  className="backbutton"  onMouseOver={() => {setTimeout(() => {
                    setSecuserpk(null);
                    setNamefill(null);
                    setShowchatbox(false)
                 },2000)}}/></div>
                <div><h3 className="headerSectionText1"><center>{text}</center></h3></div>
            </div>
            </div>
            <div className="mainchatcontainer">
             <section className="chatcontainer">
                <ul className="usermessages">
                  {
                    authchats && authchats.map((chts,index) =>{
                      return (
                        <React.Fragment key={index}>
                          {
                              Number(chts['firstuser']) === pkval()?
                                  <li className="chatboxli"><span className="chatboxtext1">{chts['chatsection']}</span></li> :
                                  <li className="chatboxli chatbox2"><span className="chatboxtext2">{chts['chatsection']}</span></li>

                          }
                          </React.Fragment>
                            );
                          }
                      )

                  }

                </ul>
            </section>
            </div>
            <div className="chattext">
             <div><form onSubmit={onChatsubmitted}>
                <input className="chatboxinput"  type="text" name="authchatboxing" placeholder="Type here for chat" onFocus={(event) => {event.target.placeholder = ''}} autoComplete="off" onBlur={(event) => {event.target.placeholder = 'Wanna type again'}} required/>
              </form>
              </div>
              </div>
             <div className="namecontain"><div className="namefill">{namefill}<div className="covername"></div></div></div>
        </div>
        : <ul className="chatList">
        {   datalot && datalot && datalot.filter(filteroutelements).map((items)=>{
                let chtis = otherchat && otherchat.filter((itm)=>Number(items.pk) === Number(itm.firstuser))
                return (<li key={items.pk}><img className="imageList" src={items.images ? String(items['images']) : DefaultImage} alt="DefaultImage"/><span onClick={() =>{
                    bothUserchats(items.pk);
                    setSecuserpk(items.pk);
                    naming(items.name);
                    setShowchatbox(true)
                 }} className="titleList">{items['name']}</span><div className="starList"><FaStar className="starSelf"/></div><div className="contentList">{
                    chtis.length > 0 ? chtis[0]['chatsection'] : 'No chat found'
                }</div></li>)
            })
        }
        </ul>
        }
        </section>
        );
}
export default Authlist;

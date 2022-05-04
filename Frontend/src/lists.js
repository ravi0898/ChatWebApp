import React,{useContext,useEffect,useState} from 'react';
import DefaultImage from './statics/profileImage.jpg';
import {ConApi} from './contextapi';
import {ReactComponent as Backbutton} from './statics/backbuttton.svg';

export const List = (props) => {
    let {
      data,
      chatsdata,
      chatboxis,
      chatsubmitted,
      res,
      getORcreate,
      chatting
    } = useContext(ConApi);
    const [chatbox,setChatbox] = useState(false);
    const text = "Chat Section";
    const [chatboxdatais,setChatboxdatais] = useState([]);
    const [forLogin,setForlogin] = useState(true);
    const [ids,setIds] = useState(null);
    const [rerender,setRerender] = useState(false);
    const [namefill,setNamefill] = useState('');
    const [searchitemis,setSearchitemis] = useState('');


    const onChatsubmitted = (event) =>{
      let obj = {
        event:event,
        ids:ids
      }
      chatsubmitted(obj)
      event.target.chatboxing.value = null
    }


    const settingName = (usersname) =>{
        setNamefill(usersname)
    }

    useEffect(()=>{
      if(res){
        if(props.log){
          setForlogin(true)
        }else{
          setForlogin(false)
        }
      }
      else{
        setForlogin(true)
      }
    },[props.log,res])

    useEffect(()=>{
      if(window.localStorage.getItem("access")){
        setForlogin(false)
      }else{
        setForlogin(true)
      }
    },[])

    useEffect(()=>{
      setSearchitemis(props.searchitems)
    },[props.searchitems])



    useEffect(() => {
      if(Array.isArray(chatboxis) && chatboxis.length !== 0){
        setChatboxdatais(chatboxis)
        setIds(Number(chatboxis[0]['group']))
      }else if(typeof chatboxis === 'object' && chatboxis !== null){
        setIds(Number(chatboxis.id))
      }

    }, [chatboxis])


    var itemvalueis = ''
    const filteroutelements = (item) =>{
      if(searchitemis !== ''){
        if(itemvalueis !== searchitemis){
          itemvalueis += searchitemis
        }
        for(let i=0; item.allnames.length+1; i++){
          return itemvalueis[i] === item.allnames[i]
          }
        }
      return String(item.pk) !== String(window.localStorage.getItem("pk"))
    }


    useEffect(() => {
      if(chatting){
        chatboxdatais.push(chatting)
        setRerender(!rerender)
      }
    }, [chatting])

    return (
        <section> 
         {
            chatbox ? <div><div className="manageheader"><div className="headerSection">
                <div><Backbutton  className="backbutton"  onMouseOver={() => {setTimeout(() => {
                props.changeicons(false);
                props.makefalse(true);
                setChatboxdatais([]);
                setIds(null);
                settingName('');
                setChatbox(false)},2000)}}/></div>
                <div><h3 className="headerSectionText1"><center>{text}</center></h3></div>
                </div>
            </div>
            <div className="mainchatcontainer">
                <section className="chatcontainer">
                    <ul className="usermessages">
              {
                chatboxdatais !== '' && chatboxdatais.map((chts,index) =>{
                  return (
                    <React.Fragment key={index}>
                      {
                          Number(chts['user_name']) === Number(window.localStorage.getItem("pk")) ?
                              <li className="chatboxli"><span className="chatboxtext1">{chts['user_chat']}</span></li> :
                              <li className="chatboxli chatbox2"><span className="chatboxtext2">{chts['user_chat']}</span></li>

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
            <input className="chatboxinput"  type="text" name="chatboxing" placeholder="Type here for chat" onFocus={(event) => {event.target.placeholder = ''}} autoComplete="off" onBlur={(event) => {event.target.placeholder = 'Wanna type again'}} required/>
          </form>
          </div>
          </div>
          <div className="namecontain"><div className="namefill">{namefill}</div></div>
        </div> : 
        {
          forLogin && 
              <ul className="chatList">
              {
                 data && data.filter(filteroutelements).map((initialdata) => {

                    var result = chatsdata && chatsdata.filter((itm) => String(itm['user_name']) === String(initialdata['pk']))
                     return (
                        <li key={initialdata.pk}><img className="imageList" src={DefaultImage} alt="DefaultImage"/><span onClick={()=>{
                        props.changeicons(true);
                        props.makefalse(false);
                        getORcreate(initialdata['pk']);
                        settingName(String(initialdata['allnames']))
                        setChatbox(true)
                        }} className="titleList">{initialdata['allnames']}</span><div className="contentList">{result && result.length >= 1 ? result.at(-1)['user_chat'] : "No chat"}</div></li>
                    );
                })
              }
          </ul>
        }
      }
      </section>

        );
}


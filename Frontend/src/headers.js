import {FaBars,FaCameraRetro} from 'react-icons/fa';
import React,{useState,useEffect,useContext} from 'react';
import {ConApi} from './contextapi';
import jwt_decode from 'jwt-decode';
import DefaultImage from './statics/profileImage.jpg';



export const Heads = (prop) => {
    const [show,setShow] = useState(false);
    const [showlist,setShowlist] = useState(false);
    const {uploadImages,data,res} = useContext(ConApi);
    const [showpop,setShowpop] = useState(false)
    const [popupMessage,setShowpopupMessage] = useState("")
    const [fileis,setFileis] = useState(null);
    const [stay,setStay] = useState(false);
    const [nameis,setNameis] = useState(null);
    const [auth,setAuth] = useState(false);
    const [imagefield,setImagefield] = useState(null);
    const [datacreated,setDatecreated] = useState('No date');
    const [star,setStar] = useState(false);

    // let name = "";
    const text = "Chat Section";
    let {returnvalue} = prop;

    const [headeritself,setHeaderitself] = useState(true);

    if(show){
        setTimeout(() =>{
            if(!showlist)
            setShowlist(true);
            },200);
    }

    if(returnvalue === false){
        if(show & showlist){
        setShow(false);
        }
    }
    useEffect(() => {
        if(stay === false){
            if(returnvalue === false){
                setShowlist(false);
        }
      }
    }, [returnvalue,stay])

    const showmessage = () => {
        setShowpop(true)
        setShowpopupMessage("You have to click on Camera icon in order to upload image")

    }
    useEffect(()=>{
        let nameToken = window.localStorage.getItem("access");
        if(nameToken){
            let obj = jwt_decode(nameToken);
            let name = obj.name
            let names = touppercase(name);
            setNameis(names);
            setAuth(true);
        }
        else {
            setNameis(()=>{getnamess()})
            setAuth(false)
        }
        if(nameToken){
            let prstoken = jwt_decode(nameToken)
            let imageis = String(prstoken.image)
            setImagefield(imageis)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[showlist,show])

    function touppercase(str){
        return str[0].toUpperCase() + str.slice(1);
    }

    useEffect(()=>{
        setTimeout(()=>{
            setShowpopupMessage("")
            setShowpop(false)
        },5000)
    },[showpop])


    let uploadingImage = (e) => {
        setStay(true);
        setFileis(e.target.files[0]);
    }

    const submitImage = () => {
        if(fileis !== null){
            uploadImages(fileis);
            setStay(false);
      }else{
        showmessage();
      }

    }

    const getnamess = () => {
        let pks = window.localStorage.getItem("pk")
        let nms = ''
        data && data.map((itm)=>{
           if(Number(itm['pk']) === Number(pks)){
                nms = itm['allnames']
            }
            return setNameis(nms)
        })
    }

    useEffect(()=>{
        if(!prop.slist){
            setHeaderitself(false)
        }
        else if(prop.slist) {
            setHeaderitself(true)
        }
    },[prop.slist])

    const mainuserdata = async() =>{
        let tokenss = await window.localStorage.getItem("access")
        let chatsare = await fetch('https://dudichatappbackend.herokuapp.com/mainuser/',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' +  String(tokenss)
            }
        })
        let responseis = await chatsare.json()
        setDatecreated(responseis.created)
        setStar(responseis.star)
    }

    useEffect(()=>{
        if(auth){
            mainuserdata()
        }
        if(res){
            if(!prop.staris){
                setStar(false)
            }
        }
    },[res,showlist,auth,prop.staris])


    return (
        <div>
    { headeritself && <div className="headerSection">
             <div>
                <button style={show ? { animation: 'toggleit 0.2s linear',animationFillMode: 'forwards',transformOrigin: 'center',transformBox: 'fill-box',zIndex:'1'}:{}} onMouseEnter={() => { setShow(true);}} className='searchbar'><FaBars /></button>


                {showlist && <><div className="blackOut"></div><ul onMouseLeave={stay ? () => '':() => { setShow(false); setShowlist(false)}} className='headerList'>
                                <li className="headerName">{auth && <img src={imagefield !== null & imagefield !== 'undefined' ? imagefield : DefaultImage} alt="UserImage" className="profileimageheader"/>}<div className="profileimageheadername">{nameis}</div></li>
                                {auth ? <li style={{listStyleType:"none"}}><input type="file" accept="image/*" onClick={() => setStay(true)} onChange={uploadingImage} className="fileupload"/><FaCameraRetro style={{zIndex:"-1",color:"whitesmoke",border:"0.2px solid black",backgroundImage:"linear-gradient(to right,blue,indigo,violet)",marginLeft:"-16%"}}/><button className="uploadImageButton" onClick={() => submitImage()}>Upload Image</button></li>:<li style={{color:"red",marginLeft:"-10%"}}><small>Set picture as User</small></li>}
                                <li style={{color:"red",marginLeft:"-10%"}}>{auth ? <small>{datacreated === null ? "No chat yet create": datacreated}</small> : <small>No time record</small>}</li>
                                <li style={{color:"cyan",marginLeft:"-10%"}}>{auth ? "You are star" :<small>You have no star</small>}</li>
                            </ul>
                            </>
                    }
            </div>
            <div>
                {showpop && <div class="popupMessage"><div className="popupText">{popupMessage}</div></div>}
            </div>

            <h3 className="headerSectionText"><center>{text}</center></h3>
        </div>
    }
        </div>

        );

}

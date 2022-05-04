import {createContext,useState,useEffect} from 'react';


export let ConApi = createContext();

let ApiProvider = ({ children }) => {
 const url = 'https://dudichatappbackend.herokuapp.com';
 const [randomData,setRandomData] = useState('');
 let [res,setRes] = useState(false);
 const [authData,setAuthData] = useState('');
 const [load,setLoad] = useState(false)
 const [chatsdata,setChatsdata] = useState(null);
 const [chatboxdata,setChatboxdata] = useState(null);
 const [chatting,setChatting] = useState(null);
 const [userschat,setUserschat] = useState('');
 const [authchats,setAuthchats] = useState([]);
 const [authchattings,setAuthchattings] = useState('');


 const randomdata = async () => {
        let pkvalue = window.localStorage.getItem("pk")
        try {
            let response = await fetch(`${url}/randomdata/`)
            let data = await response.json()
            setRandomData(data)
        }
        catch(err) {
            setLoad(true);
        }
        if (pkvalue){
            let getchatdata = await fetch(`${url}/randomdata/`,{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({'pk':pkvalue})
            });
            if(getchatdata){
                let chatdata = await getchatdata.json()
                setChatsdata(chatdata)
            }
        }

    }

// getting room data or creating room
const getORcreate = async(val) => {
    setChatboxdata(null);
    setChatting(null);
    let user = Number(window.localStorage.getItem("pk"));
    let getdt = await fetch(`${url}/getroomdata/`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({'user_one':user,'user_two':Number(val)})
    });
    let response = await getdt.json();
    setChatboxdata(response);
}


//chat submitting
const chatsubmitted = async(ob) => {
    ob.event.preventDefault()
    setChatting(null);
    let sub = await fetch(`${url}/postingchat/`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({'id':ob.ids,'user_name':Number(window.localStorage.getItem("pk")),'user_chat':ob.event.target.chatboxing.value})
    });
    let respn = await sub.json();
    setChatting(respn);
}

// api call for user

const adduser = async(e) => {
    e.preventDefault();
    let namepk = await fetch(`${url}/savename/`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'allnames':e.target.name.value})
        });
    if(namepk){
        let namepkval = await namepk.json()
        let pkis = namepkval['pk']
        window.localStorage.setItem("pk",pkis)
        randomdata()
    }

}

// for register api
const registerUser = async (e) => {
    e.preventDefault();
    await fetch(`${url}/register/`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({'name':e.target.name.value,'emails':e.target.email.value,'password':e.target.pass.value})
    });

}

// for login
const refreshtokens = async() => {
            window.localStorage.removeItem("access");
            let getref = await fetch(`${url}/login/token/refresh/`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({'refresh': String(window.localStorage.getItem("refresh"))})
            });
            let rsponseis = await getref.json()
            window.localStorage.setItem("access",rsponseis.access)
            window.localStorage.setItem("refresh",rsponseis.refresh)
    }

const loginUser = async(e) => {
    e.preventDefault()
    let login = await fetch(`${url}/login/token/`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({'emails':e.target.email.value,'password':e.target.pass.value})
    });
    let response = await login.json();
    if (response){
        if(!response.detail){
        window.localStorage.setItem("access",response.access);
        window.localStorage.setItem("refresh",response.refresh);
        randomdata();
        setRes(true);
        setAuthchattings('')
        }
    }else{
        setRes(false);
    }
}

useEffect(()=>{
    let intval = setInterval(()=>{
        if(window.localStorage.getItem("access") && window.localStorage.getItem("refresh")){
            refreshtokens()
        }
    },1140000)
    return ()=> clearInterval(intval)
},[randomData,res])

// 'Content-Type': 'multipart/form-data',

// for image uploading
const uploadimage = async(fileis) => {
    let formData = new FormData();
    formData.append("images",fileis);
    let tokenis = await window.localStorage.getItem("access");
    await fetch(`${url}/imageupload/`,{
        method:'POST',
        headers:{
            'Authorization':'Bearer ' + String(tokenis)
        },
        body:formData
    });
}


// ....................getting authorized data...................

const usersData = async() =>{
    let data = await fetch(`${url}/userdata/`)
    let response = await data.json()
    setAuthData(response)
}

const gettingUserchat = async() =>{
    let tokenis = await window.localStorage.getItem("access");
    let chatis = await fetch(`${url}/otheruserchat/`,{
        method : 'GET',
        headers : {
            'Authorization' : 'Bearer ' + String(tokenis)
        }
    })
    let response = await chatis.json()
    setUserschat(response)

}

const bothUserchats = async(val) =>{
    let tokenis = await window.localStorage.getItem("access");
    let chats = await fetch(`${url}/bothuserchat/`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + String(tokenis)
        },
        body : JSON.stringify({'second_user' : Number(val)})
    });
    let response = await chats.json()
    if(response === []){
        setAuthchats([])
    }
    setAuthchats(response)
    setAuthchattings('')
}

const postauthchat = async(objectss) =>{
    objectss.event.preventDefault()
    setAuthchattings('')
    let tokenis = await window.localStorage.getItem("access");
    let dtiss = await objectss.event.target.authchatboxing.value
    let chatforauthuser = await fetch(`${url}/savingchat/`,{
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Authorization': 'Bearer ' + String(tokenis),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"seconduser": objectss.pkvalues,"chatsection": dtiss})
    });
    let response = await chatforauthuser.json();
    setAuthchattings(response)
}

let apiobject = {
    authchattings:authchattings,
    postauthchat:postauthchat,
    authchats:authchats,
    bothUserchats:bothUserchats,
    chatting:chatting,
    getORcreate:getORcreate,
    chatsubmitted:chatsubmitted,
    chatboxis:chatboxdata,
    chatsdata:chatsdata,
    load:load,
    data:randomData,
    forNames:adduser,
    forRegister:registerUser,
    res:res,
    forLogin:loginUser,
    uploadImages:uploadimage,
    authData:authData,
    randomdata:randomdata,
    usersData:usersData,
    userschat:userschat,
    gettingUserchat:gettingUserchat
}

return (
    <ConApi.Provider value={apiobject}>
        {children}
    </ConApi.Provider>
    );
}

export default ApiProvider;

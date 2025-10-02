let navigator;

export const setNavigator = (navigate)=>{
  navigator = navigate
}

export const navigate = (path, options ={}) =>{
  if (navigator){
    navigator(path, options)
  } else{
    console.warn('Navigator not loaded!')
  }
}
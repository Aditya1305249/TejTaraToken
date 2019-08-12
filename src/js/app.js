App ={
    init: ()=>{
        console.log("App initialize....");
    }
}


$(()=>{
    $(window).on("load",()=>{
        App.init()
    })
})
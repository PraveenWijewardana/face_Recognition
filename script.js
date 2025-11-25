// Auto image preview: when a file input is selected, show image automatically
(function(){
    'use strict';
    document.addEventListener('change', function(e){
        const input = e.target;
        if (!(input && input.type === 'file')) return;
        const file = input.files && input.files[0];
        if (!file) return;
        // create or reuse an img preview right after the input
        let preview = input.nextElementSibling;
        if (!preview || preview.tagName !== 'IMG' || (preview.className || '').indexOf('auto-image-preview') === -1){
            preview = document.createElement('img');
            preview.className = 'auto-image-preview';
            preview.style.maxWidth = '200px';
            preview.style.display = 'block';
            preview.style.marginTop = '8px';
            input.parentNode.insertBefore(preview, input.nextSibling);
        }
        preview.src = URL.createObjectURL(file);
        preview.onload = () => URL.revokeObjectURL(preview.src);
    }, false);
})();
/////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function upload_person(){
    var face = document.getElementById("face").files[0];
    var name = document.getElementById("person-name").value;
    
    add_person(name, face, "", function(result){
        if (result.status == "success"){
            //
        }
        
    });
}

function recognize_people(){
    var photo = document.getElementById("photo").files[0];
    
    recognize(photo, function(uiid,name,pb){

            document.getElementById("result-name").innerText=name;
            document.getElementById("result-id").innerText=uiid;
            document.getElementById("result-probability").innerText=pb;
        
    });
}



function add_person(name, image, collections, callback){
    var myHeaders = new Headers();
    myHeaders.append("token", "18a92ab3366a4679a076076f5cb0c4e6");

    var formdata = new FormData();
    formdata.append("name", name);

    if ((typeof image == "string") && (image.indexOf("https://") == 0))
        formdata.append("photos", image);
    else
        formdata.append("photos", image, "file");
    
    formdata.append("store", "1");
    formdata.append("collections", collections);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch("https://api.luxand.cloud/v2/person", requestOptions)
      .then(response => response.json())
      .then(result => console.log(result))
      .then(result => callback(result))
      .catch(error => console.log('error', error));;
}




function recognize(image, callback){
    var myHeaders = new Headers();
    myHeaders.append("token", "18a92ab3366a4679a076076f5cb0c4e6");

    var formdata = new FormData();    

    if ((typeof image == "string") && (image.indexOf("https://") == 0))
        formdata.append("photo", image);
    else
        formdata.append("photo", image, "file");

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch("https://api.luxand.cloud/photo/search/v2", requestOptions)
      .then(response => response.json())
      .then(data=>{
         callback(data[0].uuid,data[0].name,data[0].pb);
      })
      .catch(error => console.log('error', error)); 
}

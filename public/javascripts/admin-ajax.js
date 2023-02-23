function addCategory(){
    const categ = $('#category').val();
    console.log(categ);
    if(!categ){
        $('#err_message').html('Category is required');
        return;
    }
    $.ajax({
        url:'/admin/add-category',
        data:{
            category: categ
        },
        method:'post',
        success:(res)=>{
            if(res.success){
                location.reload()
            }
            if(res.err){
                $('#err_message').html(res.err)
            }else{
                $('#err_message').html('')
            }
        }
    }).catch((error)=>{
        console.error('Error:',error);
    })
}
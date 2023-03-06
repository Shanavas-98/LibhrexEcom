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

//choose subcatogory under a specific category
$('#categ_bar').on('change', function() {
    var categoryId = $('#categ_bar').val();
    $('#subcateg_bar').val('');
    if (categoryId) {
        $.ajax({
            url: '/admin/subcategory/' + categoryId,
            type: 'GET',
            success: function(data) {
                $('#subcateg_bar').html('<option value="" selected>Choose Subcategory</option>');
                data.forEach(function(subcateg) {
                    $('#subcateg_bar').append('<option value="' + subcateg._id + '">' + subcateg.subcategory + '</option>');
                });
            }
        });
    } else {
		//location.reload();
        $('#subcateg_bar').html('<option value="" selected>Choose Subcategory</option>');
    }
});

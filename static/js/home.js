/**
 * Created by Hallshit on 2/14/17.
 */
// var selectedFile = $('#fileinput').get(0).files[0];
// console.log()
//  Cookie Bullshit


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

//Cookie Bullshit ends


//Adds a new element and posts to db
var idnum = 1;
$(function() {
    $('#fileinput').on('change', function () {
        var s = '<li>text</li>'; // HTML string

        var div = document.createElement('div');
        div.innerHTML = s;
        var elements = div.childNodes;


        // get file and pull attributes
        var input = $(this)[0];
        var file = input.files[0];
        formdata = new FormData();
        formdata.append('image', file);

        // load file into preview pane

        var reader = new FileReader();
        reader.onload = function (e) {
            html = '<div class="card" style="width:20rem;"><img id="testcard'+idnum.toString()+'" class="card-img-top" style="max-height:400px" src="' + e.target.result + '" alt="Card image cap"><div class="card-block"> <h4 class="card-title display-4" id="title'+idnum.toString()+'">Analyzing...</h4> <p class="card-text" id="content'+idnum+'">content.</p> <a href="#" class="btn btn-primary">Remove</a> </div> </div>'

            $('#inventory').append(html);
            $.ajax({
                type: 'POST',
                url: 'ajax/post/',
                data: formdata,
                processData: false,
                contentType: false,
                success: function (json) {
                    $('#title'+ idnum).html(json.name);
                    console.log(json);
                    $('#content'+idnum).html(json.description);
                    idnum +=1
                }
            })
            // $('#testcard').attr('src', e.target.result);
        }
        reader.readAsDataURL(file);

    });
})

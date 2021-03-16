let modalBody       = $(".modal-body"),
    modalFooter     = $(".modal-footer"),
    modal           = new bootstrap.Modal(document.getElementById('more-info-modal')),
    msgAlert        = new bootstrap.Alert(document.getElementById('myAlert'))


// ======================= Delete button ============================
$(document).on("click", "[role='delete-card']", function (e) {
    let cardId = String($(this).attr('card-id'))

    $.ajax({
        type: "DELETE",
        url: `/api/companies/${cardId}`,
        success: function (response) {
            console.log("success:", response)
            alert("deleted successfully")
            location.reload()
        },
        error: function (err) {console.log("error:", err);alert(err)}
    })
})

// ============================ Modal Section ============================
$(document).on("click", "#new-button", function (e) {
    showNewInfo()
})

// render modal form for creating info
function showNewInfo(data) {
    modalBody.html('')
    modalBody.append(`
    <form class=" bg-mute"> 
        <div class="mb-2">
            <label for="name" class="form-label">name : </label>
            <input type="text" class="form-control " name="name" required>
        </div>
        <div class="mb-2">
            <label for="cin" class="form-label text-uppercase">cin: </label>
            <input type="text" class="form-control" name="cin" required>
        </div>
        <div class="mb-2">
            <label for="city" class="form-label">city: </label>
            <input type="text" class="form-control" name="city" required>
        </div>
        <div class="mb-2">
            <label for="province" class="form-label">province: </label>
            <input type="text" class="form-control" name="province" required>
        </div>
        <div class="mb-2">
            <label for="register-date" class="form-label">register date: </label>
            <input type="date" class="form-control" name="register-date" required>
        </div>
        <div class="">
            <label for="telephone" class="form-label">telephone: </label>
            <input type="text" class="form-control" name="telephone" required>
        </div>
    </form>
    `)

    modalFooter.html(`
    <button id="create-button" class="text-white btn btn-outline-success offset-left"> Create </button>
    `)
}

// create button click action
$(document).on("click", "#create-button", function (e) {
    // modal.hide()
    console.log(modal);
    let newInformation = getInformations()
    $.ajax({
        type: "POST",
        url: "/api/companies/",
        data: newInformation,
        dataType: "json",
        success: function (response) {
            if (response) {
                console.log("success: ", response);
                alert("successfully created")
                location.reload()
            }
        },
        error: function (err) {
                console.log("error: ", err);
                alert("there was a problem with your data")
        }
    });
})

// getting new informations
function getInformations() {

    let inputs = {
        "name": $("[name='name']").val(),
        "cin": $("[name='cin']").val(),
        "city": $("[name='city']").val(),
        "province": $("[name='province']").val(),
        "registerDate": new Date($("[name='register-date']").val()).toISOString(),
        "telephone": $("[name='telephone']").val()
    }
    return inputs
}

// show more button click
$(document).on("click", ".btn-more", function (e) {
    let cardId = $(this).attr("card-id")
    $.ajax({
        type: "GET",
        url: `/api/companies/${cardId}`,
        success: function (response) {
            // console.log("success:", response);
            showMoreInfo(response)
        },
        error: function (err) {
            // console.log("error:", err);
            alert(err)
        }
    });
})

// render modal form for more info
function showMoreInfo(data) {
    let registerDate = new Date(data.registerDate)

    modalBody.html('')
    modalBody.append(`
    <form class=" bg-mute"> 
        <div class="mb-2">
            <label for="name" class="form-label">name : </label>
            <input disabled type="text" class="form-control " name="name" value=${data.name} required>
        </div>
        <div class="mb-2">
            <label for="cin" class="form-label text-uppercase">cin: </label>
            <input disabled type="text" class="form-control" name="cin" value=${data.cin} required>
        </div>
        <div class="mb-2">
            <label for="city" class="form-label">city: </label>
            <input disabled type="text" class="form-control" name="city" value=${data.city} required>
        </div>
        <div class="mb-2">
            <label for="province" class="form-label">province: </label>
            <input disabled type="text" class="form-control" name="province" value=${data.province} required>
        </div>
        <div class="mb-2">
            <label for="register-date" class="form-label">register date: </label>
            <input disabled type="date" class="form-control" name="register-date" value="${registerDate.getFullYear()}-0${registerDate.getMonth()+1}-0${registerDate.getDay()}" required>
        </div>
        <div class="">
            <label for="telephone" class="form-label">telephone: </label>
            <input disabled type="text" class="form-control" name="telephone" value=${data.telephone} required>
        </div>
    </form>
    `)

    modalFooter.html(`
    <button id="update-button" type="button" class="btn btn-warning">Update</button>
    <button id="cancel-button" hidden class="text-white btn btn-outline-dark offset-left" > cancel </button>
    <button card-id="${data._id}" id="save-button"  hidden class="text-white btn btn-outline-success offset-left"> Save </button>
    `)
}

// update button click
$(document).on("click", "#update-button", function (e) {
    
    $("#update-button").attr("hidden", "true")
    $("#save-button").removeAttr("hidden")
    $("#cancel-button").removeAttr("hidden")
    $("form input").removeAttr("disabled")

})

// cancel button click
$(document).on("click", "#cancel-button", function (e) {

    $("#update-button").removeAttr("hidden", "hidden")
    $("#save-button").attr("hidden", "hidden")
    $("#cancel-button").attr("hidden", "hidden")
    $("form input").attr("disabled", "true")

})

// save updates button click
$(document).on("click", "#save-button", function (e) {

    let newInformation = getInformations(),
        cardId         = $(this).attr("card-id")

    $.ajax({
        type: "put",
        url: `/api/companies/${cardId}`,
        data: newInformation,
        dataType: "json",
        success: function (response) {
            if (response) {
                console.log("success: ", response);
                alert("saved succesfully")
                location.reload()
            }
        },
        error: function (err) {
                console.log("error: ", err);
                alert("there was a problem with your data")
        }
    });
})
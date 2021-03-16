let modalBody    = $(".modal-body"),
    modalFooter  = $(".modal-footer"),
    modal        = new bootstrap.Modal(document.getElementById('more-info-modal')),
    msgAlert     = new bootstrap.Alert(document.getElementById('myAlert'))

// delete card button click and ajax
$(".delete-employee").on("click", function (e) {

    $.ajax({
        type: "DELETE",
        url: `http://localhost/api/employees/${$(this).attr("card-id")}`,
        success: function (response) {
            if (response) {
                console.log("SUCCESS MESSAGE===>", response);
                alert("successfully deleted")
                location.reload()

            }
        },
        error: function (err) {
            if (err) console.log("ERROR MESSAGE===>", err);
            alert("there was a problem with your request")
            location.reload()

        }
    });
})

// edit button click
$('.edit-employee').on("click", function (e) {
    $.ajax({
        type: "GET",
        url: `http://localhost/api/employees/${$(this).attr('card-id')}`,
        success: function (employee) {
            // console.log("SUCCESS MESSAGE===>", employee[0]);
            modal.show()
            $.ajax({
                type: "GET",
                url: "http://localhost/api/companies/",
                success: function (companies) {
                    // console.log("SUCCESS MESSAGE===>", companies);
                    showEditModal(employee[0], companies)
                },
                error: function (err) {
                    // if (err) console.log("ERROR MESSAGE===>", err);
                    alert("there was a problem with your request")
                    location.reload()
                }
            });
        },
        error: function (err) {
            if (err) console.log("ERROR MESSAGE===>", err);
            alert("there was a problem with your request")
            location.reload()
        }
    })
})

function showEditModal(employee, companies) {

    let companySelect = ""

    companies.forEach(company => {
        companySelect += `<option ${company._id === employee.company._id ? "selected": ""} value="${company._id}">${company.name}</option>`
    })

    employee.birthday = new Date(employee.birthday)
    // reset the modal content
    modalBody.html('')

    // render modal edit form
    modalBody.html(`
        <form class="needs-validation">
            <label class=" mb-1" for="id">id:</label>
            <input class="form-control" type="text" name="id", value="${employee.id}" placeholder = "id" disabled>
            
            <label class="mt-2 mb-1" for="first-name">first name:</label>
            <input class="form-control" type="text" name="first-name", value="${employee.firstName}" placeholder = "first name">
            
            <label class="mt-2 mb-1" for="last-name">last name:</label>
            <input class="form-control" type="text" name="last-name", value="${employee.lastName}" placeholder = "last name" required>
            
            <label class="mt-2 mb-1" for="gender">gender:</label>
            <select name="gender" class="form-select" aria-label="gender">
            <option ${employee.gender === "male" ? "selected": ""} value="male">male</option>
            <option ${employee.gender === "female" ? "selected": ""} value="female">female</option>
            </select>
            
            <label class="mt-2 mb-1" for="position">position:</label>
            <select name="manager" class="form-select" aria-label="manager">
            <option ${employee.manager === true ? "selected": ""} value="true">manager</option>
            <option ${employee.manager === false ? "selected": ""} value="false">employee</option>
            </select>
            
            <label class="mt-2 mb-1" for="birthday">birthday:</label>
            <input class="form-control form-control-date" type="date" name="birthday", value="${employee.birthday.getFullYear()}-0${employee.birthday.getMonth()+1}-0${employee.birthday.getDay()}" placeholder = "birthday">
            
            <label class="mt-2 mb-1" for="company">company:</label>

            <select name="company" class="form-select" aria-label="manager">
                ${companySelect}
            </select>
            
            <div card-id="${employee._id}" id="save-employee" class="d-flex justify-content-end ">
                <button class="btn btn-success w-auto mt-3 mb-0 justify-self-end">save</button>
            </div>

        </form>
    `)
}

// save employee button click  
$(document).on("click", "#save-employee", function (e) {
    e.preventDefault()
    let newEmployeeInfo = getEditedInformation()

    // sendign new data to api
    $.ajax({
        type: "PUT",
        url: `http://localhost/api/employees/${$(this).attr("card-id")}`,
        data: newEmployeeInfo,
        dataType: "json",
        success: function (response) {
            if (response) console.log("success message =>", response);
            modal.hide()
            alert("saved successfully")
            location.reload()

        },
        error: function (err) {
            if (err) console.log("error message =>", err);
            alert("there was a problem with your data")
            location.reload()

        }           
    });
})

function getEditedInformation() {
    return {
        firstName: $("[name='first-name']").val(),
        lastName: $("[name='last-name']").val(),
        gender: $("[name='gender']").val(),
        manager: $("[name='manager']").val(),
        birthday: new Date($("[name='birthday']").val()),
        company: $("[name='company']").val()
    }
}

// ================== show new model create button click ==================
// create new button click
$('#new-button').on("click", function (e) {

    $.ajax({
        type: "GET",
        url: "http://localhost/api/companies/",
        success: function (companies) {
            console.log("SUCCESS MESSAGE===>", companies);
            showNewModal(companies)
        },
        error: function (err) {
            if (err) console.log("ERROR MESSAGE===>", err);
            alert("there was a problem with your request")
            location.reload()
        }
    });
})

// =========== rendering model for creating new employee
function showNewModal(companies) {

    let companySelect = ""

    companies.forEach(company => {
        companySelect += `<option value="${company._id}">${company.name}</option>`
    })

    // reset the modal content
    modalBody.html('')

    // render modal create form
    modalBody.html(`
        <form class="needs-validation">
            <label class=" mb-1" for="id">id:</label>
            <input class="form-control" type="text" name="id", value="" placeholder = "id" required>
            
            <label class="mt-2 mb-1" for="first-name">first name:</label>
            <input class="form-control" type="text" name="first-name", value="" placeholder = "first name" required>
            
            <label class="mt-2 mb-1" for="last-name">last name:</label>
            <input class="form-control" type="text" name="last-name", value="" placeholder = "last name" required>
            
            <label class="mt-2 mb-1" for="gender">gender:</label>
            <select name="gender" class="form-select" aria-label="gender" required>
            <option === "male" ? "selected": ""} value="male">male</option>
            <option === "female" ? "selected": ""} value="female">female</option>
            </select>
            
            <label class="mt-2 mb-1" for="position">position:</label>
            <select name="manager" class="form-select" aria-label="manager" required>
            <option === true ? "selected": ""} value="true">manager</option>
            <option === false ? "selected": ""} value="false">employee</option>
            </select>
            
            <label class="mt-2 mb-1" for="birthday">birthday:</label>
            <input class="form-control form-control-date" type="date" name="birthday", value="" placeholder = "birthday" required>
            
            <label class="mt-2 mb-1" for="company">company:</label>

            <select name="company" class="form-select" aria-label="manager" placeholder="company" required>
                ${companySelect}
            </select>
            
            <div card-id="" id="create-employee" class="d-flex justify-content-end ">
                <button class="btn btn-primary w-auto mt-3 mb-0 justify-self-end">create</button>
            </div>

        </form>
    `)
}


// create employee with input data button click  
$(document).on("click", "#create-employee", function (e) {
    e.preventDefault()
    let newEmployeeInfo = getNewInformation()
    console.log(newEmployeeInfo);

    // sendign new data to api
    $.ajax({
        type: "POST",
        url: `http://localhost/api/employees/`,
        data: newEmployeeInfo,
        dataType: "json",
        success: function (response) {
            // if (response) console.log("success message =>", response);
            modal.hide()
            alert("saved successfully")
            location.reload()

        },
        error: function (err) {
            if (err) {

                alert("there was a problem with your data")
                console.log("error message =>", err);
                // location.reload()

            }
        }
    });
})

// get informations of new employee
function getNewInformation() {
    return {
        id: $("[name='id']").val(),
        firstName: $("[name='first-name']").val(),
        lastName: $("[name='last-name']").val(),
        gender: $("[name='gender']").val(),
        manager: $("[name='manager']").val(),
        birthday: new Date($("[name='birthday']").val()),
        company: $("[name='company']").val()

    }
}
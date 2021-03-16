// ============================ Search section =======================

// go to search-bar action focus effect
$(document).on("keyup", function (e) {
    if (e.key === "/") {
        $("[type='search']").focus()

        // $("[type='search']").toggleClass("shadow");
    }
    if (e.key === "Escape") {
        $("[type='search']").blur()
        // $("[type='search']").toggleClass("shadow");
    }
})

// search sync rendering page
$("[type='search']").keyup(function (e) {
    let searchQuery = $(this).val().trim().toLowerCase()
    // searchProducts(searchQuery)
});

// ========================== hover effects ===========================
// card hover shadow effect
$(document).on("mouseover mouseout", ".card", function () {
    $(this).toggleClass("shadow");
});

// // btn hover shadow effect
$("body").on("mouseover mouseout", ".btn-more", function () {
    $(this).toggleClass("shadow");
})
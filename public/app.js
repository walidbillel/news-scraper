$(document).ready(function () {

    getArticles()
})

function getArticles() {
    $.getJSON("/articles", function (data) {
        console.log(data)


        $("#articles").append("<h2> ARTICLES </h2>" + "<hr>");
        // For each one
        for (var i = 0; i < data.length; i++) {

            // Display the apropos information on the page
            $("#articles").append("<p class = notes data-id='" + data[i]._id + "'> <b>Title: " + data[i].title + "</b></p>");
            $("#articles").append("<br>");


            $("#articles").append("<p><b>Summary:</b> " + data[i].summary + "</p>");
            $("#articles").append("<a> Link: " + data[i].link + "</a>");
            $("#articles").append("<br><br>");

            var btnMakeNote = $("<button>");
            btnMakeNote.addClass("makenote-button btn-primary btn-xs");
            btnMakeNote.css("cursor", "pointer");
            btnMakeNote.text("Make a Note");
            btnMakeNote.css("width", "30%");
            btnMakeNote.css("border-radius", "15px");
            btnMakeNote.attr("data-id", data[i]._id)
            var btnViewNotes = $("<button>");
            btnViewNotes.addClass("viewnotes-button btn-primary btn-xs");
            btnViewNotes.css("cursor", "pointer");
            btnViewNotes.text("View Notes");
            btnViewNotes.css("width", "30%");
            btnViewNotes.css("border-radius", "15px");
            btnViewNotes.attr("data-id", data[i]._id)
            $("#articles").append(btnMakeNote);
            $("#articles").append(btnViewNotes);
            $("#articles").append("<br>");
            $("#articles").append("<br>");
            $("#articles").append("<hr>");
        }
    });
}

$(document).on("click", ".makenote-button", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id
    var thisId = $(this).attr("data-id");
    console.log(thisId)
    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            $("#notes").append("<h6> Title: " + data.title + "</h6>");
            // An input to enter a new title
            $("#notes").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

            $("#notes").append("<br>")
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button class='btn btn-primary btn-xs' data-id='" + data._id + "' id='savenote'>Save</button>");

        });
});

$(document).on("click", ".viewnotes-button", function () {
    // Empty the notes from the note section
    var thisId = $(this).attr("data-id");
    viewNotes(thisId)
});

function viewNotes(ID) {

    deleteID = "";
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = ID;
    deleteID = ID;

    $("#notes").append("<h2>Article Notes:</h2>" + "<hr>");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);

            if (data.note) {

                // $.get("/notes", function (noteDb) {
                //     console.log(noteDb)
                    for (var i = 0; i < data.note.length; i++) {

                        $("#notes").append("<h4 class = 'notes'>" + data.note[i].title + "</h4>");
                        $("#notes").append("<p class = 'notes'>" + data.note[i].body + "</p>");
                        var btnDeleteNote = $("<button>");
                        btnDeleteNote.addClass("deletenote-button btn-primary btn-xs");
                        btnDeleteNote.css("cursor", "pointer");
                        btnDeleteNote.text("Delete");
                        btnDeleteNote.css("width", "30%");
                        btnDeleteNote.css("border-radius", "15px");
                        btnDeleteNote.attr("data-id", data.note[i]._id)
                        $("#notes").append(btnDeleteNote);
                        $("#notes").append("<br>");
                        $("#notes").append("<hr>");
                    }
                // })

            }

            if (data.note.length < 1) {
                $("#notes").empty();
                $("#notes").html("<h2>There are no notes for this article</h2>");
            }

        });
}

$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
            viewNotes(thisId);
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});

$(document).on("click", ".deletenote-button", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "Delete",
        url: "/notes/" + thisId,
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
            viewNotes(deleteID);
        });
});
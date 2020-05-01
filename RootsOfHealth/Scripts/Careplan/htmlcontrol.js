var new_id = 0;
$(function () {
    HtmlControlDragnDrop();

    ShowPreviewButton();
    GetFormByTemplatePath(templatePath);   
})
function CheckSortableHtml() {
    $("#ddlform").val("0");
    HtmlControlDragnDrop();
}
//HtmlControlDragnDrop=>use for drag html control from left list and drop on right dropable area
function HtmlControlDragnDrop() {
    
    $('#control-box li').draggable({
        connectToSortable: '#droppable',
        helper: function () { 
            var cloned = $(this).clone();
            cloned.attr('id', (++new_id).toString());
            return cloned;
        },
    });
    $("#droppable").sortable({
        connectWith: "#control-box",
        containment: "#droppable",
        placeholder: "highlight",
        start: function (e, ui) {
            placeholderHeight = ui.item.outerHeight();
            placeholderWidth = ui.item.outerWidth();
            if (placeholderWidth > 100) {
                ui.placeholder.height(placeholderHeight - 2);
                ui.placeholder.width(placeholderWidth - 2);
            } else {
                $(ui.placeholder).css('display', 'none');
            }

        },
        receive: function (event, ui) {
            var draggableId = ui.item.attr("data-type");
            var currentid = $(ui.helper).clone().attr('id')
            var newid = draggableId + currentid;
            while (true) {
                if ($(document.getElementById(newid)).length) {
                    currentid = parseInt(currentid) + 1;
                    newid = draggableId + currentid;
                } else {
                    break;
                }
            }
            switch (draggableId) {
                case "label":
                    var str = '<div  class="dragresize col-md-12"><div class="frmbtn"><div class="form-group"><label id="' + newid + '" class="editable">Html</label><div class="html-content"></div></div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div>';
                    $(this).find("li[data-type='label']").replaceWith(str);
                    break;
                case "checkbox-group":
                    var str = '<div  class="dragresize col-md-12"><div class="frmbtn"><div class="form-group" id="' + newid + '">' +
                        '<label class="checkbox-group required-asterisk">Check Box (Multiple)</label>' +
                        '<div class="custom-control custom-checkbox  d-inline-block mr-2">' +
                        '<input  type="checkbox" class="custom-control-input" name="checkbox" value="true" id="checkbox1">' +
                        '<label class="custom-control-label" for="checkbox1" value="true">Yes</label></div>' +
                        '<div class="custom-control custom-checkbox  d-inline-block mr-2">' +
                        '<input type="checkbox" class="custom-control-input"  name="checkbox" value="false" id="checkbox2">' +
                        '<label class="custom-control-label" for="checkbox2">No</label></div>' +
                        '</div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div>';
                    $(this).find("li[data-type='checkbox-group']").replaceWith(str);
                    break;
                case "date":
                    var str = '<div  class="dragresize col-md-12"><div class="frmbtn"><div class="form-group">' +
                        '<label class="required-asterisk">Label</label>' +
                        '<input id="' + newid + '"  type="date" class="form-control" id="">' +
                        '</div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div> ';
                    $(this).find("li[data-type='date']").replaceWith(str);
                    break;
                case "file":
                    var str = '<div  class="dragresize col-md-12"><div class="frmbtn"><div class="form-group">' +
                        '<label class="required-asterisk">Label</label >' +
                        '<input id="' + newid + '"  type="file" class="form-control" id="">' +
                        '</div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div>';

                    $(this).find("li[data-type='file']").replaceWith(str);
                    break;
                case "number":
                    var str = '<div  class="dragresize col-md-12"><div class="frmbtn"><div class="form-group">' +
                        '<label class="required-asterisk">Label</label>' +
                        '<input id="' + newid + '"  type="number" class="form-control" id="">' +
                        '</div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div>';
                    $(this).find("li[data-type='number']").replaceWith(str);
                    break;
                case "radio-group":
                    var str = '<div  class="dragresize col-md-12"><div class="frmbtn"><div class="form-group"  id="' + newid + '">' +
                        '<label class="radiobox-group required-asterisk">Radio</label>' +
                        '<div class="custom-control custom-radio d-inline-block mr-2">' +
                        '<input  type="radio" class="custom-control-input" name="radio" value="true" id="radio1">' +
                        '<label class="custom-control-label" for="radio1" value="true">Yes</label></div>' +
                        '<div class="custom-control custom-radio d-inline-block mr-2">' +
                        '<input type="radio" class="custom-control-input"  name="radio" value="false" id="radio2">' +
                        '<label class="custom-control-label" for="radio2">No</label></div>' +
                        '</div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div>';
                    $(this).find("li[data-type='radio-group']").replaceWith(str);
                    break;
                case "select":
                    var str = '<div  class="dragresize col-md-12"><div class="frmbtn"><div class="form-group">' +
                        '<label class="required-asterisk">Select</label>' +
                        ' <select id="' + newid + '" class="form-control">' +
                        ' <option value="0">Select Option</option>' +
                        '<option  value="1">1</option>' +
                        '<option  value="2">2</option>' +
                        '<option  value="3">3</option>' +
                        ' </select>' +
                        '</div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div>';
                    $(this).find("li[data-type='select']").replaceWith(str);
                    break;
                case "text":
                    var str = '<div class="dragresize col-md-12"><div class="frmbtn"><div class="form-group">' +
                        '<label class="required-asterisk">Label</label>' +
                        '<input id="' + newid + '"  type="text" class="form-control" id="">' +
                        '</div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div>';
                    $(this).find("li[data-type='text']").replaceWith(str);
                    break;
                case "textarea":
                    var str = '<div  class="dragresize col-md-12"><div class="frmbtn"><div class="form-group">' +
                        '<label class="required-asterisk">Textarea</label>' +
                        '<textarea id="' + newid + '"  class="form-control" name="my-textarea"></textarea>' +
                        '</div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div>';
                    $(this).find("li[data-type='textarea']").replaceWith(str);
                    break;

            }
        },
        stop: function (event, ui) {
            $('input,textarea').on('input', function (e) {
                $(this).val('');
            });
            $('input[type="checkbox"],input[type="radio"]').click(function (event) {
                var $checkbox = $(this);
                setTimeout(function () {
                    $checkbox.removeAttr('checked');
                }, 0);

                event.preventDefault();
                event.stopPropagation();
            });

        }
    });
}
//EditHtml=>use to open poup with current property of control
function EditHtml(type, ID) {
    var popupString = '';
    var isdatacolexist = $("#" + ID).attr("data-columnold");

    $(".modal-body").html("");
    switch (type) {
        case "label":
            popupString = '<div class="modal-row">' +
                '<label></label>' +
                '<textarea   control-id="' + ID + '" class="form-control lbltext"  value="">' + $("#" + ID).next().html() + '</textarea>' +
                '</div>';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {

                if ($('.lbltext').summernote('isEmpty')) {
                    toastr.error("", "Editor content is empty", { progressBar: true });
                    return;
                }
                var markupStr = $('.lbltext').summernote('code');
                $("#" + ID).next(".html-content").html("");
                $("#" + ID).next(".html-content").html(markupStr);
                $('.lbltext').summernote('destroy');
                $("#exampleModalCenter").modal("hide");

            });
            break;
        case "checkbox-group":
            var isrequired = $("#" + ID).find(".required-asterisk");
            popupString = `<div class="modal-row custom-control custom-checkbox">`;
            if (isrequired.length) {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" checked>';
            } else {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" >'
            }
            popupString += `<label class="custom-control-label" for="required-input">Required</label></div>`;
            popupString += `<div class="modal-row"><label>Label position: </label><div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labeltop" id="label-top" name="radio-position" value="top" ${ $("#" + ID).hasClass("f-g-left") ? "" : "checked"}>
    <label class="custom-control-label" for="label-top">top</label></div>
    <div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labelleft" id="label-left" name="radio-position" value="left"  ${ $("#" + ID).hasClass("f-g-left") ? "checked" : ""}>
    <label class="custom-control-label" for="label-left">left</label></div>
    </div>`;
            popupString += '<div class="modal-row">' +
                '<label>Label Text</label>' +
                '<input  type="text" control-id="' + ID + '" class="form-control lbltext"  onkeyup="ValidateColumnName(this)" value="' + $("#" + ID).find(".checkbox-group").html() + '"/>' +
                '</div>';
            var isdatacolexistcheckbox = $("#" + ID).find("input").first().attr("data-column");

            if (typeof isdatacolexistcheckbox !== typeof undefined && isdatacolexistcheckbox !== false) {
                popupString += '<div class="modal-row"><label>Column Name</label><input type="text" class="form-control lblcolname" value="' + $("#" + ID).find("input").first().attr("data-column") + '"></div>';

            } else {
                popupString += '<div class="modal-row"><label>Column Name</label><input type="text" class="form-control lblcolname" value=""></div>';

            }

            var ismd4 = $("#" + ID).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $("#" + ID).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $("#" + ID).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Input Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="inputsize">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + ismd12 + '>Large</option>' +
                '</select></div></div>';
            popupString += `<div class="modal-row"><div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input checkhorizontal" id="radio-horizontal" name="radio" value="horizontal" ${ $("#" + ID).hasClass("vertical") ? "" : "checked"}>
    <label class="custom-control-label" for="radio-horizontal">Horizontal</label></div>
    <div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input checkvertical" id="radio-vertical" name="radio" value="vertical"  ${ $("#" + ID).hasClass("vertical") ? "checked" : ""}>
    <label class="custom-control-label" for="radio-vertical">Vertical</label></div>
    </div>`;
            popupString += '<div class="modal-row">' +
                '<label>Options</label>';
            $('.dragresize  #' + ID + " [type=checkbox]").each(function () {
                popupString += '<div class="option-block">' +
                    '<div class="option-fields">' +
                    ' <input type="text" placeholder="Key" class="form-control"  value="' + $(this).next().text() + '"/>' +
                    ' <input type="text" placeholder="Value" class="form-control"  value="' + $(this).attr("value") + '"/>' +
                    '</div>' +
                    '<div class="popup-event-btn">' +
                    '<button class="event-btn file-edit" onclick="addoption(this)"><i class="fas fa-plus"></i></button>' +
                    '<button class="event-btn file-remove" onclick="RemoveOption(this)"> <i class="fa fa-minus-circle" aria-hidden="true"></i></button > ' +
                    '</div></div>'
            });
            popupString += '</div></div>';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($(".lbltext").val() == "") {
                    toastr.error("", "Label text is required", { progressBar: true });
                    return;
                }
                if ($(".lblcolname").val() == "") {
                    toastr.error("", "Column name is required", { progressBar: true });
                    return;
                }
                if (!ValidateColumn($(".lblcolname").val())) {
                    toastr.error("", "Enter a vaild column name", { progressBar: true })
                    return;
                }
                if (isColumnNameValid($(".lblcolname").val(), $("#" + ID).find("input").first().attr("id"))) {
                    $(".dragresize  [id=" + ID + "]").html("");
                    $(".dragresize  [id=" + ID + "]").html("<label class='checkbox-group'>Checkbox(Multiple)</label>");

                    var allTextArray = $('.option-block').map(function () {
                        if ($(this).find("[placeholder=Key]").val() != '')

                            return $(this).find("[placeholder=Key]").val()
                    }).get();
                    var duplicateTextArray = allTextArray.filter(function (element, pos) {
                        if (allTextArray.indexOf(element) != pos) {
                            return true;
                        }
                        else {
                            return false;
                        }

                    });
                    var allValueArray = $('.option-block').map(function () {
                        if ($(this).find("[placeholder=Value]").val() != '')

                            return $(this).find("[placeholder=Value]").val()
                    }).get();
                    var duplicateValueArray = allValueArray.filter(function (element, pos) {
                        if (allValueArray.indexOf(element) != pos) {
                            return true;
                        }
                        else {
                            return false;
                        }

                    });
                    if (duplicateValueArray.length != 0) {
                        toastr.error("", "Option value can not be duplicate", { progressBar: true });
                        return;
                    }
                    if (duplicateTextArray.length != 0) {
                        toastr.error("", "Option text can not be duplicate", { progressBar: true });
                        return;
                    }
                    var option_data = "<div class='checkbox-html'>";
                    $(".option-block").each(function (index) {
                        option_data += `<div class="custom-control custom-checkbox  d-inline-block mr-2">
    <input  type="checkbox" class="custom-control-input" id="${ID + index}"  name="${ID}"  value="${$(this).find("[placeholder = Value]").val()}">
    <label class="custom-control-label" for="${ID + index}">${$(this).find("[placeholder = Key]").val()}</label></div>
    `; 
                    });
                    option_data += "</div>";
                    //$(option_data).appendTo(".dragresize  [id=" + ID + "]");
                    $("#" + ID).find("div").html("");
                    $("#" + ID).append(option_data);
                    if (typeof isdatacolexistcheckbox !== typeof undefined && isdatacolexistcheckbox !== false) {
                        $("#" + ID).find("input").first().attr("data-columnold", isdatacolexistcheckbox);
                    } else {
                        $("#" + ID).find("input").first().attr("data-columnold", $(".lblcolname").val());
                    }
                    $("#" + ID).find("input").first().attr("data-column", $(".lblcolname").val());
                    if ($("#required-input").prop("checked")) {
                        $("#" + ID).find('label:first-child').addClass("required-asterisk");
                    } else {
                        $("#" + ID).find('label:first-child').removeClass("required-asterisk");
                    }
                    $("#" + ID).find(".checkbox-group").html($(".lbltext").val());
                    $("#" + ID).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12 invalid-field").addClass($("#inputsize").val());
                    if ($(".checkhorizontal").prop("checked")) {
                        $("#" + ID).removeClass("vertical");
                    } else if ($(".checkvertical").prop("checked")) {
                        $("#" + ID).addClass("vertical");
                    }
                    if ($(".labeltop").prop("checked")) {
                        $("#" + ID).removeClass("f-g-left");
                        $("#" + ID).find('label:first-child').removeClass("label-left");
                    } else if ($(".labelleft").prop("checked")) {
                        $("#" + ID).addClass("f-g-left");
                        $("#" + ID).find('label:first-child').addClass("label-left");
                    }
                    $("#exampleModalCenter").modal("hide");
                }
            });
            break;
        case "date":
            var isrequired = $("#" + ID).prev().hasClass("required-asterisk");
            popupString = `<div class="modal-row custom-control custom-checkbox">`;
            if (isrequired) {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" checked>';
            } else {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" >'
            }
            popupString += `<label class="custom-control-label" for="required-input">Required</label></div>`;
            popupString += `<div class="modal-row"><label>Label position: </label><div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labeltop" id="label-top" name="radio-position" value="top" ${ $("#" + ID).closest(".form-group").hasClass("f-g-left") ? "" : "checked"}>
    <label class="custom-control-label" for="label-top">top</label></div>
    <div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labelleft" id="label-left" name="radio-position" value="left"  ${ $("#" + ID).closest(".form-group").hasClass("f-g-left") ? "checked" : ""}>
    <label class="custom-control-label" for="label-left">left</label></div>
    </div>`;
            popupString += '<div class="modal-row">' +
                '<label>Label Text</label>' +
                '<input  type="text" control-id="' + ID + '" class="form-control lbltext" onkeyup="ValidateColumnName(this)" value="' + $("#" + ID).prev().html() + '"/>' +
                '</div>';
            if (typeof isdatacolexist !== typeof undefined && isdatacolexist !== false) {
                popupString += '<div class="modal-row"><label>Column Name</label><input type="text" class="form-control lblcolname" value="' + $("#" + ID).attr("data-column") + '"></div>';

            } else {
                popupString += '<div class="modal-row"><label>Column Name</label><input type="text" class="form-control lblcolname" value=""></div>';
            }
            var isfieldmd4 = $("#" + ID).hasClass("col-md-4") ? "selected" : "";
            var isfieldmd6 = $("#" + ID).hasClass("col-md-6") ? "selected" : "";
            var isfieldmd12 = $("#" + ID).hasClass("col-md-12") ? "selected" : "";
            if (isfieldmd4 == "" && isfieldmd6 == "" && isfieldmd12 == "") isfieldmd12 = "selected";


            var ismd4 = $("#" + ID).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $("#" + ID).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $("#" + ID).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Field Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="inputsize" onchange="CheckFieldSize(this)">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + ismd12 + '>Large</option>' +
                '</select></div></div>';

            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Input Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="fieldsize">' +
                '<option value="col-md-4" ' + isfieldmd4 + '>Small</option>' +
                '<option value="col-md-6" ' + isfieldmd6 + '>Medium</option>' +
                '<option value="" ' + isfieldmd12 + '>Large</option>' +
                '</select></div></div>';
            popupString += '</div>';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($(".lbltext").val() == "") {
                    toastr.error("", "Label text is required", { progressBar: true });
                    return;
                }
                if ($(".lblcolname").val() == "") {
                    toastr.error("", "Column name is required", { progressBar: true });
                    return;
                }
                if (!ValidateColumn($(".lblcolname").val())) {
                    toastr.error("", "Enter a vaild column name", { progressBar: true })
                    return;
                }
                if (isColumnNameValid($(".lblcolname").val(), ID)) {
                    $("#" + ID).prev().html($(".lbltext").val());
                    if (typeof isdatacolexist !== typeof undefined && isdatacolexist !== false) {
                        $("#" + ID).attr("data-columnold", isdatacolexist);
                    } else {
                        $("#" + ID).attr("data-columnold", $(".lblcolname").val());
                    }
                    $("#" + ID).attr("data-column", $(".lblcolname").val());

                    if ($("#required-input").prop("checked")) {
                        $("#" + ID).prev().addClass("required-asterisk");
                    } else {
                        $("#" + ID).prev().removeClass("required-asterisk");
                    }
                    if ($(".labeltop").prop("checked")) {
                        $("#" + ID).closest(".form-group").removeClass("f-g-left");
                        $("#" + ID).closest(".form-group").find('label:first-child').removeClass("label-left");
                    } else if ($(".labelleft").prop("checked")) {
                        $("#" + ID).closest(".form-group").addClass("f-g-left");
                        $("#" + ID).closest(".form-group").find('label:first-child').addClass("label-left");
                    }
                    $("#" + ID).removeClass("col-md-4 col-md-6 col-md-12").addClass($("#fieldsize").val());
                    $("#" + ID).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12 invalid-field").addClass($("#inputsize").val());
                    $("#exampleModalCenter").modal("hide");
                }
            });
            break;
        case "file":
            var isrequired = $("#" + ID).prev().hasClass("required-asterisk");
            popupString = `<div class="modal-row custom-control custom-checkbox">`;
            if (isrequired) {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" checked>';
            } else {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" >'
            }
            popupString += `<label class="custom-control-label" for="required-input">Required</label></div>`;
            popupString += `<div class="modal-row"><label>Label position: </label><div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labeltop" id="label-top" name="radio-position" value="top" ${ $("#" + ID).closest(".form-group").hasClass("f-g-left") ? "" : "checked"}>
    <label class="custom-control-label" for="label-top">top</label></div>
    <div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labelleft" id="label-left" name="radio-position" value="left"  ${ $("#" + ID).closest(".form-group").hasClass("f-g-left") ? "checked" : ""}>
    <label class="custom-control-label" for="label-left">left</label></div>
    </div>`;
            popupString += '<div class="modal-row">' +
                '<label>Label Text</label>' +
                '<input  type="text" control-id="' + ID + '" class="form-control lbltext" onkeyup="ValidateColumnName(this)" value="' + $("#" + ID).prev().html() + '"/>' +
                '</div>';
            var ismd4 = $("#" + ID).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $("#" + ID).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $("#" + ID).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";
            if (typeof isdatacolexist !== typeof undefined && isdatacolexist !== false) {
                popupString += '<div class="modal-row"><label>Column Name</label><input type="text" class="form-control lblcolname" value="' + $("#" + ID).attr("data-column") + '"></div>';

            } else {
                popupString += '<div class="modal-row"><label>Column Name</label><input type="text" class="form-control lblcolname" value=""></div>';
            }
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Input Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="inputsize">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12"' + ismd12 + '>Large</option>' +
                '</select></div></div>';
            popupString += '</div>';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($(".lbltext").val() == "") {
                    toastr.error("", "Label text is required", { progressBar: true });
                    return;
                }
                if ($(".lblcolname").val() == "") {
                    toastr.error("", "Column name is required", { progressBar: true });
                    return;
                }
                if (!ValidateColumn($(".lblcolname").val())) {
                    toastr.error("", "Enter a vaild column name", { progressBar: true })
                    return;
                }
                if (isColumnNameValid($(".lblcolname").val(), ID)) {
                    $("#" + ID).prev().html($(".lbltext").val());
                    if (typeof isdatacolexist !== typeof undefined && isdatacolexist !== false) {
                        $("#" + ID).attr("data-columnold", isdatacolexist);
                    } else {
                        $("#" + ID).attr("data-columnold", $(".lblcolname").val());
                    }
                    $("#" + ID).attr("data-column", $(".lblcolname").val());
                    if ($("#required-input").prop("checked")) {
                        $("#" + ID).prev().addClass("required-asterisk");
                    } else {
                        $("#" + ID).prev().removeClass("required-asterisk");
                    }
                    if ($(".labeltop").prop("checked")) {
                        $("#" + ID).closest(".form-group").removeClass("f-g-left");
                        $("#" + ID).closest(".form-group").find('label:first-child').removeClass("label-left");
                    } else if ($(".labelleft").prop("checked")) {
                        $("#" + ID).closest(".form-group").addClass("f-g-left");
                        $("#" + ID).closest(".form-group").find('label:first-child').addClass("label-left");
                    }
                    $("#" + ID).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12 invalid-field").addClass($("#inputsize").val());
                    $("#exampleModalCenter").modal("hide");
                }
            });
            break;
        case "number":
            var isrequired = $("#" + ID).prev().hasClass("required-asterisk");
            popupString = `<div class="modal-row custom-control custom-checkbox">`;
            if (isrequired) {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" checked>';
            } else {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" >'
            }
            popupString += `<label class="custom-control-label" for="required-input">Required</label></div>`;
            popupString += `<div class="modal-row"><label>Label position: </label><div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labeltop" id="label-top" name="radio-position" value="top" ${ $("#" + ID).closest(".form-group").hasClass("f-g-left") ? "" : "checked"}>
    <label class="custom-control-label" for="label-top">top</label></div>
    <div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labelleft" id="label-left" name="radio-position" value="left"  ${ $("#" + ID).closest(".form-group").hasClass("f-g-left") ? "checked" : ""}>
    <label class="custom-control-label" for="label-left">left</label></div>
    </div>`;
            popupString += '<div class="modal-row">' +
                '<label>Label Text</label>' +
                '<input  type="text" control-id="' + ID + '" class="form-control lbltext" onkeyup="ValidateColumnName(this)" value="' + $("#" + ID).prev().html() + '"/>' +
                '</div>';
            if (typeof isdatacolexist !== typeof undefined && isdatacolexist !== false) {
                popupString += '<div class="modal-row"><label>Column Name</label><input type="text" class="form-control lblcolname" value="' + $("#" + ID).attr("data-column") + '"></div>';

            } else {
                popupString += '<div class="modal-row"><label>Column Name</label><input type="text" class="form-control lblcolname" value=""></div>';
            }
            var isfieldmd4 = $("#" + ID).hasClass("col-md-4") ? "selected" : "";
            var isfieldmd6 = $("#" + ID).hasClass("col-md-6") ? "selected" : "";
            var isfieldmd12 = $("#" + ID).hasClass("col-md-12") ? "selected" : "";

            if (isfieldmd4 == "" && isfieldmd6 == "" && isfieldmd12 == "") isfieldmd12 = "selected";


            var ismd4 = $("#" + ID).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $("#" + ID).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $("#" + ID).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Field Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="inputsize" onchange="CheckFieldSize(this)">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + ismd12 + '>Large</option>' +
                '</select></div></div>';

            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Input Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="fieldsize">' +
                '<option value="col-md-4" ' + isfieldmd4 + '>Small</option>' +
                '<option value="col-md-6" ' + isfieldmd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + isfieldmd12 + '>Large</option>' +
                '</select></div></div>';

            popupString += '</div>';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($(".lbltext").val() == "") {
                    toastr.error("", "Label text is required", { progressBar: true });
                    return;
                }
                if ($(".lblcolname").val() == "") {
                    toastr.error("", "Column name is required", { progressBar: true });
                    return;
                }
                if (!ValidateColumn($(".lblcolname").val())) {
                    toastr.error("", "Enter a vaild column name", { progressBar: true })
                    return;
                }
                if (isColumnNameValid($(".lblcolname").val(), ID)) {
                    $("#" + ID).prev().html($(".lbltext").val());
                    if (typeof isdatacolexist !== typeof undefined && isdatacolexist !== false) {
                        $("#" + ID).attr("data-columnold", isdatacolexist);
                    } else {
                        $("#" + ID).attr("data-columnold", $(".lblcolname").val());
                    }
                    $("#" + ID).attr("data-column", $(".lblcolname").val());
                    if ($("#required-input").prop("checked")) {
                        $("#" + ID).prev().addClass("required-asterisk");
                    } else {
                        $("#" + ID).prev().removeClass("required-asterisk");
                    }
                    if ($(".labeltop").prop("checked")) {
                        $("#" + ID).closest(".form-group").removeClass("f-g-left");
                        $("#" + ID).closest(".form-group").find('label:first-child').removeClass("label-left");
                    } else if ($(".labelleft").prop("checked")) {
                        $("#" + ID).closest(".form-group").addClass("f-g-left");
                        $("#" + ID).closest(".form-group").find('label:first-child').addClass("label-left");
                    }
                    $("#" + ID).removeClass("col-md-4 col-md-6 col-md-12").addClass($("#fieldsize").val());
                    $("#" + ID).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12 invalid-field").addClass($("#inputsize").val());
                    $("#exampleModalCenter").modal("hide");
                }
            });
            break;
        case "radio-group":
            var isrequired = $("#" + ID).find(".required-asterisk");
            popupString = `<div class="modal-row custom-control custom-checkbox">`;
            if (isrequired.length) {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" checked>';
            } else {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" >'
            }
            popupString += `<label class="custom-control-label" for="required-input">Required</label></div>`;
            popupString += `<div class="modal-row"><label>Label position: </label><div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labeltop" id="label-top" name="radio-position" value="top" ${ $("#" + ID).hasClass("f-g-left") ? "" : "checked"}>
    <label class="custom-control-label" for="label-top">top</label></div>
    <div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labelleft" id="label-left" name="radio-position" value="left"  ${ $("#" + ID).hasClass("f-g-left") ? "checked" : ""}>
    <label class="custom-control-label" for="label-left">left</label></div>
    </div>`;
            popupString += '<div class="modal-row">' +
                '<label>Label Text</label>' +
                '<input  type="text" control-id="' + ID + '" class="form-control lbltext" onkeyup="ValidateColumnName(this)" value="' + $("#" + ID).find(".radiobox-group").html() + '"/>' +
                '</div>';
            var isdatacolexistradio = $("#" + ID).find("input").first().attr("data-column");

            if (typeof isdatacolexistradio !== typeof undefined && isdatacolexistradio !== false) {
                popupString += '<div class="modal-row"><label>Column Name</label><input type="text" class="form-control lblcolname" value="' + $("#" + ID).find("input").first().attr("data-column") + '"></div>';

            } else {
                popupString += '<div class="modal-row"><label>Column Name</label><input type="text" class="form-control lblcolname" value=""></div>';
            }
            var ismd4 = $("#" + ID).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $("#" + ID).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $("#" + ID).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Input Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="inputsize">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + ismd12 + '>Large</option>' +
                '</select></div></div>';
            popupString += `<div class="modal-row"><div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input radiohorizontal" id="radio-horizontal" name="radio" value="horizontal" ${ $("#" + ID).hasClass("vertical") ? "" : "checked"}>
    <label class="custom-control-label" for="radio-horizontal">Horizontal</label></div>
    <div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input radiovertical" id="radio-vertical" name="radio" value="vertical"  ${ $("#" + ID).hasClass("vertical") ? "checked" : ""}>
    <label class="custom-control-label" for="radio-vertical">Vertical</label></div>
    </div>`;
            popupString += '<div class="modal-row">' +
                '<label>Options</label>';
            $('.dragresize  #' + ID + " [type=radio]").each(function () {
                popupString += '<div class="option-block">' +
                    '<div class="option-fields">' +
                    ' <input type="text" placeholder="Key" class="form-control"  value="' + $(this).next().text() + '"/>' +
                    ' <input type="text" placeholder="Value" class="form-control"  value="' + $(this).attr("value") + '"/>' +
                    '</div>' +
                    '<div class="popup-event-btn">' +
                    '<button class="event-btn file-edit" onclick="addoption(this)"><i class="fas fa-plus"></i></button>' +
                    '<button class="event-btn file-remove" onclick="RemoveOption(this)"> <i class="fa fa-minus-circle" aria-hidden="true"></i></button > ' +
                    '</div></div>'
            });
            popupString += '</div></div> ';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($(".lbltext").val() == "") {
                    toastr.error("", "Label text is required", { progressBar: true });
                    return;
                }
                if ($(".lblcolname").val() == "") {
                    toastr.error("", "Column name is required", { progressBar: true });
                    return;
                }
                if (!ValidateColumn($(".lblcolname").val())) {
                    toastr.error("", "Enter a vaild column name", { progressBar: true })
                    return;
                }
                if (isColumnNameValid($(".lblcolname").val(), $("#" + ID).find("[type=radio]").attr("id"))) {
                    $(".dragresize  [id=" + ID + "]").html("");
                    $(".dragresize  [id=" + ID + "]").html("<label class='radiobox-group'>Radio</label>");

                    var allTextArray = $('.option-block').map(function () {
                        if ($(this).find("[placeholder=Key]").val() != '')

                            return $(this).find("[placeholder=Key]").val()
                    }).get();
                    var duplicateTextArray = allTextArray.filter(function (element, pos) {
                        if (allTextArray.indexOf(element) != pos) {
                            return true;
                        }
                        else {
                            return false;
                        }

                    });
                    var allValueArray = $('.option-block').map(function () {
                        if ($(this).find("[placeholder=Value]").val() != '')

                            return $(this).find("[placeholder=Value]").val()
                    }).get();
                    var duplicateValueArray = allValueArray.filter(function (element, pos) {
                        if (allValueArray.indexOf(element) != pos) {
                            return true;
                        }
                        else {
                            return false;
                        }

                    });
                    if (duplicateValueArray.length != 0) {
                        toastr.error("", "Option value can not be duplicate", { progressBar: true });
                        return;
                    }
                    if (duplicateTextArray.length != 0) {
                        toastr.error("", "Option text can not be duplicate", { progressBar: true });
                        return;
                    }
                    var option_data = "<div class='radio-html'>";
                    $(".option-block").each(function (index) {
                         option_data += `<div class="custom-control custom-radio d-inline-block mr-2">
    <input  type="radio" class="custom-control-input" id="${ID + index}"  name="${ID}"  value="${$(this).find("[placeholder = Value]").val()}">
    <label class="custom-control-label" for="${ID + index}">${$(this).find("[placeholder = Key]").val()}</label></div>
    `;
                    });
                    option_data += "</div>";
                    $("#" + ID).find("div").html("");
                    $("#" + ID).append(option_data);
                    if (typeof isdatacolexistradio !== typeof undefined && isdatacolexistradio !== false) {
                        $("#" + ID).find("input").first().attr("data-columnold", isdatacolexistradio);
                    } else {
                        $("#" + ID).find("input").first().attr("data-columnold", $(".lblcolname").val());
                    }
                    $("#" + ID).find("input").first().attr("data-column", $(".lblcolname").val());
                    $("#" + ID).find(".radiobox-group").html($(".lbltext").val());
                    if ($("#required-input").prop("checked")) {
                        $("#" + ID).find('label:first-child').addClass("required-asterisk");
                    } else {
                        $("#" + ID).find('label:first-child').removeClass("required-asterisk");
                    }
                    $("#" + ID).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12 invalid-field").addClass($("#inputsize").val());
                    if ($(".radiohorizontal").prop("checked")) {
                        $("#" + ID).removeClass("vertical");
                    } else if ($(".radiovertical").prop("checked")) {
                        $("#" + ID).addClass("vertical");
                    }
                    if ($(".labeltop").prop("checked")) {
                        $("#" + ID).removeClass("f-g-left");
                        $("#" + ID).find('label:first-child').removeClass("label-left");
                    } else if ($(".labelleft").prop("checked")) {
                        $("#" + ID).addClass("f-g-left");
                        $("#" + ID).find('label:first-child').addClass("label-left");
                    }
                    $("#exampleModalCenter").modal("hide");
                }
            });
            break;
        case "select":
            var isrequired = $("#" + ID).prev().hasClass("required-asterisk");
            popupString = `<div class="modal-row custom-control custom-checkbox">`;
            if (isrequired) {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" checked>';
            } else {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" >'
            }
            popupString += `<label class="custom-control-label" for="required-input">Required</label></div>`;
            popupString += `<div class="modal-row"><label>Label position: </label><div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labeltop" id="label-top" name="radio-position" value="top" ${ $("#" + ID).closest(".form-group").hasClass("f-g-left") ? "" : "checked"}>
    <label class="custom-control-label" for="label-top">top</label></div>
    <div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labelleft" id="label-left" name="radio-position" value="left"  ${ $("#" + ID).closest(".form-group").hasClass("f-g-left") ? "checked" : ""}>
    <label class="custom-control-label" for="label-left">left</label></div>
    </div>`;
            popupString += '<div class="modal-row">' +
                '<label>Label Text</label>' +
                '<input  type="text" control-id="' + ID + '" class="form-control lbltext" onkeyup="ValidateColumnName(this)" value="' + $("#" + ID).prev().html() + '"/>' +
                '</div>';
            if (typeof isdatacolexist !== typeof undefined && isdatacolexist !== false) {
                popupString += '<div class="modal-row"><label>Column Name</label><input type="text" class="form-control lblcolname" value="' + $("#" + ID).attr("data-column") + '"></div>';

            } else {
                popupString += '<div class="modal-row"><label>Column Name</label><input type="text" class="form-control lblcolname" value=""></div>';
            }
            var ismd4 = $("#" + ID).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $("#" + ID).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $("#" + ID).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Input Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="inputsize">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + ismd12 + '>Large</option>' +
                '</select></div></div>';
            popupString += '<div class="modal-row">' +
                '<label>Options</label>';

            $('#' + ID).find('option').each(function () {
                if ($(this).val() == 0) return;
                popupString += '<div class="option-block">' +
                    '<div class="option-fields">' +
                    ' <input type="text" placeholder="Key" class="form-control"  value="' + $(this).text() + '"/>' +
                    ' <input type="text" placeholder="Value" class="form-control"  value="' + $(this).val() + '"/>' +
                    '</div>' +
                    '<div class="popup-event-btn">' +
                    '<button class="event-btn file-edit" onclick="addoption(this)"><i class="fas fa-plus"></i></button>' +
                    '<button class="event-btn file-remove" onclick="RemoveOption(this)"> <i class="fa fa-minus-circle" aria-hidden="true"></i></button > ' +
                    '</div></div>'
            });
            popupString += '</div></div> ';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($(".lbltext").val() == "") {
                    toastr.error("", "Label text is required", { progressBar: true });
                    return;
                }
                if ($(".lblcolname").val() == "") {
                    toastr.error("", "Column name is required", { progressBar: true });
                    return;
                }
                if (!ValidateColumn($(".lblcolname").val())) {
                    toastr.error("", "Enter a vaild column name", { progressBar: true })
                    return;
                }
                if (isColumnNameValid($(".lblcolname").val(), ID)) {
                    $("#" + ID).prev().html($(".lbltext").val());
                    if (typeof isdatacolexist !== typeof undefined && isdatacolexist !== false) {
                        $("#" + ID).attr("data-columnold", isdatacolexist);
                    } else {
                        $("#" + ID).attr("data-columnold", $(".lblcolname").val());
                    }
                    $("#" + ID).attr("data-column", $(".lblcolname").val());
                    $("#" + ID).html("");

                    var allTextArray = $('.option-block').map(function () {
                        if ($(this).find("[placeholder=Key]").val() != '')

                            return $(this).find("[placeholder=Key]").val()
                    }).get();
                    var duplicateTextArray = allTextArray.filter(function (element, pos) {
                        if (allTextArray.indexOf(element) != pos) {
                            return true;
                        }
                        else {
                            return false;
                        }

                    });
                    var allValueArray = $('.option-block').map(function () {
                        if ($(this).find("[placeholder=Value]").val() != '')

                            return $(this).find("[placeholder=Value]").val()
                    }).get();
                    var duplicateValueArray = allValueArray.filter(function (element, pos) {
                        if (allValueArray.indexOf(element) != pos) {
                            return true;
                        }
                        else {
                            return false;
                        }

                    });
                    if (duplicateValueArray.length != 0) {
                        toastr.error("", "Option value can not be duplicate", { progressBar: true });
                        return;
                    }
                    if (duplicateTextArray.length != 0) {
                        toastr.error("", "Option text can not be duplicate", { progressBar: true });
                        return;
                    }
                    $(".option-block").each(function (index) {

                        var option_data = "<option value=" + $(this).find("[placeholder=Value]").val() + ">" + $(this).find("[placeholder=Key]").val() + "</option>";
                        $(option_data).appendTo('#' + ID);
                    });
                    if ($("#required-input").prop("checked")) {
                        $("#" + ID).prev().addClass("required-asterisk");
                    } else {
                        $("#" + ID).prev().removeClass("required-asterisk");
                    }
                    if ($(".labeltop").prop("checked")) {
                        $("#" + ID).closest(".form-group").removeClass("f-g-left");
                        $("#" + ID).closest(".form-group").find('label:first-child').removeClass("label-left");
                    } else if ($(".labelleft").prop("checked")) {
                        $("#" + ID).closest(".form-group").addClass("f-g-left");
                        $("#" + ID).closest(".form-group").find('label:first-child').addClass("label-left");
                    }
                    $("#" + ID).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12 invalid-field").addClass($("#inputsize").val());
                    $("#exampleModalCenter").modal("hide");
                }
            });
            break;
        case "text":
            var selectedvarcharcol = false;
            var selectedcolsize = "";
            var isrequired = $("#" + ID).prev().hasClass("required-asterisk");

            popupString = `<div class="modal-row custom-control custom-checkbox">`;
            if (isrequired) {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" checked>';
            } else {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" >'
            }
            popupString += `<label class="custom-control-label" for="required-input">Required</label></div>`;

            popupString += `<div class="modal-row"><label>Label position: </label><div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labeltop" id="label-top" name="radio-position" value="top" ${ $("#" + ID).closest(".form-group").hasClass("f-g-left") ? "" : "checked"}>
    <label class="custom-control-label" for="label-top">top</label></div>
    <div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labelleft" id="label-left" name="radio-position" value="left"  ${ $("#" + ID).closest(".form-group").hasClass("f-g-left") ? "checked" : ""}>
    <label class="custom-control-label" for="label-left">left</label></div>
    </div>`;

            popupString += '<div class="modal-row">' +
                '<label>Label Text</label>' +
                '<input  type="text" control-id="' + ID + '" class="form-control lbltext" onkeyup="ValidateColumnName(this)" value="' + $("#" + ID).prev().html() + '"/>' +
                '</div>';
            if (typeof isdatacolexist !== typeof undefined && isdatacolexist !== false) {
                popupString += '<div class="modal-row"><label>Column Name</label><input type="text" class="form-control lblcolname" value="' + $("#" + ID).attr("data-column") + '"></div>';

            } else {
                popupString += '<div class="modal-row"><label>Column Name</label><input type="text" class="form-control lblcolname" value=""></div>';
            }
            popupString += `<div class="form-row">
                                    <div class="form-group col-md-6">
                                    <label class="control-label"> Column Type </label>
                                    <select class="form-control" id="coltype" onchange="CheckColumnType(this)">`;
            if ($("#" + ID).attr("data-columntype")) {
                selectedvarcharcol = $("#" + ID).attr("data-columntype").includes("varchar");
                if (selectedvarcharcol) {
                    var coltype = $("#" + ID).attr("data-columntype");
                    selectedcolsize = coltype.substring(8, coltype.length - 1);
                    popupString += `<option value="varchar(#size)" selected>varchar</option>
                                            <option value="int" disabled>int</option>
                                            </select>
                                            </div>`
                } else {
                    popupString += `<option value="varchar(#size)">varchar</option>
                                            <option value="int" selected>int</option>
                                            </select>
                                            </div>`
                }
            } else {
                popupString += `<option value="varchar(#size)">varchar</option>
                                    <option value="int">int</option>
                                    </select>
                                    </div>`
            }

            popupString += `<div class="form-group col-md-6">
                                    <label class="control-label"> Size </label>`
            if ($("#" + ID).attr("data-columntype")) {
                if (selectedvarcharcol != true)
                    popupString += `<select class="form-control" id="colsize" disabled>`
                else
                    popupString += `<select class="form-control" id="colsize">`
            } else {
                popupString += `<select class="form-control" id="colsize">`
            }
            switch (selectedcolsize) {
                case "50":
                    popupString += `<option value="50" selected>50</option>
                                    <option value="100">100</option>
                                    <option value="150">150</option>
                                    <option value="200">200</option>
                                    <option value="250">250</option>
                                    <option value="300">300</option>
                                    <option value="350">350</option>
                                    <option value="400">400</option>
                                    <option value="450">450</option>
                                    <option value="500">500</option>
                                    <option value="max">max</option>
                                    </select>
                                    </div></div> `;
                    break;
                case "100":
                    popupString += `<option value="50" disabled>50</option>
                                    <option value="100" selected>100</option>
                                    <option value="150">150</option>
                                    <option value="200">200</option>
                                    <option value="250">250</option>
                                    <option value="300">300</option>
                                    <option value="350">350</option>
                                    <option value="400">400</option>
                                    <option value="450">450</option>
                                    <option value="500">500</option>
                                    <option value="max">max</option>
                                    </select>
                                    </div></div> `;
                    break;
                case "150":
                    popupString += `<option value="50" disabled>50</option>
                                    <option value="100" disabled>100</option>
                                    <option value="150" selected>150</option>
                                    <option value="200">200</option>
                                    <option value="250">250</option>
                                    <option value="300">300</option>
                                    <option value="350">350</option>
                                    <option value="400">400</option>
                                    <option value="450">450</option>
                                    <option value="500">500</option>
                                    <option value="max">max</option>
                                    </select>
                                    </div></div> `;
                    break;
                case "200":
                    popupString += `<option value="50" disabled>50</option>
                                    <option value="100" disabled>100</option>
                                    <option value="150" disabled>150</option>
                                    <option value="200" selected>200</option>
                                    <option value="250">250</option>
                                    <option value="300">300</option>
                                    <option value="350">350</option>
                                    <option value="400">400</option>
                                    <option value="450">450</option>
                                    <option value="500">500</option>
                                    <option value="max">max</option>
                                    </select>
                                    </div></div> `;
                    break;
                case "250":
                    popupString += `<option value="50" disabled>50</option>
                                    <option value="100" disabled>100</option>
                                    <option value="150" disabled>150</option>
                                    <option value="200" disabled>200</option>
                                    <option value="250" selected>250</option>
                                    <option value="300">300</option>
                                    <option value="350">350</option>
                                    <option value="400">400</option>
                                    <option value="450">450</option>
                                    <option value="500">500</option>
                                    <option value="max">max</option>
                                    </select>
                                    </div></div> `;
                    break;
                case "300":
                    popupString += `<option value="50" disabled>50</option>
                                    <option value="100" disabled>100</option>
                                    <option value="150" disabled>150</option>
                                    <option value="200" disabled>200</option>
                                    <option value="250" disabled>250</option>
                                    <option value="300" selected>300</option>
                                    <option value="350">350</option>
                                    <option value="400">400</option>
                                    <option value="450">450</option>
                                    <option value="500">500</option>
                                    <option value="max">max</option>
                                    </select>
                                    </div></div> `;
                    break;
                case "350":
                    popupString += `<option value="50" disabled>50</option>
                                    <option value="100" disabled>100</option>
                                    <option value="150" disabled>150</option>
                                    <option value="200" disabled>200</option>
                                    <option value="250" disabled>250</option>
                                    <option value="300" disabled>300</option>
                                    <option value="350" selected>350</option>
                                    <option value="400">400</option>
                                    <option value="450">450</option>
                                    <option value="500">500</option>
                                    <option value="max">max</option>
                                    </select>
                                    </div></div> `;
                    break;
                case "400":
                    popupString += `<option value="50" disabled>50</option>
                                    <option value="100" disabled>100</option>
                                    <option value="150" disabled>150</option>
                                    <option value="200" disabled>200</option>
                                    <option value="250" disabled>250</option>
                                    <option value="300" disabled>300</option>
                                    <option value="350" disabled>350</option>
                                    <option value="400" selected>400</option>
                                    <option value="450">450</option>
                                    <option value="500">500</option>
                                    <option value="max">max</option>
                                    </select>
                                    </div></div> `;
                    break;
                case "450":
                    popupString += `<option value="50" disabled>50</option>
                                    <option value="100" disabled>100</option>
                                    <option value="150" disabled>150</option>
                                    <option value="200" disabled>200</option>
                                    <option value="250" disabled>250</option>
                                    <option value="300" disabled>300</option>
                                    <option value="350" disabled>350</option>
                                    <option value="400" disabled>400</option>
                                    <option value="450" selected>450</option>
                                    <option value="500">500</option>
                                    <option value="max">max</option>
                                    </select>
                                    </div></div> `;
                    break;
                case "500":
                    popupString += `<option value="50" disabled>50</option>
                                    <option value="100" disabled>100</option>
                                    <option value="150" disabled>150</option>
                                    <option value="200" disabled>200</option>
                                    <option value="250" disabled>250</option>
                                    <option value="300" disabled>300</option>
                                    <option value="350" disabled>350</option>
                                    <option value="400" disabled>400</option>
                                    <option value="450" disabled>450</option>
                                    <option value="500" selected>500</option>
                                    <option value="max">max</option>
                                    </select>
                                    </div></div> `;
                    break;
                case "max":
                    popupString += `<option value="50" disabled>50</option>
                                    <option value="100" disabled>100</option>
                                    <option value="150" disabled>150</option>
                                    <option value="200" disabled>200</option>
                                    <option value="250" disabled>250</option>
                                    <option value="300" disabled>300</option>
                                    <option value="350" disabled>350</option>
                                    <option value="400" disabled>400</option>
                                    <option value="450" disabled>450</option>
                                    <option value="500" disabled>500</option>
                                    <option value="max" selected>max</option>
                                    </select>
                                    </div></div> `;
                    break;
                default:
                    popupString += `<option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="150">150</option>
                                    <option value="200">200</option>
                                    <option value="250">250</option>
                                    <option value="300">300</option>
                                    <option value="350">350</option>
                                    <option value="400">400</option>
                                    <option value="450">450</option>
                                    <option value="500">500</option>
                                    <option value="max">max</option>
                                    </select>
                                    </div></div> `;
                    break;

            }
            var isfieldmd4 = $("#" + ID).hasClass("col-md-4") ? "selected" : "";
            var isfieldmd6 = $("#" + ID).hasClass("col-md-6") ? "selected" : "";
            var isfieldmd12 = $("#" + ID).hasClass("col-md-12") ? "selected" : "";
            if (isfieldmd4 == "" && isfieldmd6 == "" && isfieldmd12 == "") isfieldmd12 = "selected";


            var ismd4 = $("#" + ID).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $("#" + ID).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $("#" + ID).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Field Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="inputsize" onchange="CheckFieldSize(this)">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + ismd12 + '>Large</option>' +
                '</select></div></div>';

            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Input Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="fieldsize">' +
                '<option value="col-md-4" ' + isfieldmd4 + '>Small</option>' +
                '<option value="col-md-6" ' + isfieldmd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + isfieldmd12 + '>Large</option>' +
                '</select></div></div>';
            popupString += '</div>';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($(".lbltext").val() == "") {
                    toastr.error("", "Label text is required", { progressBar: true });
                    return;
                }
                if ($(".lblcolname").val() == "") {
                    toastr.error("", "Column name is required", { progressBar: true });
                    return;
                }
                if (!ValidateColumn($(".lblcolname").val())) {
                    toastr.error("", "Enter a vaild column name", { progressBar: true })
                    return;
                }
                if (isColumnNameValid($(".lblcolname").val(), ID)) {
                    $("#" + ID).prev().html($(".lbltext").val());
                    if (typeof isdatacolexist !== typeof undefined && isdatacolexist !== false) {
                        $("#" + ID).attr("data-columnold", isdatacolexist);
                    } else {
                        $("#" + ID).attr("data-columnold", $(".lblcolname").val());
                    }
                    $("#" + ID).attr("data-column", $(".lblcolname").val());
                    if ($("#required-input").prop("checked")) {
                        $("#" + ID).prev().addClass("required-asterisk");
                    } else {
                        $("#" + ID).prev().removeClass("required-asterisk");
                    }
                    var coltype = '';
                    switch ($("#coltype").val()) {
                        case "varchar(#size)":
                            var coltypeoption = $("#coltype").val();
                            coltype = coltypeoption.replace("#size", $("#colsize").val());
                            break;
                        case "int":
                            coltype = "int";
                            break;
                    }
                    $("#" + ID).attr("data-columntype", coltype);
                    if ($(".labeltop").prop("checked")) {
                        $("#" + ID).closest(".form-group").removeClass("f-g-left");
                        $("#" + ID).closest(".form-group").find('label:first-child').removeClass("label-left");
                    } else if ($(".labelleft").prop("checked")) {
                        $("#" + ID).closest(".form-group").addClass("f-g-left");
                        $("#" + ID).closest(".form-group").find('label:first-child').addClass("label-left");
                    }
                    $("#" + ID).removeClass("col-md-4 col-md-6 col-md-12").addClass($("#fieldsize").val());
                    $("#" + ID).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12 invalid-field").addClass($("#inputsize").val());
                    $("#exampleModalCenter").modal("hide");
                }
            });
            break;
        case "textarea":

            var isrequired = $("#" + ID).prev().hasClass("required-asterisk");
            popupString = `<div class="modal-row custom-control custom-checkbox">`;
            if (isrequired) {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" checked>';
            } else {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" >'
            }
            popupString += `<label class="custom-control-label" for="required-input">Required</label></div>`;
            popupString += `<div class="modal-row"><label>Label position: </label><div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labeltop" id="label-top" name="radio-position" value="top" ${ $("#" + ID).closest(".form-group").hasClass("f-g-left") ? "" : "checked"}>
    <label class="custom-control-label" for="label-top">top</label></div>
    <div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labelleft" id="label-left" name="radio-position" value="left"  ${ $("#" + ID).closest(".form-group").hasClass("f-g-left") ? "checked" : ""}>
    <label class="custom-control-label" for="label-left">left</label></div>
    </div>`;
            popupString += '<div class="modal-row">' +
                '<label>Label Text</label>' +
                '<input  type="text" control-id="' + ID + '" class="form-control lbltext" onkeyup="ValidateColumnName(this)" value="' + $("#" + ID).prev().html() + '"/>' +
                '</div>';
            if (typeof isdatacolexist !== typeof undefined && isdatacolexist !== false) {
                popupString += '<div class="modal-row"><label>Column Name</label><input type="text" class="form-control lblcolname" value="' + $("#" + ID).attr("data-column") + '"></div>';

            } else {
                popupString += '<div class="modal-row"><label>Column Name</label><input type="text" class="form-control lblcolname" value=""></div>';
            }
            var ismd4 = $("#" + ID).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $("#" + ID).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $("#" + ID).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Input Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="inputsize">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + ismd12 + '>Large</option>' +
                '</select></div></div>';
            popupString += '</div>';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($(".lbltext").val() == "") {
                    toastr.error("", "Label text is required", { progressBar: true });
                    return;
                }
                if ($(".lblcolname").val() == "") {
                    toastr.error("", "Column name is required", { progressBar: true });
                    return;
                }

                if (!ValidateColumn($(".lblcolname").val())) {
                    toastr.error("", "Enter a vaild column name", { progressBar: true })
                    return;
                }
                if (isColumnNameValid($(".lblcolname").val(), ID)) {
                    $("#" + ID).prev().html($(".lbltext").val());
                    if (typeof isdatacolexist !== typeof undefined && isdatacolexist !== false) {
                        $("#" + ID).attr("data-columnold", isdatacolexist);
                    } else {
                        $("#" + ID).attr("data-columnold", $(".lblcolname").val());
                    }
                    $("#" + ID).attr("data-column", $(".lblcolname").val());
                    if ($("#required-input").prop("checked")) {
                        $("#" + ID).prev().addClass("required-asterisk");
                    } else {
                        $("#" + ID).prev().removeClass("required-asterisk");
                    }
                    if ($(".labeltop").prop("checked")) {
                        $("#" + ID).closest(".form-group").removeClass("f-g-left");
                        $("#" + ID).closest(".form-group").find('label:first-child').removeClass("label-left");
                    } else if ($(".labelleft").prop("checked")) {
                        $("#" + ID).closest(".form-group").addClass("f-g-left");
                        $("#" + ID).closest(".form-group").find('label:first-child').addClass("label-left");
                    }
                    $("#" + ID).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12 invalid-field").addClass($("#inputsize").val());
                    $("#exampleModalCenter").modal("hide");
                }
            });
            break;
        default:
            var ismd4 = $("#" + ID).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $("#" + ID).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $("#" + ID).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";
            popupString = '<div class="modal-row">' +
                '<label class="control-label"> Field Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="inputsize">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12"  ' + ismd12 + '>Large</option>' +
                '</select></div>';
            popupString += '</div>';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                $("#" + ID).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12").addClass($("#inputsize").val());
                $("#exampleModalCenter").modal("hide");
            });
            break;
    }
    $(".modal-body").html(popupString);
    if (type == "label") {
        $('.lbltext').summernote({
            placeholder: 'Type here ',
            height: 300,
            focus: true

        });
        $(".modal-dialog").css("max-width", "80%");
    } else {
        $(".modal-dialog").removeAttr("style");
    }
    $("#exampleModalCenter").modal("show");
}
//RemoveOption=>use to remove option of select,radio,checkbox inside popup
function RemoveOption(obj) {
    obj.closest(".option-block").remove();
};
//RemoveControl=>use to remove control from dropable section
function RemoveControl(obj) {
    obj.closest(".dragresize").remove();
}
//addoption=>use to add new option for select,radio,checkbox inside popup
function addoption(obj) {
    var popupString = '<div class="option-block">' +
        '<div class="option-fields">' +
        ' <input type="text" placeholder="Key" class="form-control"/>' +
        ' <input type="text" placeholder="Value" class="form-control"/>' +
        '</div>' +
        '<div class="popup-event-btn">' +
        '<button class="event-btn file-edit" onclick="addoption(this)"><i class="fas fa-plus"></i></button>' +
        '<button class="event-btn file-remove" onclick="RemoveOption(this)"> <i class="fa fa-minus-circle" aria-hidden="true"></i></button > ' +
        '</div></div>';

    obj.closest(".option-block").after(parseHTML(popupString));
}
//parseHTML=>use inside addoption function to add new block
function parseHTML(htmlstr) {
    var t = document.createElement('template');
    t.innerHTML = htmlstr;
    return t.content.cloneNode(true);
}
//PreviewForm=>use to redirect on preview form page
function PreviewForm() {
    if (templateId == 0) return;
    window.location.href = `/home/GetCarePlanForm?Id=${templateId}&patientid=0`;
}
//CheckColumnType=>use to check column type for text field inside popup
function CheckColumnType(e) {
    if ($(e).val() == "int") {
        $("#colsize").val("50");
        $("#colsize").attr("disabled", "disabled");
    } else {
        $("#colsize").removeAttr("disabled");
    }
}
//CheckFieldSize=>use to set field width accroding to input container width
function CheckFieldSize(e) {
    switch ($(e).val()) {
        case "col-md-4":
            $(e).parent().parent().next().find("select[id='fieldsize'] option").each(function (index, value) {
                if (index > 0) {
                    $(this).attr('disabled', true);
                }
            });
            break;
        case "col-md-6":
            $(e).parent().parent().next().find("select[id='fieldsize'] option").each(function (index, value) {
                if (index > 1) {
                    $(this).attr('disabled', true);
                }
            });
            break;
        case "col-md-12":
            $(e).parent().parent().next().find("select[id='fieldsize'] option").each(function (index, value) {
                $(this).attr('disabled', false);
            });
            break;
        default:

            break;
    }
}
//isColumnNameValid=>use to validate duplicate column name
function isColumnNameValid(colname, controlid) {
    var isvalid = true;
    $("#droppable").find("input,select,textarea").each(function (index, item) {
        if ($(item).attr("data-column") == colname && $(item).attr("id") != controlid) {
            var labelName = '';
            if ($(item).is("input")) {
                switch ($(item).attr("type")) {
                    case "text":
                    case "date":
                    case "number":
                    case "file":
                        var id = $(item).attr("id");
                        labelName = $("#" + id).prev().html();
                        break;
                    case "radio":
                        var id = $(item).parent().parent().attr("id");
                        labelName = $("#" + id).find(".radiobox-group").html();
                        break;
                    case "checkbox":
                        var id = $(item).parent().parent().attr("id");
                        labelName = $("#" + id).find(".checkbox-group").html();
                        break;
                }

            } else if ($(item).is("select")) {
                var id = $(item).attr("id");
                labelName = $("#" + id).prev().html();
            } else if ($(item).is("textarea")) {
                var id = $(item).attr("id");
                labelName = $("#" + id).prev().html();
            }
            toastr.error("", colname + " already exist", { progressBar: true });
            isvalid = false;
        }
    });
    return isvalid;
}
//ValidateColumn=>use to enter only alphabat for column name
function ValidateColumn(name) {
    var columnname = new RegExp("^[a-zA-Z0-9_]*$");
    if (columnname.test(name)) {
        return true;
    } else {
        return false;
    }
}
//ShowPreviewButton=>use to show preview button on page
function ShowPreviewButton() {
    if (templatePath != "" && templatePath.includes(programName.replace(/ /g, ''))) {
        $(".preview").css("display", "inline");
    }
}
//saveHtml=>use to save template and create table in database for program
function saveHtml() {
    if ($("#droppable .dragresize").length == 0) {
        toastr.error("", "Please drag field here", { progressBar: true });
        return;
    }
    var isvalid = true;
    $("#droppable").find("input,select,textarea").each(function (index, item) {
        var colname = $(item).attr("data-column");
        if (typeof colname !== typeof undefined && colname !== false) {
        }
        else {
            if ($(item).is("input")) {
                switch ($(item).attr("type")) {
                    case "radio":
                    case "checkbox":
                        var datacol = $(item).parent().parent().find("input").first().attr("data-column");
                        if (typeof datacol !== typeof undefined && datacol !== false) {
                        } else {
                            $(item).closest(".dragresize").addClass("invalid-field");
                            isvalid = false;
                        }
                        break;
                    default:
                        if ($(item).hasClass("database-field")) return;
                        $(item).closest(".dragresize").addClass("invalid-field");
                        isvalid = false;
                        break;

                }
            }

        }
    });
    if (!isvalid) {

        toastr.error("", "All fields are required for control", { progressBar: true });
        return;
    }
    $("#droppable .database-field").each(function (i, e) {
        return;
    });
    var gethtml = $("#droppable").html();

    var model = {
        TemplateID: templateId,
        ProgramID: programId,
        IsActive: 1,
        CreatedBy: userId,
        ModifiedBy: userId,
    };
    $.ajax({
        type: "POST",
        url: '/CarePlan/SaveFormTemplate',
        data: JSON.stringify({ htmlTemplate: gethtml, Model: model, ProgramName: programName }),
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            if (result == "0") {
                toastr.error("Program Already Exist.");
                return false;
            } else {
                templateId = result.id;
            }

        }
    }).done(function (result) {
        if (result != "0") {
            var models = [];

            $("#droppable [type=text]").each(function (index, item) {
                if ($(item).hasClass("database-field")) return;
                models.push({ ColDataType: $(item).attr("data-columntype"), ColoumnName: $(item).attr("data-column"), PreviousColoumnName: $(item).attr("data-columnold") });
            });
            $("#droppable [type=number],[type=file],[type=date]").each(function (index, item) {
                models.push({ ColDataType: "varchar(500)", ColoumnName: $(item).attr("data-column"), PreviousColoumnName: $(item).attr("data-columnold") });
            });
            $("#droppable select").each(function (index, item) {
                models.push({ ColDataType: "varchar(500)", ColoumnName: $(item).attr("data-column"), PreviousColoumnName: $(item).attr("data-columnold") });
            });
            $("#droppable [type=radio]").each(function (index, item) {
                var radioitem = $(item).attr("data-column");
                if (typeof radioitem !== typeof undefined && radioitem !== false) {
                    models.push({ ColDataType: "varchar(500)", ColoumnName: $(item).attr("data-column"), PreviousColoumnName: $(item).attr("data-columnold") });
                }
            });
            $("#droppable [type=checkbox]").each(function (index, item) {
                var checkitem = $(item).attr("data-column");
                if (typeof checkitem !== typeof undefined && checkitem !== false) {
                    models.push({ ColDataType: "varchar(500)", ColoumnName: $(item).attr("data-column"), PreviousColoumnName: $(item).attr("data-columnold") });
                }
            });
            $("#droppable textarea").each(function (index, item) {
                models.push({ ColDataType: "varchar(max)", ColoumnName: $(item).attr("data-column"), PreviousColoumnName: $(item).attr("data-columnold") });
            });
            $("#droppable [type=button]").each(function (index, item) {
                models.push({ ColDataType: "varchar(500)", ColoumnName: $(item).attr("data-column"), PreviousColoumnName: $(item).attr("data-columnold") });
            });

            var UniqueItems = models.reduce(function (item, e1) {

                var matches = item.filter(function (e2) { return e1.ColoumnName == e2.ColoumnName });
                if (matches.length == 0) {
                    item.push(e1);
                }
                return item;
            }, []);

            var model = {
                TableName: result.tablename,
                ColoumnName: Array.prototype.map.call(UniqueItems, function (item) { return item.ColoumnName; }).join(","),
                PreviousColoumnName: Array.prototype.map.call(UniqueItems, function (item) { return item.PreviousColoumnName; }).join(","),
                ColDataType: Array.prototype.map.call(UniqueItems, function (item) { return item.ColDataType; }).join(",")
            }
            $.ajax({
                type: "POST",
                url: Apipath + '/api/PatientMain/savetemplatecolumn',
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify(model),
                dataType: "json",
                success: function (res) {
                    toastr.success("Saved successfully.");
                    $("a.preview").css("display", "inline");
                    window.location.href = '/careplan/modifytemplate?TemplateId=' + result.id + '&ProgramId=' + programId + '&Template=' + result.TemplateName;
                },
            });
        }
    });
}
//saveHtml=>use to save template in careplantemplate
function saveDraftHtml() {
    if ($("#droppable .dragresize ").length == 0) {
        toastr.error("", "Please drag field here", { progressBar: true });
        return;
    }
    //var invalidcount = 0;
    //$("#droppable .form-group label:first-child").each(function (index, item) {
    //    if ($(item).text() == "Label" || $(item).text() == "Check Box (Multiple)" || $(item).text() == "Radio" || $(item).text() == "Select" || $(item).text() == "Textarea") {
    //        invalidcount += 1;

    //    }
    //});
    //if (invalidcount > 0) {

    //    toastr.error("", "Please set valid field title", { progressBar: true });
    //    return;
    //}
    var isvalid = true;
    $("#droppable").find("input,select,textarea").each(function (index, item) {
        var colname = $(item).attr("data-column");
        if (typeof colname !== typeof undefined && colname !== false) {
        } else {
            if ($(item).is("input")) {
                switch ($(item).attr("type")) {
                    case "radio":
                    case "checkbox":
                        var datacol = $(item).parent().parent().find("input").first().attr("data-column");
                        if (typeof datacol !== typeof undefined && datacol !== false) {
                        } else {
                            $(item).closest(".dragresize").addClass("invalid-field");
                            isvalid = false;
                        }
                        break;
                    default:
                        if($(item).hasClass("database-field")) return;
                        $(item).closest(".dragresize").addClass("invalid-field");
                        isvalid = false;
                        break;

                }
            }

        }

    });
    if (!isvalid) {

        toastr.error("", "All fields are required for control", { progressBar: true });
        return;
    }
    $("#droppable .database-field").each(function (i, e) {
        return;
    })
    var gethtml = $("#droppable").html();
    var model = {
        TemplateID: templateId,
        ProgramID: programId,
        IsSavedDraft: 1,
        CreatedBy: userId,
        ModifiedBy: userId,
    };
    $.ajax({
        type: "POST",
        url: '/CarePlan/SaveFormDraftTemplate',
        data: JSON.stringify({ htmlTemplate: gethtml, Model: model, ProgramName: programName }),
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            if (result == "0") {
                toastr.error("Program Already Exist.");
                return false;
            } else {
                templateId = result.id;
                $("a.preview").css("display", "inline");
                window.location.href = '/careplan/modifytemplate?TemplateId=' + result.id + '&ProgramId=' + programId + '&Template=' + result.TemplateName;

            }
            toastr.success("Draft Saved successfully.");
        }
    });
}
//GetFormByTemplatePath=>use to get template by template name
function GetFormByTemplatePath(path) {
    $.ajax({
        type: "GET",
        url: '/careplan/getformhtmlbypath?PathName=' + path,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {

        },
    }).done(function (result) {
        $.ajax({
            type: "GET",
            url: Apipath + '/api/PatientMain/GetCarePlanTemplateByID?ID=' + templateId,
            contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            success: function (response) {
                if (response != "" && response != null) {
                    if (response.IsActive) {
                        $(".btndraft").css("display", "none");
                    } else {
                        $(".btndraft").css("display", "inline");
                    }

                }
                $("#droppable").html(result.html);
            }
        });

    });
}

function ValidateColumnName(e) {
    //var item = $(e).val();
    //$(e).parent().next().find(".lblcolname").val(item.split(" ").join("").replace(/[_\W]+/g, ""));
}
function validatepopup(e) {
    //var ControlID = $(e).parent().next().find(".lbltext").attr("control-id");
    //var colname = $("#" + ControlID).attr("data-column");
    //if (typeof colname !== typeof undefined && colname !== false) {
    //} else {
    //    $("#" + ControlID).closest(".dragresize").remove();
    //}
    //var isInvalid = false;
    //if ($(".lbltext").val().trim() == "") {
    //    isInvalid = true;
    //}
    //if ($(".lblcolname").val().trim() == "") {
    //    isInvalid = true;
    //}
    //if (isInvalid) {
    //    toastr.error("", "Label text or column name is required", { progressBar: true });
    //    $(e).removeAttr("data-dismiss");
    //    return;
    //} else {
    //    $(e).attr("data-dismiss", "modal");
    //    return;
    //}
}